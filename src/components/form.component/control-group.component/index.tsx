import clsx from "clsx";
import React, { CSSProperties, FC, ReactNode } from "react";
import { createUseStyles } from "react-jss";
import classes from "./styles.module.scss";

export enum ControlGroupDirection {
	ROW = "row",
	COLUMN = "column"
}

interface IProps {
	children?: ReactNode;
	className?: string;
	direction?: "row" | "column";
	gutterSize?: number;
	style?: CSSProperties;
}

const useDynamicStyles = createUseStyles({
	root: {
		flexDirection: ({ direction }) => direction,

		"& > *:not(:last-child)": {
			marginRight: ({ direction, gutterSize }) => {
				return direction === ControlGroupDirection.ROW ? gutterSize : undefined;
			},
			marginBottom: ({ direction, gutterSize }) => {
				return direction === ControlGroupDirection.COLUMN ? gutterSize : undefined;
			}
		}
	}
});

export const ControlGroup: FC<IProps> = ({
	children,
	className,
	direction = ControlGroupDirection.COLUMN,
	gutterSize = 0,
	style
}) => {
	const dynClasses = useDynamicStyles({ direction, gutterSize });

	return (
		<div className={clsx(classes.root, dynClasses.root, className)} style={style}>
			{children}
		</div>
	);
};
