import type { ICellProps } from "@/components/table.component/cell.component";
import { ITableContext, TableContext } from "@/components/table.component/context";
import clsx from "clsx";
import React, {
	Children,
	cloneElement,
	CSSProperties,
	FC,
	memo,
	ReactElement,
	useContext,
	useMemo
} from "react";
import { SortableElement } from "react-sortable-hoc";
import type { ListChildComponentProps } from "react-window";
import classes from "./styles.module.scss";

export const DEFAULT_ROW_HEIGHT = 40;

interface ISortableRowProps<T extends unknown = any> {
	data: readonly T[];
	rowIndex: number;
	style: CSSProperties;
}

const memoSortable = <P extends unknown>(element: FC<P>) => memo(SortableElement(element));

const useRowCells = ({ data, rowIndex }: ISortableRowProps) => {
	const { bodyCells } = useContext<ITableContext>(TableContext);

	const rowData = data[rowIndex];

	const rowCells = useMemo(() => {
		return bodyCells.map((bodyCell) => {
			const { dataKey } = bodyCell.props;
			const value = rowData[dataKey];

			return cloneElement(bodyCell, { key: dataKey, data: rowData, value });
		});
	}, [bodyCells, rowData]);

	return useMemo(() => {
		const leftFixedCells: ReactElement<ICellProps>[] = [];
		const rightFixedCells: ReactElement<ICellProps>[] = [];
		const scrollableCells: ReactElement<ICellProps>[] = [];

		let leftGroupWidth: number = 0;
		let rightGroupWidth: number = 0;

		Children.forEach(rowCells, (cell, i) => {
			const { fixed, width = 0 } = cell.props;

			switch (fixed) {
				case "left": {
					leftFixedCells.push(cell);
					leftGroupWidth += width;

					break;
				}
				case "right": {
					rightFixedCells.push(cell);
					rightGroupWidth += width;

					break;
				}
				default: {
					scrollableCells.push(cell);
				}
			}
		});

		const cells = [leftFixedCells, scrollableCells, rightFixedCells] as readonly [
			readonly ReactElement<ICellProps>[],
			readonly ReactElement<ICellProps>[],
			readonly ReactElement<ICellProps>[]
		];

		const widths = [leftGroupWidth, rightGroupWidth] as readonly [number, number];

		return { cells, widths };
	}, [rowCells]);
};

const SortableRow = memoSortable((props: ISortableRowProps) => {
	const { style } = props;

	const { sortable } = useContext<ITableContext>(TableContext);

	const {
		cells: [, middleCells]
	} = useRowCells(props);

	return (
		<div
			className={clsx(classes.root, { [classes.sortable]: sortable }, "uitk-table-row")}
			style={style}
		>
			{middleCells}
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
