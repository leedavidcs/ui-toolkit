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
import { Column, IColumnProps } from "./column.component";
import { TableContext } from "./context";
import { HeaderCell, IHeaderCellProps } from "./header-cell.component";
import { InnerElement } from "./inner-element.component";
import { OuterElement } from "./outer-element.component";
import { Row } from "./row.component";

/**
 * @note Any updates to IProps should be updated on the story `docs.stories.mdx`, because docgen
 *     seems not to be able to read them.
 * @author David Lee
 * @date August 07, 2020
 */
interface IProps<T extends unknown = any> {
	children?: ReactNode;
	data: readonly T[];
	onDataChange?: (newData: readonly T[]) => void;
	sortable?: boolean;
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

			const colProps: IColumnProps = column.props;
			const colChildren: ReactNodeArray = colProps.children;

			if (colChildren.length !== 2) {
				throw new Error(`<HeaderCell> and <Cell> are required, column index: ${i}`);
			}

			const [headerChild, cellChild] = colChildren as [
				ReactElement<ICellProps>,
				ReactElement<IHeaderCellProps>
			];

			const cellProps = {
				width: colProps.width ?? 0
			};

			_headerCells.push(
				cloneElement(headerChild, {
					...cellProps
				})
			);
			_bodyCells.push(
				cloneElement(cellChild, {
					...cellProps
				})
			);
		});

		return [_headerCells, _bodyCells] as [readonly ReactElement[], readonly ReactElement[]];
	}, [columns]);

	return useMemo(() => ({ headerCells, bodyCells }), [bodyCells, headerCells]);
};

const _Table: FC<IProps> = memo((props) => {
	const { data, onDataChange, sortable = false } = props;

	const { headerCells, bodyCells } = useTableColumns(props);

	const value = useMemo(() => ({ bodyCells, data, headerCells, onDataChange, sortable }), [
		bodyCells,
		data,
		headerCells,
		onDataChange,
		sortable
	]);

	return (
		<TableContext.Provider value={value}>
			<AutoSizer>
				{({ height, width }) => (
					<FixedSizeList
						height={height}
						innerElementType={InnerElement}
						itemCount={data.length}
						itemData={data}
						itemSize={30}
						outerElementType={OuterElement}
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
