import { useTimeout } from "@/hooks";
import React, { FC, ReactNode, ReactText } from "react";
import classes from "./styles.module.scss";

const DEFAULT_TIMEOUT = 5000;

export interface IToastProps {
	key?: ReactText;
	message: ReactNode;
	onDismiss?: () => void;
	timeout?: number;
}

export const Toast: FC<IToastProps> = ({ message, onDismiss, timeout = DEFAULT_TIMEOUT }) => {
	useTimeout(() => onDismiss?.(), timeout);

	return (
		<div className={classes.root}>
			<span className={classes.message}>{message}</span>
		</div>
	);
};
