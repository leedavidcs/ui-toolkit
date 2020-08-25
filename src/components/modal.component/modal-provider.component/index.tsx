import { Modal } from "@/components/modal.component";
import { useOnClickOutside, useOnKeyDown } from "@/hooks";
import React, {
	forwardRef,
	ReactElement,
	ReactNode,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState
} from "react";
import ReactDOM from "react-dom";
import { IModalContextProps, ModalContext } from "./context";

interface IProps {
	canEscapeKeyClose?: boolean;
	canOutsideClickClose?: boolean;
	children?: ReactNode;
}

interface IUseModalProps {
	canEscapeKeyClose?: boolean;
	canOutsideClickClose?: boolean;
}

export const ModalProvider = forwardRef<IModalContextProps, IProps>((props, ref) => {
	const { canEscapeKeyClose = true, canOutsideClickClose = true, children } = props;

	const modalRef = useRef<HTMLDivElement>(null);

	const [active, setActive] = useState<boolean>(false);
	const [content, setContent] = useState<{ title: string; body: ReactElement } | null>(null);

	const toggle = useCallback((force?: boolean) => setActive(force ?? !active), [active]);

	const value = useMemo(() => ({ active, setContent, toggle }), [active, toggle]);

	useImperativeHandle(ref, () => value);

	useOnKeyDown({ global: true, key: "esc" }, () => {
		if (canEscapeKeyClose) {
			setActive(false);
		}
	});

	useOnClickOutside(modalRef, () => {
		if (canOutsideClickClose) {
			setActive(false);
		}
	});

	useEffect(() => {
		if (!content) {
			setActive(false);
		}
	}, [content]);

	return (
		<ModalContext.Provider value={value}>
			{children}
			<Modal ref={modalRef} isOpen={active} title={content?.title}>
				{content?.body}
			</Modal>
		</ModalContext.Provider>
	);
});

ModalProvider.displayName = "ModalProvider";

export const createModalMaker = (options?: IUseModalProps) => {
	let context: IModalContextProps;

	const ref = (contextProps: IModalContextProps) => (context = contextProps);

	const containerElement = document.createElement("div");

	document.body.appendChild(containerElement);

	ReactDOM.render(<ModalProvider ref={ref} {...options} />, containerElement);

	return {
		isActive: () => context.active,
		setContent: (content: { title: string; body: ReactElement } | null) => {
			return context.setContent(content);
		},
		toggle: (force?: boolean) => context.toggle(force)
	};
};

const modalMaker = createModalMaker({
	canEscapeKeyClose: true,
	canOutsideClickClose: true
});

export const useModal = () => modalMaker;
