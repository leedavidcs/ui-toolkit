import clsx from "clsx";
import React, { FC, memo, ReactElement, ReactText, useMemo } from "react";
import classes from "./styles.module.scss";

interface ICellChildProps<T extends unknown = any> {
	data: T;
	dataKey: ReactText;
	index: number;
}

export interface ICellProps<T extends unknown = any> {
	children?: (childProps: ICellChildProps<T>) => ReactElement;
	data?: T;
	dataKey: ReactText;
	index?: number;
	value?: any;
	width?: number;
}

export const Cell: FC<ICellProps> = memo((props) => {
	const { children, data, dataKey, index = 0, value, width } = props;

	const content = useMemo(() => children?.({ data, dataKey, index }) ?? value, [
		children,
		data,
		dataKey,
		index,
		value
	]);

	return (
		<div className={clsx(classes.root, "uitk-table-cell")} style={{ minWidth: width, width }}>
			{content}
		</div>
	);
});

Cell.displayName = "Cell";
