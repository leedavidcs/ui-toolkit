import clsx from "clsx";
import React, { ChangeEventHandler, CSSProperties, FC, ReactElement, ReactText } from "react";
import { Control, Controller } from "react-hook-form";
import classes from "./styles.module.scss";

export enum SwitchAlign {
	LEFT = "LEFT",
	RIGHT = "RIGHT"
}

interface IProps {
	align?: SwitchAlign;
	className?: string;
	checked?: boolean;
	control?: Control<any>;
	defaultChecked?: boolean;
	disabled?: boolean;
	label?: ReactText | ReactElement;
	name?: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	style?: CSSProperties;
}

const BaseSwitch: FC<IProps> = ({
	align = SwitchAlign.LEFT,
	className,
	checked,
	defaultChecked,
	disabled = false,
	label,
	name,
	onChange,
	style
}) => {
	return (
		<label
			className={clsx(
				classes.root,
				{
					[classes.alignRight]: align === SwitchAlign.RIGHT,
					[classes.disabled]: disabled
				},
				className,
				"uitk-switch"
			)}
			style={style}
		>
			<input
				className={clsx(classes.input, "uitk-input")}
				checked={checked}
				defaultChecked={defaultChecked}
				disabled={disabled}
				name={name}
				onChange={onChange}
				type="checkbox"
			/>
			<span className={classes.switchContainer} />
			<span className={classes.label}>{label}</span>
		</label>
	);
};

export const Switch: FC<IProps> = (props) => {
	const { control, defaultChecked, name, onChange: _onChange, ...restProps } = props;

	if (control) {
		if (!name) {
			throw new Error("Switch is used in a form without a name!");
		}

		return (
			<Controller
				control={control}
				name={name}
				defaultValue={defaultChecked}
				render={({ onChange, value }) => (
					<BaseSwitch
						{...restProps}
						checked={value}
						defaultChecked={defaultChecked}
						name={name}
						onChange={(event) => {
							_onChange?.(event);
							onChange(event.currentTarget.checked);
						}}
					/>
				)}
			/>
		);
	}

	return <BaseSwitch {...props} />;
};
