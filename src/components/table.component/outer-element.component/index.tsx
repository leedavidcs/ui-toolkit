import { ITableContext, TableContext } from "@/components/table.component/context";
import { DEFAULT_ROW_HEIGHT } from "@/components/table.component/row.component";
import composeRefs from "@seznam/compose-react-refs";
import clsx from "clsx";
import React, {
	DetailedHTMLProps,
	forwardRef,
	HTMLAttributes,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from "react";
import classes from "./styles.module.scss";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const useResize = () => {
	/**
	 * @description `resizing` is true when `mousedown` is trigged on HeaderCell
	 */
	const { resizing } = useContext<ITableContext>(TableContext);

	const [outerElement, ref] = useState<HTMLDivElement | null>(null);
	const [resizeOffset, setResizeOffset] = useState<number>(0);

	const onMouseMove = useCallback(
		(event: MouseEvent) => {
			if (typeof resizing !== "number" || !outerElement) {
				return;
			}

			const { left } = outerElement.getBoundingClientRect();

			const newXPosition: number = event.clientX - left;

			setResizeOffset(newXPosition);
		},
		[outerElement, resizing]
	);

	useEffect(() => {
		document.addEventListener("mousemove", onMouseMove);

		return () => {
			document.removeEventListener("mousemove", onMouseMove);
		};
	}, [onMouseMove, outerElement]);

	return useMemo(() => ({ ref, resizeOffset }), [resizeOffset]);
};

export const OuterElement = forwardRef<HTMLDivElement, Props>((props, ref) => {
	const { children, className, ...restDivProps } = props;

	const { headerCells, resizing } = useContext<ITableContext>(TableContext);

	const { ref: resizeRef, resizeOffset } = useResize();

	const composedRef = composeRefs<HTMLDivElement>(ref, resizeRef);

	return (
		<div
			ref={composedRef}
			className={clsx(className, "uitk-table-outer-element")}
			{...restDivProps}
		>
			<div
				className={clsx(classes.header, "uitk-table-header")}
				style={{ height: DEFAULT_ROW_HEIGHT }}
			>
				{headerCells}
			</div>
			{typeof resizing === "number" && (
				<div
					className={clsx(classes.resizing, "uitk-table-resizing-indicator")}
					style={{ left: resizeOffset }}
				/>
			)}
			{children}
		</div>
	);
});

OuterElement.displayName = "OuterElement";
