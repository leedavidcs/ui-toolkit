import { isNil } from "@/utils";
import clsx from "clsx";
import React, {
	FC,
	memo,
	ReactText,
	RefObject,
	useCallback,
	useEffect,
	useRef,
	useState
} from "react";
import { createPortal } from "react-dom";
import classes from "./styles.module.scss";

export const MIN_HEADER_WIDTH = 20;

export interface IHeaderCellProps {
	children?: ReactText;
	dataKey?: ReactText;
	index?: number;
	fixed?: "left" | "right";
	onResize?: (newWidth: number, dataKey: ReactText, index: number) => void;
	resizable?: boolean;
	width?: number;
}

const useResize = (props: IHeaderCellProps, ref: RefObject<HTMLDivElement>) => {
	const { dataKey, index, onResize, width = 0 } = props;

	const [isResizing, setIsResizing] = useState<boolean>(false);
	const [startX, setStartX] = useState<number | null>(null);
	const [position, setPosition] = useState<number>(0);

	const onMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
		document.body.style.cursor = "ew-resize";
		document.body.style.userSelect = "none";

		setStartX(event.pageX);
		setIsResizing(true);
	}, []);

	const onMouseMove = useCallback(
		(event: MouseEvent) => {
			const rootElem = ref.current;

			if (!isResizing || !rootElem) {
				return;
			}

			const { left: leftBound } = rootElem.getBoundingClientRect();

			const newXPosition: number = Math.max(event.pageX, leftBound);

			setPosition(newXPosition);
		},
		[isResizing, ref]
	);

	const onMouseUp = useCallback(
		(event: MouseEvent) => {
			if (!isResizing || isNil(dataKey) || isNil(index) || isNil(startX)) {
				return;
			}

			document.body.style.cursor = "";
			document.body.style.userSelect = "";

			const deltaX: number = event.pageX - startX;
			const newWidth: number = Math.max(width + deltaX, MIN_HEADER_WIDTH);

			onResize?.(newWidth, dataKey, index);

			setStartX(null);
			setIsResizing(false);
		},
		[dataKey, index, isResizing, onResize, startX, width]
	);

	useEffect(() => {
		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);

		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		};
	}, [onMouseMove, onMouseUp]);

	return {
		actions: { onMouseDown },
		states: { isResizing, position }
	};
};

export const HeaderCell: FC<IHeaderCellProps> = memo((props) => {
	const { children, resizable, width } = props;

	const ref = useRef<HTMLDivElement>(null);

	const {
		actions: { onMouseDown },
		states: { isResizing, position }
	} = useResize(props, ref);

	return (
		<div
			ref={ref}
			className={clsx(classes.root, "uitk-header-cell")}
			style={{ minWidth: width, width }}
		>
			<div className={clsx(classes.content, "uitk-header-cell-content")}>{children}</div>
			{resizable && (
				<div
					className={clsx(classes.resizeHandle, "uitk-header-cell-resize-handle")}
					onMouseDown={onMouseDown}
				/>
			)}
			{isResizing &&
				createPortal(
					<div
						className={clsx(classes.resizeIndicator, "uitk-table-resize-indicator")}
						style={{ left: position }}
					/>,
					document.querySelector(".uitk-table-outer-element")!
				)}
		</div>
	);
});

HeaderCell.displayName = "HeaderCell";
