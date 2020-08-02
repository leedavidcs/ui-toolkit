import { FormGroup } from "@/components/form.component/form-group.component";
import clsx from "clsx";
import React, {
	CSSProperties,
	FC,
	FormEventHandler,
	forwardRef,
	ReactElement,
	RefAttributes,
	useEffect,
	useRef,
	useState
} from "react";
import { Control, Controller } from "react-hook-form";
import classes from "./styles.module.scss";

interface IProps {
	autoComplete?: string;
	className?: string;
	control?: Control<any>;
	defaultValue?: string;
	disabled?: boolean;
	error?: string | ReactElement;
	intent?: Intent;
	label?: string;
	labelInfo?: string;
	leftElement?: Maybe<ReactElement>;
	name?: string;
	onChange?: FormEventHandler<HTMLInputElement>;
	placeholder?: string;
	rightElement?: Maybe<ReactElement>;
	style?: CSSProperties;
	value?: string;
}

const BaseTextInput = forwardRef<HTMLInputElement, IProps>((props, ref) => {
	const {
		autoComplete,
		className,
		disabled = false,
		error,
		intent: _intent,
		label,
		labelInfo,
		leftElement,
		name,
		onChange,
		placeholder,
		rightElement,
		style,
		value
	} = props;

	const intent: Intent = _intent ?? (error ? "danger" : "none");

	const [inputStyle, setInputStyle] = useState<CSSProperties>({});

	const leftElementRef = useRef<HTMLSpanElement>(null);
	const rightElementRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		setInputStyle({
			paddingLeft: leftElementRef.current?.clientWidth,
			paddingRight: rightElementRef.current?.clientWidth
		});
	}, [leftElement, rightElement]);

	return (
		<FormGroup
			className={clsx(
				{
					[classes.success]: intent === "success",
					[classes.warning]: intent === "warning",
					[classes.danger]: intent === "danger"
				},
				"uitk-text-input",
				className
			)}
			disabled={disabled}
			helperText={error}
			intent={intent}
			label={label}
			labelInfo={labelInfo}
		>
			<div className={clsx(classes.inputContainer, "uitk-input-container")} style={style}>
				{leftElement && (
					<span
						className={clsx(classes.leftContainer, "uitk-left-element")}
						ref={leftElementRef}
					>
						{leftElement}
					</span>
				)}
				<input
					ref={ref}
					className={clsx(classes.textInput, "uitk-input")}
					autoComplete={autoComplete}
					disabled={disabled}
					name={name}
					onChange={onChange}
					placeholder={placeholder}
					style={inputStyle}
					type="text"
					value={value}
				/>
				{rightElement && (
					<span
						className={clsx(classes.rightContainer, "uitk-right-element")}
						ref={rightElementRef}
					>
						{rightElement}
					</span>
				)}
			</div>
		</FormGroup>
	);
});

BaseTextInput.displayName = "TextInput";

export const TextInput: FC<IProps & RefAttributes<HTMLInputElement>> = (props) => {
	const { control, defaultValue, name, value: _value, onChange: _onChange, ...restProps } = props;

	if (control) {
		if (!name) {
			throw new Error("Text input is used in a form without a name!");
		}

		return (
			<Controller
				control={control}
				name={name}
				defaultValue={defaultValue}
				render={({ onChange, value }) => (
					<BaseTextInput
						{...restProps}
						onChange={(event) => {
							_onChange?.(event);
							onChange(event.currentTarget.value || defaultValue);
						}}
						value={value ?? ""}
					/>
				)}
			/>
		);
	}

	return <BaseTextInput {...props} />;
};
