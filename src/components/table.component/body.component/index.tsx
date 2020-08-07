import React, { FC, memo, ReactNode } from "react";
import { SortableContainer } from "react-sortable-hoc";

interface IProps {
	children: ReactNode;
}

const memoSortable = <P extends unknown>(element: FC<P>) => memo(SortableContainer(element));

export const Body = memoSortable(({ children }: IProps) => {
	return <div>{children}</div>;
});

Body.displayName = "Body";
