import { ITableContext, TableContext } from "@/components/table.component/context";
import clsx from "clsx";
import React, { cloneElement, CSSProperties, FC, memo, useContext, useMemo } from "react";
import { SortableElement } from "react-sortable-hoc";
import { ListChildComponentProps } from "react-window";
import classes from "./styles.module.scss";

export const DEFAULT_ROW_HEIGHT = 40;

interface ISortableRowProps<T extends unknown = any> {
	data: readonly T[];
	rowIndex: number;
	style: CSSProperties;
}

const memoSortable = <P extends unknown>(element: FC<P>) => memo(SortableElement(element));

const SortableRow = memoSortable(({ data, rowIndex, style }: ISortableRowProps) => {
	const { bodyCells, sortable } = useContext<ITableContext>(TableContext);

	const rowData = data[rowIndex];

	const rowCells = useMemo(() => {
		return bodyCells.map((bodyCell) => {
			const { dataKey } = bodyCell.props;
			const value = rowData[dataKey];

			return cloneElement(bodyCell, { key: dataKey, data: rowData, value });
		});
	}, [bodyCells, rowData]);

	return (
		<div className={clsx(classes.root, "uitk-table-row")} style={style}>
			<div
				className={clsx(
					classes.cellContainer,
					{ [classes.sortable]: sortable },
					"uitk-table-row-cell-container"
				)}
			>
				{rowCells}
			</div>
		</div>
	);
});

SortableRow.displayName = "SortableDataRow";

interface IProps<T extends unknown = any> extends ListChildComponentProps {
	data: readonly T[];
}

export const Row: FC<IProps> = ({ data, index, style }) => {
	const { sortable } = useContext<ITableContext>(TableContext);

	return (
		<SortableRow
			data={data}
			disabled={!sortable}
			index={index}
			rowIndex={index}
			style={style}
		/>
	);
};
