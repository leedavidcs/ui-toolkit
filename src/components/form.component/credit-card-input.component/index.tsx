import colors from "@/colors.scss";
import { FormGroup } from "@/components/form.component/form-group.component";
import { useFocus } from "@/hooks";
import { CardElement, useElements } from "@stripe/react-stripe-js";
import {
	StripeCardElement,
	StripeCardElementChangeEvent,
	StripeCardElementOptions
} from "@stripe/stripe-js";
import clsx from "clsx";
import React, { forwardRef, ReactElement, useImperativeHandle, useMemo } from "react";
import classes from "./styles.module.scss";

interface IProps {
	cardElementClassName?: string;
	className?: string;
	error?: string | ReactElement;
	intent?: Intent;
	label?: string;
	labelInfo?: string;
	onChange?: (event: StripeCardElementChangeEvent) => void;
}

export const CreditCardInput = forwardRef<Maybe<StripeCardElement>, IProps>((props, ref) => {
	const {
		cardElementClassName,
		className,
		error,
		intent: _intent,
		label,
		labelInfo,
		onChange
	} = props;

	const intent: Intent = _intent ?? (error ? "danger" : "none");

	const elements = useElements();

	useImperativeHandle<Maybe<StripeCardElement>, Maybe<StripeCardElement>>(ref, () => {
		const cardElement: Maybe<StripeCardElement> = elements?.getElement(CardElement);

		return cardElement;
	});

	const { isFocused, handlers } = useFocus();

	const options: StripeCardElementOptions = useMemo(
		() => ({
			iconStyle: "default",
			style: {
				base: {
					iconColor: colors.textMuted,
					color: "#000",
					fontFamily: "Roboto"
				}
			}
		}),
		[]
	);

	return (
		<FormGroup
			className={clsx(className, "uitk-credit-card-input")}
			helperText={error}
			intent={intent}
			label={label}
			labelInfo={labelInfo}
		>
			<CardElement
				className={clsx(
					classes.cardElement,
					{ [classes.cardElementFocused]: isFocused },
					cardElementClassName
				)}
				onChange={onChange}
				onFocus={handlers.onFocus}
				onBlur={handlers.onBlur}
				options={options}
			/>
		</FormGroup>
	);
});

CreditCardInput.displayName = "CreditCardInput";
