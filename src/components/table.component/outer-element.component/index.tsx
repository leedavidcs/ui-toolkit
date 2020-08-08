import { ITableContext, TableContext } from "@/components/table.component/context";
import clsx from "clsx";
import React, { DetailedHTMLProps, forwardRef, HTMLAttributes, useContext } from "react";
import classes from "./styles.module.scss";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const OuterElement = forwardRef<HTMLDivElement, Props>((props, ref) => {
	const { children, className, ...restDivProps } = props;

	const { headerCells } = useContext<ITableContext>(TableContext);

	return (
		<div ref={ref} className={clsx(className, "uitk-table-outer-element")} {...restDivProps}>
			<div className={classes.header}>{headerCells}</div>
			{children}
		</div>
	);
});

OuterElement.displayName = "OuterElement";
