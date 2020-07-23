import React, { CSSProperties, FC, ReactNode } from "react";
import classes from "./styles.module.scss";

interface IProps {
	children?: ReactNode;
	className?: string;
	disabled?: boolean;
	helperText?: ReactNode;
	label?: ReactNode;
	labelFor?: string;
	labelInfo?: ReactNode;
	style?: CSSProperties;
}

export const TextInput: FC<IProps> = ({
	children,
	className,
	helperText,
	label,
	labelFor,
	labelInfo,
	style
}) => {
	return (
		<div className={className} style={style}>
			{label && (
				<label htmlFor={labelFor}>
					{label} <span>{labelInfo}</span>
				</label>
			)}
			<div>
				{children}
				{helperText && <div>{helperText}</div>}
			</div>
		</div>
	);
};
