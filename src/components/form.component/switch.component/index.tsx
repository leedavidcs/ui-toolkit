import { FormGroup } from "@/components/form.component/form-group.component";
import clsx from "clsx";
import React, { ChangeEventHandler, FC, ReactElement, ReactText } from "react";
import { Control, Controller } from "react-hook-form";
import classes from "./styles.module.scss";

interface IProps {
	className?: string;
	checked?: boolean;
	control?: Control<any>;
	defaultChecked?: boolean;
	disabled?: boolean;
	error?: string | ReactElement;
	intent?: Intent;
	label?: ReactText | ReactElement;
	name?: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
}

const BaseSwitch: FC<IProps> = ({
	className,
	checked,
	defaultChecked,
	disabled = false,
	error,
	intent: _intent,
	label,
	name,
	onChange
}) => {
	const intent: Intent = _intent ?? (error ? "danger" : "none");

	return (
		<FormGroup helperText={error} intent={intent}>
			<label className={clsx(classes.root, className)}>
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
				{label}
			</label>
		</FormGroup>
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
