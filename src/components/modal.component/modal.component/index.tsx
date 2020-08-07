import { Overlay } from "@/components/overlay.component";
import { useOnClickOutside, useOnKeyDown } from "@/hooks";
import composeRefs from "@seznam/compose-react-refs";
import clsx from "clsx";
import React, { forwardRef, KeyboardEvent, ReactNode, SyntheticEvent, useRef } from "react";
import classes from "./styles.module.scss";
import transitions from "./transitions.module.scss";

interface IProps {
	canEscapeKeyClose?: boolean;
	canOutsideKeyClose?: boolean;
	children?: ReactNode;
	className?: string;
	isOpen: boolean;
	onClose?: (event: SyntheticEvent<HTMLElement>) => void;
	title?: string;
}

export const Modal = forwardRef<HTMLDivElement, IProps>((props, ref) => {
	const {
		canEscapeKeyClose = true,
		canOutsideKeyClose = true,
		children,
		className,
		isOpen,
		onClose,
		title
	} = props;

	const modalRef = useRef<HTMLDivElement>(null);
	const unifiedRef = composeRefs(ref, modalRef);

	useOnKeyDown({ global: true, key: "esc" }, (event: KeyboardEvent<HTMLElement>) => {
		if (!canEscapeKeyClose) {
			return;
		}

		onClose?.(event);
	});

	useOnClickOutside(modalRef, (event: SyntheticEvent<HTMLElement>) => {
		if (!canOutsideKeyClose) {
			return;
		}

		onClose?.(event);
	});

	return (
		<Overlay isOpen={isOpen} transitions={transitions}>
			<div className={clsx(classes.root, "uitk-modal-container")}>
				<div ref={unifiedRef} className={clsx(classes.modal, className, "uitk-modal")}>
					<div className={clsx(classes.title, "uitk-modal-title")}>{title}</div>
					<div className="uitk-modal-content">{children}</div>
				</div>
			</div>
		</Overlay>
	);
});

Modal.displayName = "Modal";
