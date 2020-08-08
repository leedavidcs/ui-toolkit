import { ITableContext, TableContext } from "@/components/table.component/context";
import { isNil } from "@/utils";
import clsx from "clsx";
import React, { FC, memo, ReactText, useCallback, useContext, useEffect, useState } from "react";
import classes from "./styles.module.scss";

export interface IHeaderCellProps {
	children?: ReactText;
	dataKey?: ReactText;
	index?: number;
	fixed?: boolean;
	onResize?: (newWidth: number, dataKey: ReactText, index: number) => void;
	resizable?: boolean;
	width?: number;
}

const useResize = ({ dataKey, index, onResize, width = 0 }: IHeaderCellProps) => {
	const { resizing, setResizing } = useContext<ITableContext>(TableContext);

	const [startX, setStartX] = useState<number | null>(null);

	const onMouseDown = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			document.body.style.cursor = "ew-resize";

			setStartX(event.pageX);
			setResizing(index ?? null);
		},
		[index, setResizing]
	);

	const onMouseUp = useCallback(
		(event: MouseEvent) => {
			document.body.style.cursor = "";

			if (isNil(dataKey) || isNil(index) || isNil(startX)) {
				return;
			}

			const isResizingThis: boolean = typeof resizing === "number" && resizing === index;

			if (!isResizingThis) {
				return;
			}

			const deltaX: number = event.pageX - startX;
			const newWidth: number = width + deltaX;

			onResize?.(newWidth, dataKey, index);

			setStartX(null);
			setResizing(null);
		},
		[dataKey, index, onResize, resizing, setResizing, startX, width]
	);

	useEffect(() => {
		document.addEventListener("mouseup", onMouseUp);

		return () => {
			document.removeEventListener("mouseup", onMouseUp);
		};
	}, [onMouseUp]);

	return onMouseDown;
};

export const HeaderCell: FC<IHeaderCellProps> = memo((props) => {
	const { children, resizable, width } = props;

	const onMouseDown = useResize(props);

	return (
		<div className={clsx(classes.root, "uitk-header-cell")} style={{ minWidth: width, width }}>
			<div className={clsx(classes.content, "uitk-header-cell-content")}>{children}</div>
			{resizable && (
				<div
					className={clsx(classes.resizeHandle, "uitk-header-cell-resize-handle")}
					onMouseDown={onMouseDown}
				/>
			)}
		</div>
	);
});

HeaderCell.displayName = "HeaderCell";
