import { range } from "@/utils";
import clsx from "clsx";
import React, { CSSProperties, memo, useMemo } from "react";
import classes from "./styles.module.scss";

const ANIMATION_DURATION_SECONDS = 1.2;

interface IProps {
	animationDuration?: number;
	circle?: boolean;
	className?: string;
	count?: number;
	height?: CSSProperties["height"];
	width?: CSSProperties["width"];
}

export const Skeleton = memo<IProps>((props) => {
	const {
		animationDuration = ANIMATION_DURATION_SECONDS,
		circle = false,
		className,
		count = 1,
		height,
		width
	} = props;

	const animation = useMemo(
		() => `${classes.skeletonKeyframes} ${animationDuration}s ease-in-out infinite`,
		[animationDuration]
	);

	const elements = useMemo(() => {
		return range(count).map((i) => (
			<span
				key={i}
				className={clsx(classes.skeleton, { [classes.circle]: circle }, "uitk-element")}
				style={{ animation, height, width }}
			>
				&zwnj;
			</span>
		));
	}, [animation, circle, count, height, width]);

	return <span className={clsx(className, "uitk-skeleton")}>{elements}</span>;
});

Skeleton.displayName = "Skeleton";
