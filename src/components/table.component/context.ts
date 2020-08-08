import { Context, createContext, ReactElement } from "react";
import { ICellProps } from "./cell.component";
import { IHeaderCellProps } from "./header-cell.component";

export interface ITableContext<T extends unknown = any> {
	bodyCells: readonly ReactElement<ICellProps>[];
	data: readonly T[];
	headerCells: readonly ReactElement<IHeaderCellProps>[];
	onDataChange?: (newData: readonly T[]) => void;
	resizing: number | null;
	setResizing: (newResizing: number | null) => void;
	sortable: boolean;
}

export const TableContext: Context<ITableContext> = createContext<ITableContext>({
	bodyCells: [],
	data: [],
	headerCells: [],
	resizing: null,
	setResizing: () => undefined,
	sortable: false
});

TableContext.displayName = "TableContext";
