import clsx from "clsx";
import React, { FC, memo, ReactNode } from "react";
import { SortableContainer } from "react-sortable-hoc";

interface IProps {
	children: ReactNode;
	className?: string;
}

const memoSortable = <P extends unknown>(element: FC<P>) => memo(SortableContainer(element));

export const Body = memoSortable(({ children, className }: IProps) => {
	return <div className={clsx(className, "uitk-table-body")}>{children}</div>;
});

Body.displayName = "Body";
