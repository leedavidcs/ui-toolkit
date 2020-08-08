import { FC, ReactNodeArray, ReactText } from "react";

export interface IColumnProps {
	children: ReactNodeArray;
	onResize?: (newWidth: number, dataKey: ReactText, index: number) => void;
	resizable?: boolean;
	width?: number;
}

export const Column: FC<IColumnProps> = () => null;
