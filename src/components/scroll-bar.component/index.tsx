import { useUncontrolledProp } from "@/hooks";
import clsx from "clsx";
import React, { FC, RefObject, useCallback, useEffect, useMemo, useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import { createUseStyles } from "react-jss";
import classes, { scrollbarSize } from "./styles.module.scss";

export const ScrollbarConsts = {
	scrollbarSize
};

export interface IScrollData {
	position: number;
	delta: number;
	contentPosition: number;
}

interface IProps {
	canShiftScroll?: boolean;
	className?: string;
	containerRef: RefObject<HTMLElement>;
	direction?: "x" | "y";
	onScroll?: (data: IScrollData) => void;
	position?: number;
}

const TO_PERCENT = 100;

const useDynamicStyles = createUseStyles({
	horizontal: ({ length, scrollLength }) => ({
		width: length,

		"& > div": {
			width: `${(length / scrollLength) * TO_PERCENT}%`
		}
	}),
	vertical: ({ length, scrollLength }) => ({
		height: length,

		"& > div": {
			height: `${(length / scrollLength) * TO_PERCENT}%`
		}
	})
});

export const ScrollBar: FC<IProps> = ({
	canShiftScroll = false,
	containerRef,
	className,
	direction = "y",
	onScroll,
	position: _position
}) => {
	const [position, setPosition] = useUncontrolledProp(_position, 0);

	const [scrollLength, setScrollLength] = useState<number>(1);
	const [length, setLength] = useState<number>(1);

	const dynClasses = useDynamicStyles({ length, scrollLength });

	const isHorizontal: boolean = direction === "x";

	const scrollbarLength: number = useMemo(() => Math.pow(length, 2) / scrollLength, [
		length,
		scrollLength
	]);

	const maxScroll: number = useMemo(() => length - scrollbarLength, [length, scrollbarLength]);

	const getContentPosition = useCallback(
		(newPosition: number) => (newPosition * scrollLength) / length,
		[length, scrollLength]
	);

	const handleScroll = useCallback(
		(delta: number) => {
			setPosition((oldPosition: number) => {
				const newPosition: number = Math.max(0, Math.min(maxScroll, oldPosition + delta));
				const newContentPosition: number = getContentPosition(newPosition);

				onScroll?.({
					position: newPosition,
					delta,
					contentPosition: newContentPosition
				});

				return newPosition;
			});
		},
		[getContentPosition, maxScroll, onScroll, setPosition]
	);

	const onWheel = useCallback(
		({ deltaY, shiftKey }: WheelEvent) => {
			const scale: number = scrollbarLength / maxScroll;
			const delta: number = Math.ceil(deltaY * scale);

			const isSideWheel: boolean = canShiftScroll && shiftKey;

			if (isHorizontal) {
				handleScroll(isSideWheel ? delta : 0);

				return;
			}

			handleScroll(isSideWheel ? 0 : delta);
		},
		[scrollbarLength, maxScroll, isHorizontal, handleScroll, canShiftScroll]
	);

	const onDrag: DraggableEventHandler = useCallback(
		(event, { deltaX, deltaY }) => {
			const delta: number = isHorizontal ? deltaX : deltaY;

			handleScroll(delta);
		},
		[isHorizontal, handleScroll]
	);

	useEffect(() => {
		const containerElem: HTMLElement | null = containerRef.current;

		if (!containerElem) {
			return;
		}

		const newScrollLength: number = isHorizontal
			? containerElem.scrollWidth
			: containerElem.scrollHeight;

		const newLength: number = isHorizontal
			? containerElem.offsetWidth
			: containerElem.offsetHeight;

		setScrollLength(newScrollLength);
		setLength(newLength);
	}, [containerRef, direction, isHorizontal, setScrollLength]);

	useEffect(() => {
		const containerElem: HTMLElement | null = containerRef.current;

		if (!containerElem) {
			return;
		}

		containerElem.addEventListener("wheel", onWheel);

		return () => {
			containerElem.removeEventListener("wheel", onWheel);
		};
	}, [containerRef, onWheel]);

	return (
		<div
			className={clsx(
				classes.root,
				{
					[classes.vertical]: !isHorizontal,
					[classes.horizontal]: isHorizontal,
					[dynClasses.vertical]: !isHorizontal,
					[dynClasses.horizontal]: isHorizontal
				},
				className,
				"uitk-scrollbar"
			)}
		>
			<Draggable
				axis={direction}
				bounds="parent"
				onDrag={onDrag}
				position={direction === "x" ? { x: position, y: 0 } : { x: 0, y: position }}
			>
				<div className={clsx(classes.scrollbar, "uitk-scrollbar-bar")} />
			</Draggable>
		</div>
	);
};
