import clsx from "clsx";
import React, { CSSProperties, FC, ReactNode } from "react";
import classes from "./styles.module.scss";

interface IProps {
	children?: ReactNode;
	className?: string;
	disabled?: boolean;
	helperText?: ReactNode;
	intent?: Intent;
	label?: ReactNode;
	labelFor?: string;
	labelInfo?: ReactNode;
	style?: CSSProperties;
}

export const FormGroup: FC<IProps> = ({
	children,
	className,
	disabled = false,
	helperText,
	intent,
	label,
	labelFor,
	labelInfo,
	style
}) => {
	return (
		<div
			className={clsx(
				classes.root,
				{
					[classes.disabled]: disabled,
					[classes.primary]: intent === "primary",
					[classes.success]: intent === "success",
					[classes.warning]: intent === "warning",
					[classes.danger]: intent === "danger"
				},
				"uitk-form-group",
				className
			)}
			style={style}
		>
			{label && (
				<label className={clsx(classes.label, "uitk-label")} htmlFor={labelFor}>
					{label}&nbsp;
					<span className={clsx(classes.labelInfo, "uitk-label-info")}>{labelInfo}</span>
				</label>
			)}
			<div className="uitk-form-group-content">
				{children}
				{helperText && <div className={classes.helperText}>{helperText}</div>}
			</div>
		</div>
	);
};
