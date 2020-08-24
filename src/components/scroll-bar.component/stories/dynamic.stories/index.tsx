import { IScrollData, ScrollBar } from "@/components/scroll-bar.component";
import { boolean } from "@storybook/addon-knobs";
import Faker from "faker";
import React, { FC, useCallback, useRef } from "react";
import classes from "./styles.module.scss";

Faker.seed(1);

const PARAGRAPH_COUNT = 10;

const content = Faker.lorem.paragraphs(PARAGRAPH_COUNT);

export default { title: "general/scroll-bar/dynamic", component: ScrollBar };

export const Standard: FC = () => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);

	const onScroll = useCallback(({ contentPosition }: IScrollData) => {
		const contentElem = contentRef.current;

		if (!contentElem) {
			return;
		}

		contentElem.style.top = `${-contentPosition}px`;
	}, []);

	return (
		<div ref={containerRef} className={classes.vRoot}>
			<div ref={contentRef} className={classes.vContent}>
				{content}
			</div>
			<ScrollBar
				className={classes.vScrollbar}
				containerRef={containerRef}
				direction={"y"}
				onScroll={onScroll}
			/>
		</div>
	);
};

export const Horizontal: FC = () => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);

	const onScroll = useCallback(({ contentPosition }: IScrollData) => {
		const contentElem = contentRef.current;

		if (!contentElem) {
			return;
		}

		contentElem.style.left = `${-contentPosition}px`;
	}, []);

	return (
		<div ref={containerRef} className={classes.hRoot}>
			<div ref={contentRef} className={classes.hContent}>
				{content}
			</div>
			<ScrollBar
				className={classes.hScrollbar}
				canShiftScroll={boolean("canShiftScroll", false)}
				containerRef={containerRef}
				direction={"x"}
				onScroll={onScroll}
			/>
		</div>
	);
};
