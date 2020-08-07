import React, {
	Children,
	cloneElement,
	FC,
	isValidElement,
	memo,
	ReactElement,
	ReactNode,
	ReactNodeArray,
	useMemo
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { Cell, ICellProps } from "./cell.component";
import { Column } from "./column.component";
import { TableContext } from "./context";
import { HeaderCell, IHeaderCellProps } from "./header-cell.component";
import { Row } from "./row.component";

interface IProps<T extends unknown = any> {
	children?: ReactNode;
	data: readonly T[];
	onDataChange?: (newData: readonly T[]) => void;
}

const useTableColumns = ({ children }: IProps) => {
	const columns = children as ReactNodeArray;

	const [headerCells, bodyCells] = useMemo(() => {
		const _headerCells: ReactElement[] = [];
		const _bodyCells: ReactElement[] = [];

		Children.forEach(columns, (column, i) => {
			if (!isValidElement(column)) {
				return;
			}

			const colChildren: ReactNodeArray = column.props.children;

			if (colChildren.length !== 2) {
				throw new Error(`<HeaderCell> and <Cell> are required, column index: ${i}`);
			}

			const [headerChild, cellChild] = colChildren as [
				ReactElement<ICellProps>,
				ReactElement<IHeaderCellProps>
			];

			_headerCells.push(cloneElement(headerChild));
			_bodyCells.push(cloneElement(cellChild));
		});

		return [_headerCells, _bodyCells] as [readonly ReactElement[], readonly ReactElement[]];
	}, [columns]);

	return useMemo(() => ({ headerCells, bodyCells }), [bodyCells, headerCells]);
};

const _Table: FC<IProps> = memo((props) => {
	const { data, onDataChange } = props;

	const { headerCells, bodyCells } = useTableColumns(props);

	const value = useMemo(() => ({ bodyCells, data, headerCells, onDataChange }), [
		bodyCells,
		data,
		headerCells,
		onDataChange
	]);

	return (
		<TableContext.Provider value={value}>
			<AutoSizer>
				{({ height, width }) => (
					<FixedSizeList
						height={height}
						itemCount={data.length}
						itemSize={30}
						width={width}
					>
						{Row}
					</FixedSizeList>
				)}
			</AutoSizer>
		</TableContext.Provider>
	);
});

_Table.displayName = "Table";

interface IWithStaticProps {
	Cell: typeof Cell;
	Column: typeof Column;
	HeaderCell: typeof HeaderCell;
}

(_Table as typeof _Table & IWithStaticProps).Cell = Cell;
(_Table as typeof _Table & IWithStaticProps).Column = Column;
(_Table as typeof _Table & IWithStaticProps).HeaderCell = HeaderCell;

export const Table = _Table as typeof _Table & IWithStaticProps;
