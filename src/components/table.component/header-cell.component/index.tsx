import React, { FC, ReactText } from "react";

export interface IHeaderCellProps {
	children?: ReactText;
	index?: number;
	fixed?: boolean;
	resizable?: boolean;
	width?: number;
}

export const HeaderCell: FC<IHeaderCellProps> = ({ children, width }) => {
	return (
		<div className="uitk-header-cell" style={{ minWidth: width, width }}>
			{children}
		</div>
	);
};
