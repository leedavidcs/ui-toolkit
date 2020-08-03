import { FormGroup } from "@/components/form.component/form-group.component";
import clsx from "clsx";
import React, { FC, lazy, ReactElement, Suspense } from "react";
import { Control, Controller } from "react-hook-form";
import classes from "./styles.module.scss";

const RegionDropdown = lazy(() =>
	import("react-country-region-selector").then((module) => ({ default: module.RegionDropdown }))
);

interface IProps {
	className?: string;
	control?: Control<any>;
	country?: string;
	defaultValue?: string;
	disabled?: boolean;
	error?: string | ReactElement;
	intent?: Intent;
	label?: string;
	labelInfo?: string;
	name?: string;
	onChange?: (value: string, event?: React.ChangeEvent<Element>) => void;
	placeholder?: string;
	value?: string;
}

const BaseRegionSelect: FC<IProps> = ({
	className,
	country = "",
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
				"uitk-region-select"
			)}
			disabled={disabled}
			helperText={error}
			intent={intent}
			label={label}
			labelFor={name}
			labelInfo={labelInfo}
		>
			<div
				className={clsx(classes.regionDropdownContainer, "uitk-region-dropdown-container")}
			>
				<Suspense fallback={<div>Loading...</div>}>
					<RegionDropdown
						classes={clsx(classes.regionDropdown, "uitk-region-dropdown")}
						country={country}
						countryValueType="short"
						defaultOptionLabel={placeholder}
						disabled={disabled}
						name={name}
						onChange={onChange}
						value={value}
					/>
				</Suspense>
			</div>
		</FormGroup>
	);
};

export const RegionSelect: FC<IProps> = (props) => {
	const { control, defaultValue, name, onChange: _onChange, value: _value, ...restProps } = props;

	if (control) {
		if (!name) {
			throw new Error("Region select is used in a form without a name!");
		}

		return (
			<Controller
				control={control}
				name={name}
				defaultValue={defaultValue}
				render={({ onChange, value }) => (
					<BaseRegionSelect
						{...restProps}
						name={name}
						onChange={(region, event) => {
							_onChange?.(region, event);
							onChange(region || defaultValue);
						}}
						value={value ?? ""}
					/>
				)}
			/>
		);
	}

	return <BaseRegionSelect {...props} />;
};
