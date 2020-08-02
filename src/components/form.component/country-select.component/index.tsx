import { FormGroup } from "@/components/form.component/form-group.component";
import clsx from "clsx";
import React, { ChangeEvent, FC, lazy, ReactElement, Suspense } from "react";
import { Control, Controller } from "react-hook-form";
import classes from "./styles.module.scss";

const CountryDropdown = lazy(() =>
	import("react-country-region-selector").then((module) => ({ default: module.CountryDropdown }))
);

interface IProps {
	className?: string;
	control?: Control<any>;
	defaultValue?: string;
	disabled?: boolean;
	error?: string | ReactElement;
	intent?: Intent;
	label?: string;
	labelInfo?: string;
	name?: string;
	onChange?: (value: string, event?: ChangeEvent<Element>) => void;
	placeholder?: string;
	value?: string;
}

const BaseCountrySelect: FC<IProps> = ({
	className,
	disabled = false,
	error,
	intent: _intent,
	label,
	labelInfo,
	name,
	onChange = () => undefined,
	placeholder,
	value = ""
}) => {
	const intent: Intent = _intent ?? (error ? "danger" : "none");

	return (
		<FormGroup
			className={clsx(
				{
					[classes.success]: intent === "success",
					[classes.warning]: intent === "warning",
					[classes.danger]: intent === "danger"
				},
				className,
				"uitk-country-select"
			)}
			disabled={disabled}
			helperText={error}
			intent={intent}
			label={label}
			labelFor={name}
			labelInfo={labelInfo}
		>
			<div
				className={clsx(
					classes.countryDropdownContainer,
					"uitk-country-dropdown-container"
				)}
			>
				<Suspense fallback={<div>Loading...</div>}>
					<CountryDropdown
						classes={clsx(classes.countryDropdown, "uitk-country-dropdown")}
						defaultOptionLabel={placeholder}
						disabled={disabled}
						name={name}
						onChange={onChange}
						value={value}
						valueType="short"
					/>
				</Suspense>
			</div>
		</FormGroup>
	);
};

export const CountrySelect: FC<IProps> = (props) => {
	const { control, defaultValue, name, onChange: _onChange, value: _value, ...restProps } = props;

	if (control) {
		if (!name) {
			throw new Error("Country select is used in a form without a name!");
		}

		return (
			<Controller
				control={control}
				name={name}
				defaultValue={defaultValue}
				render={({ onChange, value }) => (
					<BaseCountrySelect
						{...restProps}
						onChange={(country, event) => {
							_onChange?.(country, event);
							onChange(country || defaultValue);
						}}
						value={value ?? ""}
					/>
				)}
			/>
		);
	}

	return <BaseCountrySelect {...props} />;
};
