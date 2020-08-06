import { Overlay } from "@/components/overlay.component";
import { useOnClickOutside, useOnKeyDown, useUncontrolledProp } from "@/hooks";
import { Placement } from "@popperjs/core";
import clsx from "clsx";
import React, { FC, ReactNode, useCallback, useMemo, useState } from "react";
import { Modifier, usePopper } from "react-popper-2";
import classes from "./styles.module.scss";
import transitions from "./transitions.module.scss";

const POPPER_OFFSET = 17;
const ARROW_PADDING = 10;

const transitionDuration = {
	enter: 300,
	exit: 100
};

export enum PopoverPosition {
	TOP = "top",
	TOP_START = "top-start",
	TOP_END = "top-end",
	BOTTOM = "bottom",
	BOTTOM_START = "bottom-start",
	BOTTOM_END = "bottom-end",
	LEFT = "left",
	LEFT_START = "left-start",
	LEFT_END = "left-end",
	RIGHT = "right",
	RIGHT_START = "right-start",
	RIGHT_END = "right-end"
}

interface IProps {
	canEscapeKeyClose?: boolean;
	canOutsideClickClose?: boolean;
	children?: ReactNode;
	className?: string;
	classNamePopper?: string;
	classNameContent?: string;
	content?: ReactNode;
	disabled?: boolean;
	isOpen?: boolean;
	minimal?: boolean;
	modifiers?: readonly Modifier<any>[];
	onClose?: () => void;
	position?: PopoverPosition | Placement;
	usePortal?: boolean;
}

export const Popover: FC<IProps> = ({
	canEscapeKeyClose = true,
	canOutsideClickClose = true,
	children,
	className,
	classNamePopper,
	classNameContent,
	content,
	disabled = false,
	isOpen: _isOpen,
	minimal = false,
	modifiers: _modifiers = [],
	onClose: _onClose,
	position = PopoverPosition.BOTTOM_START,
	usePortal = true
}) => {
	const [isOpen, setIsOpen] = useUncontrolledProp<boolean>(_isOpen, false);

	const onClose = useCallback(() => {
		setIsOpen(false);
		_onClose?.();
	}, [_onClose, setIsOpen]);

	const [referenceElem, setReferenceElement] = useState<HTMLElement | null>(null);
	const [popperElem, setPopperElement] = useState<HTMLElement | null>(null);
	const [arrowElem, setArrowElement] = useState<HTMLElement | null>(null);

	const modifiers: Modifier<any>[] = useMemo(() => {
		const minimalModifiers: Modifier<any>[] = [
			{ name: "arrow", options: { element: arrowElem, padding: ARROW_PADDING } },
			{ name: "offset", options: { offset: [0, POPPER_OFFSET] } }
		];

		return [
			..._modifiers,
			...(minimal ? [] : minimalModifiers),
			// Due to transition on scale, disable gpuAcceleration to not position with translate
			{ name: "computeStyles", options: { adaptive: false, gpuAcceleration: false } }
		];
	}, [_modifiers, arrowElem, minimal]);

	const { styles, attributes } = usePopper(referenceElem, popperElem, {
		modifiers,
		placement: position
	});

	useOnClickOutside({ current: popperElem }, () => {
		if (canOutsideClickClose) {
			onClose?.();
		}
	});

	useOnKeyDown({ global: true, key: "esc" }, () => {
		if (canEscapeKeyClose) {
			onClose?.();
		}
	});

	const onClickReference = useCallback(() => setIsOpen(true), [setIsOpen]);

	return (
		<>
			<span
				ref={setReferenceElement}
				className={clsx(classes.root, className, "uitk-popover")}
				onClick={onClickReference}
			>
				{children}
			</span>
			<Overlay
				className="uitk-overlay"
				hasBackdrop={false}
				isOpen={!disabled && isOpen}
				transitionDuration={transitionDuration}
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
					{content && (
						<div
							className={clsx(
								classes.popoverContent,
								classNameContent,
								"uitk-popper-content"
							)}
						>
							{content}
						</div>
					)}
				</div>
			</Overlay>
		</>
	);
};
