import { Body } from "@/components/table.component/body.component";
import { ITableContext, TableContext } from "@/components/table.component/context";
import { arrayMove } from "@/utils";
import React, {
	DetailedHTMLProps,
	forwardRef,
	HTMLAttributes,
	useCallback,
	useContext
} from "react";
import { SortEndHandler } from "react-sortable-hoc";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const InnerElement = forwardRef<HTMLDivElement, Props>((props, ref) => {
	const { children, ...restDivProps } = props;

	const { data, headerCells, onDataChange } = useContext<ITableContext>(TableContext);

	const onSortEnd: SortEndHandler = useCallback(
		({ oldIndex, newIndex }) => {
			const newData = arrayMove(data, oldIndex, newIndex);

			onDataChange?.(newData);
		},
		[data, onDataChange]
	);

	return (
		<div ref={ref} {...restDivProps}>
			{headerCells}
			<Body axis="y" lockAxis="y" onSortEnd={onSortEnd}>
				{children}
			</Body>
		</div>
	);
});

InnerElement.displayName = "InnerElement";
