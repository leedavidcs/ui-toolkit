import React, {
	Children,
	cloneElement,
	FC,
	isValidElement,
	memo,
	ReactElement,
	ReactNode,
	ReactNodeArray,
	useMemo,
	useState
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { Cell, ICellProps } from "./cell.component";
import { Column, IColumnProps } from "./column.component";
import { TableContext } from "./context";
import { HeaderCell, IHeaderCellProps } from "./header-cell.component";
import { InnerElement } from "./inner-element.component";
import { OuterElement } from "./outer-element.component";
import { DEFAULT_ROW_HEIGHT, Row } from "./row.component";

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
	virtualized?: boolean;
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

			/**
			 * !IMPORTANT
			 * @description Column default props defined here, so that props can be accessed during
			 *     table-configuration phase
			 * @author David Lee
			 * @date August 07, 2020
			 */
			const { onResize, resizable = false, width = 0 } = colProps;

			if (colChildren.length !== 2) {
				throw new Error(`<HeaderCell> and <Cell> are required, column index: ${i}`);
			}

			const [headerChild, cellChild] = colChildren as [
				ReactElement<IHeaderCellProps>,
				ReactElement<ICellProps>
			];

			if (headerChild.type !== HeaderCell || cellChild.type !== Cell) {
				throw new Error(
					`<HeaderCell> and <Cell> are required in that order, column index: ${i}`
				);
			}

			const cellProps = {
				dataKey: cellChild.props.dataKey,
				key: cellChild.props.dataKey,
				index: i,
				width
			};

			_headerCells.push(
				cloneElement(headerChild, {
					...cellProps,
					onResize,
					resizable
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
	const { data, onDataChange, sortable = false, virtualized = true } = props;

	const [resizing, setResizing] = useState<number | null>(null);

	const { headerCells, bodyCells } = useTableColumns(props);

	const value = useMemo(
		() => ({ bodyCells, data, headerCells, onDataChange, resizing, setResizing, sortable }),
		[bodyCells, data, headerCells, onDataChange, resizing, sortable]
	);

	return (
		<TableContext.Provider value={value}>
			<AutoSizer>
				{({ height, width }) => (
					<FixedSizeList
						height={height}
						innerElementType={InnerElement}
						itemCount={data.length}
						itemData={data}
						itemSize={DEFAULT_ROW_HEIGHT}
						outerElementType={OuterElement}
						overscanCount={virtualized ? 1 : data.length}
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
