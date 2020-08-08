import { Body } from "@/components/table.component/body.component";
import { ITableContext, TableContext } from "@/components/table.component/context";
import { arrayMove } from "@/utils";
import clsx from "clsx";
import React, {
	DetailedHTMLProps,
	forwardRef,
	HTMLAttributes,
	useCallback,
	useContext
} from "react";
import { SortEndHandler } from "react-sortable-hoc";
import classes from "./styles.module.scss";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const InnerElement = forwardRef<HTMLDivElement, Props>((props, ref) => {
	const { children, className, ...restDivProps } = props;

	const { data, onDataChange } = useContext<ITableContext>(TableContext);

	const onSortEnd: SortEndHandler = useCallback(
		({ oldIndex, newIndex }) => {
			const newData = arrayMove(data, oldIndex, newIndex);

			onDataChange?.(newData);
		},
		[data, onDataChange]
	);

	return (
		<div
			ref={ref}
			className={clsx(classes.root, className, "uitk-table-inner-element")}
			{...restDivProps}
		>
			<Body axis="y" lockAxis="y" onSortEnd={onSortEnd}>
				{children}
			</Body>
		</div>
	);
});

InnerElement.displayName = "InnerElement";
