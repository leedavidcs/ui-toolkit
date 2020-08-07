import { ITableContext, TableContext } from "@/components/table.component/context";
import React, { cloneElement, CSSProperties, FC, memo, useContext, useMemo } from "react";
import { SortableElement } from "react-sortable-hoc";
import { ListChildComponentProps } from "react-window";

interface ISortableRowProps<T extends unknown = any> {
	data: readonly T[];
	rowIndex: number;
	style: CSSProperties;
}

const memoSortable = <P extends unknown>(element: FC<P>) => memo(SortableElement(element));

const SortableRow = memoSortable(({ data, rowIndex, style }: ISortableRowProps) => {
	const { bodyCells } = useContext<ITableContext>(TableContext);

	const rowData = data[rowIndex];

	const rowCells = useMemo(() => {
		return bodyCells.map((bodyCell) => {
			const { dataKey } = bodyCell.props;
			const value = rowData[dataKey];

			return cloneElement(bodyCell, { key: dataKey, value });
		});
	}, [bodyCells, rowData]);

	return <div style={style}>{rowCells}</div>;
});

SortableRow.displayName = "SortableDataRow";

interface IProps<T extends unknown = any> extends ListChildComponentProps {
	data: readonly T[];
}

export const Row: FC<IProps> = ({ data, index, style }) => {
	return <SortableRow data={data} index={index} rowIndex={index} style={style} />;
};
