import { Button } from "@/components/button.component";
import { Overlay } from "@/components/overlay.component";
import { useOnClickOutside, useOnKeyDown } from "@/hooks";
import clsx from "clsx";
import React, {
	CSSProperties,
	FC,
	KeyboardEvent,
	MouseEvent,
	ReactNode,
	SyntheticEvent,
	useCallback,
	useRef
} from "react";
import classes from "./styles.module.scss";
import transitions from "./transitions.module.scss";

interface IProps {
	cancelButtonText?: string;
	canEscapeKeyCancel?: boolean;
	canOutsideClickCancel?: boolean;
	children?: ReactNode;
	className?: string;
	confirmButtonText?: string;
	intent?: Intent;
	isOpen: boolean;
	onCancel?: (event: SyntheticEvent<HTMLElement>) => void;
	onClose?: (confirmed: boolean, event?: SyntheticEvent<HTMLElement>) => void;
	onConfirm?: (event: SyntheticEvent<HTMLElement>) => void;
	style?: CSSProperties;
	usePortal?: boolean;
}

export const Alert: FC<IProps> = ({
	cancelButtonText = "Cancel",
	canEscapeKeyCancel = false,
	canOutsideClickCancel = false,
	children,
	className,
	confirmButtonText = "Confirm",
	intent = "danger",
	isOpen,
	onCancel: _onCancel,
	onClose,
	onConfirm: _onConfirm,
	style,
	usePortal
}) => {
	const alertRef = useRef<HTMLDivElement>(null);

	const onCancel = useCallback(
		(event: MouseEvent<HTMLButtonElement>): void => {
			_onCancel?.(event);
			onClose?.(false, event);
		},
		[_onCancel, onClose]
	);

	const onConfirm = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			_onConfirm?.(event);
			onClose?.(true, event);
		},
		[_onConfirm, onClose]
	);

	useOnClickOutside(alertRef, (event: SyntheticEvent<HTMLElement>) => {
		if (!canOutsideClickCancel) {
			return;
		}

		_onCancel?.(event);
		onClose?.(false, event);
	});

	useOnKeyDown({ global: true, key: "esc" }, (event: KeyboardEvent<HTMLElement>) => {
		if (!canEscapeKeyCancel) {
			return;
		}

		_onCancel?.(event);
		onClose?.(false, event);
	});

	return (
		<Overlay isOpen={isOpen} transitions={transitions} usePortal={usePortal}>
			<div className={clsx(classes.root, "uitk-alert-container")}>
				<div
					ref={alertRef}
					className={clsx(classes.alert, className, "uitk-alert")}
					style={style}
				>
					<div className="uitk-alert-content">{children}</div>
					<div className={clsx(classes.footer, "uitk-alert-footer")}>
						<Button
							className={clsx(classes.button, "uitk-alert-button")}
							intent={intent}
							onClick={onConfirm}
							text={confirmButtonText}
						/>
						<Button
							className={clsx(classes.button, "uitk-alert-button")}
							onClick={onCancel}
							text={cancelButtonText}
						/>
					</div>
				</div>
			</div>
		</Overlay>
	);
};
