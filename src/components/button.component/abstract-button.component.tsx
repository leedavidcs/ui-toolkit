import clsx from "clsx";
import React, { FC, ReactElement, ReactNode } from "react";
import classes from "./styles.module.scss";

interface IProps {
	children?: ReactNode;
	className?: string;
	intent?: Intent;
	leftElement?: Maybe<ReactElement>;
	rightElement?: Maybe<ReactElement>;
	tagName?: string;
	text?: ReactNode;
	[key: string]: any;
}

export const AbstractButton: FC<IProps> = ({
	children,
	className,
	intent,
	leftElement,
	rightElement,
	tagName = "button",
	text,
	...restProps
}) => {
	const Tag: any = tagName;

	return (
		<Tag
			{...restProps}
			className={clsx(
				classes.root,
				{
					[classes.success]: intent === "success",
					[classes.warning]: intent === "warning",
					[classes.danger]: intent === "danger"
				},
				className,
				"uitk-button"
			)}
		>
			{leftElement && (
				<span className={clsx(classes.sideContainer, "uitk-button-left-element")}>
					{leftElement}
				</span>
			)}
			{(text || children) && (
				<span className={clsx(classes.text, "uitk-button-text")}>
					{text}
					{children}
				</span>
			)}
			{rightElement && (
				<span className={clsx(classes.sideContainer, "uitk-button-right-element")}>
					{rightElement}
				</span>
			)}
		</Tag>
	);
};