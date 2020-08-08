import { ITableContext, TableContext } from "@/components/table.component/context";
import clsx from "clsx";
import React, { FC, memo, ReactText, useCallback, useContext, useMemo, useState } from "react";
import Draggable, { ControlPosition, DraggableEventHandler } from "react-draggable";
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

const useResizeHandle = ({ index = 0, onResize, width = 0 }: IHeaderCellProps) => {
	const [startX, setStartX] = useState<number | null>(null);
	const [position, setPosition] = useState<ControlPosition>({ x: 0, y: 0 });

	const { setResizing } = useContext<ITableContext>(TableContext);

	const onDragStart: DraggableEventHandler = useCallback(
		(event, { x }) => {
			event.stopPropagation();

			/**
			 * !HACK
			 * @description Set cursor style on body, so that the cursor doesn't flicker when
			 *     dragging quickly
			 * @author David Lee
			 * @date August 07, 2020
			 */
			document.body.style.cursor = "ew-resize";

			setResizing(x);
			setStartX(x);
		},
		[setResizing]
	);

	const onDrag: DraggableEventHandler = useCallback(
		(event, { x }) => {
			event.stopPropagation();

			setResizing(x);
			setPosition({ x, y: 0 });
		},
		[setResizing]
	);

	const onDragEnd: DraggableEventHandler = useCallback(
		(event, { x }) => {
			event.stopPropagation();

			const deltaX: number = x - (startX ?? 0);
			const newWidth: number = width + deltaX;

			document.body.style.cursor = "";

			onResize?.(newWidth, 0, index);

			setResizing(null);
			setStartX(null);
			setPosition({ x: 0, y: 0 });
		},
		[index, onResize, setResizing, startX, width]
	);

	const actions = useMemo(() => ({ onDrag, onDragEnd, onDragStart }), [
		onDrag,
		onDragEnd,
		onDragStart
	]);

	return useMemo(() => ({ actions, position }), [actions, position]);
};

export const HeaderCell: FC<IHeaderCellProps> = memo((props) => {
	const { children, resizable, width } = props;

	const { position, actions } = useResizeHandle(props);

	return (
		<div className={clsx(classes.root, "uitk-header-cell")} style={{ minWidth: width, width }}>
			<div className={clsx(classes.content, "uitk-header-cell-content")}>{children}</div>
			{resizable && (
				<Draggable
					axis="x"
					disabled={!resizable}
					onDrag={actions.onDrag}
					onStart={actions.onDragStart}
					onStop={actions.onDragEnd}
					position={position}
				>
					<div className={clsx(classes.resizeHandle, "uitk-header-cell-resize-handle")} />
				</Draggable>
			)}
		</div>
	);
});

HeaderCell.displayName = "HeaderCell";
