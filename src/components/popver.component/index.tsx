import { Overlay } from "@/components/overlay.component";
import { useOnClickOutside, useOnKeyDown } from "@/hooks";
import { Placement } from "@popperjs/core";
import clsx from "clsx";
import React, {
	FC,
	ReactElement,
	ReactNode,
	ReactText,
	useCallback,
	useEffect,
	useState
} from "react";
import { Modifier, usePopper } from "react-popper-2";
import classes from "./styles.module.scss";
import transitions from "./transitions.module.scss";

const POPPER_OFFSET = 17;

interface IProps {
	canEscapeKeyClose?: boolean;
	canOutsideClickClose?: boolean;
	children?: ReactNode;
	className?: string;
	classNamePopper?: string;
	content?: ReactText | ReactElement;
	disabled?: boolean;
	isOpen?: boolean;
	minimal?: boolean;
	modifiers?: readonly Modifier<any>[];
	onClose?: () => void;
	position?: Placement;
	usePortal?: boolean;
}

export const Popover: FC<IProps> = ({
	canEscapeKeyClose = true,
	canOutsideClickClose = true,
	children,
	className,
	classNamePopper,
	content,
	disabled = false,
	isOpen: _isOpen = false,
	minimal = false,
	modifiers = [],
	onClose: _onClose,
	position = "bottom-start",
	usePortal = true
}) => {
	const [isOpen, setIsOpen] = useState<boolean>(Boolean(_isOpen));

	useEffect(() => setIsOpen(_isOpen), [_isOpen]);

	const onClose = useCallback(() => {
		if (typeof isOpen !== "boolean") {
			setIsOpen(false);
		}

		_onClose?.();
	}, [_onClose, isOpen]);

	const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
	const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
	const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);

	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		modifiers: [
			...modifiers,
			// Due to transition on scale, disable gpuAcceleration to not position with translate
			{ name: "computeStyles", options: { adaptive: false, gpuAcceleration: false } },
			{ name: "offset", options: { offset: [0, POPPER_OFFSET] } },
			...(minimal ? [] : [{ name: "arrow", options: { element: arrowElement } }])
		],
		placement: position
	});

	useOnClickOutside({ current: popperElement }, () => {
		if (canOutsideClickClose) {
			onClose?.();
		}
	});

	useOnKeyDown({ global: true, key: "esc" }, () => {
		if (canEscapeKeyClose) {
			onClose?.();
		}
	});

	return (
		<>
			<span ref={setReferenceElement} className={clsx(className, "uitk-popover")}>
				{children}
			</span>
			<Overlay
				className="uitk-overlay"
				isOpen={!disabled && isOpen}
				transitions={minimal ? {} : transitions}
				usePortal={usePortal}
			>
				<div
					ref={setPopperElement}
					className={clsx(classes.popover, classNamePopper, "uitk-popper")}
					style={styles.popper}
					{...attributes.popper}
				>
					{!minimal && (
						<div
							ref={setArrowElement}
							className={clsx(classes.popoverArrow, "uitk-arrow")}
							style={styles.arrow}
						/>
					)}
					{content}
				</div>
			</Overlay>
		</>
	);
};
