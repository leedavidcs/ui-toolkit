import { Overlay } from "@/components/overlay.component";
import { useOnKeyDown } from "@/hooks";
import clsx from "clsx";
import React, {
	forwardRef,
	ReactElement,
	ReactText,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
	useState
} from "react";
import ReactDOM from "react-dom";
import classes from "./styles.module.scss";
import { IToastProps, Toast } from "./toast.component";
import transitions from "./transitions.module.scss";

export enum ToasterPosition {
	TOP = "TOP",
	TOP_LEFT = "TOP_LEFT",
	TOP_RIGHT = "TOP_RIGHT",
	BOTTOM = "BOTTOM",
	BOTTOM_LEFT = "BOTTOM_LEFT",
	BOTTOM_RIGHT = "BOTTOM_RIGHT"
}

export interface IToasterProps {
	canEscapeKeyClear?: boolean;
	className?: string;
	maxToasts?: number;
	position?: ToasterPosition;
	usePortal?: boolean;
}

const useActions = (props: IToasterProps) => {
	const { maxToasts = Infinity } = props;

	const toastId = useRef<number>(0);

	const [toasts, setToasts] = useState<IToastProps[]>([]);

	const show = useCallback(
		(toastProps: IToastProps): ReactText => {
			const key: number = toastId.current++;

			setToasts((prevToasts) => {
				const newToasts: IToastProps[] = [{ ...toastProps, key }, ...prevToasts];

				return newToasts.slice(0, Math.min(newToasts.length, maxToasts));
			});

			return key;
		},
		[maxToasts]
	);

	const clear = useCallback((): void => {
		toasts.forEach((toast) => toast.onDismiss?.());

		setToasts(() => []);
	}, [toasts]);

	const dismiss = useCallback((key?: ReactText): void => {
		setToasts((prevToasts) =>
			prevToasts.filter((toast) => {
				const matchesKey: boolean = toast.key === key;

				if (matchesKey) {
					toast.onDismiss?.();
				}

				return !matchesKey;
			})
		);
	}, []);

	return useMemo(() => ({ show, clear, dismiss, toasts }), [clear, dismiss, toasts, show]);
};

const usePosition = (position: ToasterPosition) => {
	const isTop: boolean =
		position === ToasterPosition.TOP ||
		position === ToasterPosition.TOP_LEFT ||
		position === ToasterPosition.TOP_RIGHT;

	const isLeft: boolean =
		position === ToasterPosition.TOP_LEFT || position === ToasterPosition.BOTTOM_LEFT;
	const isRight: boolean =
		position === ToasterPosition.TOP_RIGHT || position === ToasterPosition.BOTTOM_RIGHT;

	return useMemo(() => ({ isTop, isLeft, isRight }), [isLeft, isRight, isTop]);
};

type IToaster = ReturnType<typeof useActions>;

export const Toaster = forwardRef<IToaster, IToasterProps>((props, ref) => {
	const {
		canEscapeKeyClear = false,
		className,
		position = ToasterPosition.TOP,
		usePortal = true
	} = props;

	const { show, clear, dismiss, toasts } = useActions(props);

	const { isTop, isLeft, isRight } = usePosition(position);

	const renderToast = useCallback(
		(toastProps: IToastProps): ReactElement => (
			<Toast {...toastProps} onDismiss={() => dismiss(toastProps.key)} />
		),
		[dismiss]
	);

	useOnKeyDown({ global: true, key: "esc" }, () => {
		if (canEscapeKeyClear) {
			clear();
		}
	});

	useImperativeHandle(ref, () => ({ show, clear, dismiss, toasts }));

	return (
		<Overlay
			className={clsx(
				classes.root,
				{
					[classes.top]: isTop,
					[classes.bottom]: !isTop,
					[classes.left]: isLeft,
					[classes.right]: isRight,
					[transitions.bottom]: !isTop
				},
				className
			)}
			isOpen={toasts.length > 0}
			transitions={transitions}
			usePortal={usePortal}
		>
			{toasts.map(renderToast)}
		</Overlay>
	);
});

Toaster.displayName = "Toaster";

export const createToaster = (options?: IToasterProps) => {
	let toaster: IToaster;

	const ref = (_toaster: IToaster) => (toaster = _toaster);

	const containerElement = document.createElement("div");

	document.body.appendChild(containerElement);

	ReactDOM.render(<Toaster ref={ref} {...options} />, containerElement);

	return {
		show: (props: IToastProps) => toaster.show(props),
		dismiss: () => toaster.dismiss(),
		clear: () => toaster.clear(),
		getToasts: () => toaster.toasts
	};
};

const t = createToaster({
	canEscapeKeyClear: true,
	position: ToasterPosition.BOTTOM_LEFT
});

export const useToaster = () => t;
