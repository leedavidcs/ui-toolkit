import { Context, createContext, ReactElement } from "react";
import { ICellProps } from "./cell.component";

export interface ITableContext<T extends unknown = any> {
	bodyCells: readonly ReactElement<ICellProps>[];
	data: readonly T[];
	headerCells: readonly ReactElement[];
	onDataChange?: (newData: readonly T[]) => void;
}

export const TableContext: Context<ITableContext> = createContext<ITableContext>({
	bodyCells: [],
	data: [],
	headerCells: []
});

TableContext.displayName = "TableContext";
