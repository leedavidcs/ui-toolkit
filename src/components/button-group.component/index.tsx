import clsx from "clsx";
import React, { FC, ReactNode } from "react";
import classes from "./styles.module.scss";

interface IProps {
	children?: ReactNode;
	className?: string;
}

export const ButtonGroup: FC<IProps> = ({ children, className }) => {
	return <div className={clsx(classes.root, className, "uitk-button-group")}>{children}</div>;
};
