import { Overlay } from "@/components/overlay.component";
import { useOnClickOutside, useOnKeyDown } from "@/hooks";
import clsx from "clsx";
import React, { CSSProperties, FC, ReactNode, SyntheticEvent, useRef } from "react";
import classes from "./styles.module.scss";
import transitions from "./transitions.module.scss";

export enum PageDrawerPosition {
	TOP = "TOP",
	BOTTOM = "BOTTOM",
	LEFT = "LEFT",
	RIGHT = "RIGHT"
}

interface IProps {
	canEscapeKeyClose?: boolean;
	canOutsideClickClose?: boolean;
	children?: ReactNode;
	className?: string;
	isOpen: boolean;
	onClose?: (event: SyntheticEvent<HTMLElement>) => void;
	position?: PageDrawerPosition;
	style?: CSSProperties;
}

export const PageDrawer: FC<IProps> = ({
	canEscapeKeyClose = true,
	canOutsideClickClose = true,
	children,
	className,
	isOpen,
	onClose,
	position = PageDrawerPosition.RIGHT,
	style
}) => {
	const drawerRef = useRef<HTMLDivElement>(null);

	useOnKeyDown({ global: true, key: "esc" }, (event) => {
		if (canEscapeKeyClose) {
			onClose?.(event);
		}
	});

	useOnClickOutside(drawerRef, (event) => {
		if (canOutsideClickClose) {
			onClose?.(event);
		}
	});

	return (
		<Overlay
			className={clsx({
				[transitions.top]: position === PageDrawerPosition.TOP,
				[transitions.bottom]: position === PageDrawerPosition.BOTTOM,
				[transitions.left]: position === PageDrawerPosition.LEFT,
				[transitions.right]: position === PageDrawerPosition.RIGHT
			})}
			isOpen={isOpen}
			transitions={transitions}
		>
			{isOpen && (
				<div
					ref={drawerRef}
					className={clsx(
						classes.root,
						{
							[classes.top]: position === PageDrawerPosition.TOP,
							[classes.bottom]: position === PageDrawerPosition.BOTTOM,
							[classes.left]: position === PageDrawerPosition.LEFT,
							[classes.right]: position === PageDrawerPosition.RIGHT
						},
						className,
						"uitk-page-drawer"
					)}
					style={style}
				>
					{children}
				</div>
			)}
		</Overlay>
	);
};
