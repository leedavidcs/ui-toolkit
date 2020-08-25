import clsx from "clsx";
import React, { FC, ReactElement, ReactNode } from "react";
import classes from "./styles.module.scss";

interface IProps {
	children?: ReactNode;
	className?: string;
	disabled?: boolean;
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
	disabled,
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
			disabled={tagName !== "a" ? disabled : undefined}
			{...restProps}
			className={clsx(
				classes.root,
				{
					[classes.primary]: intent === "primary",
					[classes.success]: intent === "success",
					[classes.warning]: intent === "warning",
					[classes.danger]: intent === "danger",
					[classes.disabled]: disabled
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
