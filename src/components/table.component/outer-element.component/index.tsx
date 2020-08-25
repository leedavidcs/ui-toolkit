import clsx from "clsx";
import React, { DetailedHTMLProps, forwardRef, HTMLAttributes } from "react";
import classes from "./styles.module.scss";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const OuterElement = forwardRef<HTMLDivElement, Props>((props, ref) => {
	const { children, className, ...restDivProps } = props;

	return (
		<div
			ref={ref}
			className={clsx(classes.root, className, "uitk-table-outer-element")}
			{...restDivProps}
		>
			{children}
		</div>
	);
});

OuterElement.displayName = "OuterElement";
