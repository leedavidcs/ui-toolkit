import { Children, FC, isValidElement, ReactNode, ReactNodeArray } from "react";

interface IProps {
	children?: ReactNode;
}

export const Column: FC<IProps> = ({ children }) => null;

const getTableColumns = (columns: ReactNodeArray) => {
	const headerCells: any[] = [];
	const bodyCells: any[] = [];

	Children.forEach(columns, (column, i) => {
		if (!isValidElement(column)) {
			return;
		}

		const { children, props } = column.props;

		if (children.length !== 2) {
			throw new Error(`Component must have HeaderCell and Cell, column index: ${i}`);
		}

		const [headerChild, cellChild] = children;
	});

	return [headerCells, bodyCells] as [any, any];
};
