import clsx from "clsx";
import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC, ReactElement, ReactNode } from "react";
import classes from "./styles.module.scss";

interface IProps
	extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	children?: ReactNode;
	intent?: Intent;
	leftElement?: Maybe<ReactElement>;
	rightElement?: Maybe<ReactElement>;
	text?: ReactNode;
}

export const Button: FC<IProps> = ({
	children,
	className,
	intent,
	leftElement,
	rightElement,
	text,
	...restButtonProps
}) => {
	return (
		<button
			{...restButtonProps}
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
		</button>
	);
};
