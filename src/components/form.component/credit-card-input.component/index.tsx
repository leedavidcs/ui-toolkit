import { FormGroup } from "@/components/form.component/form-group.component";
import { useFocus } from "@/hooks";
import colors from "@/styles/colors.variables.scss";
import { CardElement, useElements } from "@stripe/react-stripe-js";
import {
	StripeCardElement,
	StripeCardElementChangeEvent,
	StripeCardElementOptions
} from "@stripe/stripe-js";
import clsx from "clsx";
import React, {
	forwardRef,
	ReactElement,
	useCallback,
	useImperativeHandle,
	useMemo,
	useState
} from "react";
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
		error: _error,
		intent: _intent,
		label,
		labelInfo,
		onChange: _onChange
	} = props;

	const elements = useElements();

	useImperativeHandle<Maybe<StripeCardElement>, Maybe<StripeCardElement>>(ref, () => {
		const cardElement: Maybe<StripeCardElement> = elements?.getElement(CardElement);

		return cardElement;
	});

	const { isFocused, handlers } = useFocus();

	const [stripeError, setStripeError] = useState<string>();

	const error: Maybe<string | ReactElement> = stripeError || _error;
	const intent: Intent = _intent ?? (error ? "danger" : "none");

	const onChange = useCallback(
		(event: StripeCardElementChangeEvent): void => {
			_onChange?.(event);

			setStripeError(event.error?.message);
		},
		[_onChange]
	);

	const options: StripeCardElementOptions = useMemo(
		() => ({
			iconStyle: "default",
			style: {
				base: {
					iconColor: colors.gray1,
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
