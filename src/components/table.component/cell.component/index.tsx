import clsx from "clsx";
import React, { FC, memo, ReactElement, useMemo } from "react";
import classes from "./styles.module.scss";

export interface ICellProps {
	children?: (data: any) => ReactElement;
	dataKey: string;
	rowIndex?: number;
	value?: any;
	width?: number;
}

export const Cell: FC<ICellProps> = memo(({ children, value, width }) => {
	const content = useMemo(() => children?.(value) ?? value, [children, value]);

	return (
		<div className={clsx(classes.root, "uitk-table-cell")} style={{ minWidth: width, width }}>
			{content}
		</div>
	);
});

Cell.displayName = "Cell";
