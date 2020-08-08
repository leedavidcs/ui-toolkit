import { FC, ReactNodeArray } from "react";

export interface IColumnProps {
	children: ReactNodeArray;
	width?: number;
}

export const Column: FC<IColumnProps> = () => null;
