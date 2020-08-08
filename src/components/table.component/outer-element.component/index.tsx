import { ITableContext, TableContext } from "@/components/table.component/context";
import { DEFAULT_ROW_HEIGHT } from "@/components/table.component/row.component";
import clsx from "clsx";
import React, { DetailedHTMLProps, forwardRef, HTMLAttributes, useContext } from "react";
import classes from "./styles.module.scss";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const OuterElement = forwardRef<HTMLDivElement, Props>((props, ref) => {
	const { children, className, ...restDivProps } = props;

	const { headerCells, resizing } = useContext<ITableContext>(TableContext);

	return (
		<div ref={ref} className={clsx(className, "uitk-table-outer-element")} {...restDivProps}>
			<div
				className={clsx(classes.header, "uitk-table-header")}
				style={{ height: DEFAULT_ROW_HEIGHT }}
			>
				{headerCells}
			</div>
			{typeof resizing === "number" && (
				<div
					className={clsx(classes.resizing, "uitk-table-resizing-indicator")}
					style={{ left: resizing ?? undefined }}
				/>
			)}
			{children}
		</div>
	);
});

OuterElement.displayName = "OuterElement";
