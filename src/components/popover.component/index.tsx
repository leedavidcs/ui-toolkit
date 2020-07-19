import { useOnClickOutside, useOnKeyDown } from "@/hooks";
import { Placement } from "@popperjs/core";
import clsx from "clsx";
import React, {
	forwardRef,
	memo,
	ReactElement,
	ReactNode,
	ReactText,
	useCallback,
	useEffect,
	useMemo,
	useState
} from "react";
import { createPortal } from "react-dom";
import { Modifier, usePopper } from "react-popper-2";
import classes from "./styles.module.scss";

const POPPER_OFFSET = 17;

interface IProps {
	canEscapeKeyClose?: boolean;
	canOutsideClickClose?: boolean;
	children: ReactNode;
	className?: string;
	classNamePopover?: string;
	classNameTarget?: string;
	content?: ReactText | ReactElement;
	disabled?: boolean;
	isOpen?: boolean;
	minimal?: boolean;
	modifiers?: readonly Modifier<any>[];
	position?: Placement;
	onClose?: () => void;
	usePortal?: boolean;
}

export const Popover = memo(
	forwardRef<HTMLSpanElement, IProps>((props, ref) => {
		const {
			canEscapeKeyClose = true,
			canOutsideClickClose = true,
			children,
			className,
			classNamePopover,
			classNameTarget,
			content: _content,
			disabled = false,
			isOpen: _isOpen,
			minimal = false,
			modifiers,
			onClose: _onClose,
			position,
			usePortal = true
		} = props;

		const [isOpen, setIsOpen] = useState<boolean>(Boolean(_isOpen));

		const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
		const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
		const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);

		const { styles, attributes } = usePopper(referenceElement, popperElement, {
			modifiers: [
				...(minimal
					? []
					: [
							{ name: "arrow", options: { element: arrowElement } },
							{ name: "offset", options: { offset: [0, POPPER_OFFSET] } }
					  ]),
				...(modifiers ?? [])
			],
			placement: position
		});

		const onClose = useCallback(() => {
			_onClose?.();

			setIsOpen(_isOpen ?? false);
		}, [_isOpen, _onClose]);

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

		const contentElement: ReactElement = useMemo(() => {
			const content: ReactElement = (
				<div
					ref={setPopperElement}
					className={clsx(classes.popover, classNamePopover)}
					style={styles.popper}
					{...attributes.popper}
				>
					{!minimal && (
						<div
							ref={setArrowElement}
							className={classes.popoverArrow}
							style={styles.arrow}
						/>
					)}
					{_content}
				</div>
			);

			return usePortal ? createPortal(content, document.body) : content;
		}, [
			_content,
			attributes.popper,
			classNamePopover,
			minimal,
			styles.arrow,
			styles.popper,
			usePortal
		]);

		const onClickTarget = useCallback(() => setIsOpen(_isOpen ?? true), [_isOpen]);

		useEffect(() => {
			if (typeof _isOpen === "boolean") {
				setIsOpen(_isOpen);
			}
		}, [_isOpen]);

		useEffect(() => {
			popperElement?.classList.toggle(classes.opened, Boolean(isOpen));
		}, [isOpen, popperElement]);

		return (
			<span ref={ref} className={clsx({ [classes.minimal]: minimal }, className)}>
				<span
					ref={setReferenceElement}
					className={clsx(classes.popoverTarget, classNameTarget)}
					onClick={onClickTarget}
				>
					{children}
				</span>
				{!disabled && isOpen && contentElement}
			</span>
		);
	})
);

Popover.displayName = "Popover";
