import { ReactComponent as Logo } from "@/assets/logo.svg";
import { TextInput } from "@/components/form.component/text-input.component";
import { yupResolver } from "@hookform/resolvers";
import { action } from "@storybook/addon-actions";
import { boolean, text } from "@storybook/addon-knobs";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const ICON_SIZE = 30;
const FORM_WIDTH = 200;
const BTN_MARGIN = 20;
const MAX_FIELD_LENGTH = 5;

interface IFormData {
	testField: string;
}

const schema = yup.object<IFormData>().shape({
	testField: yup
		.string()
		.required()
		.max(MAX_FIELD_LENGTH, `Must be at most ${MAX_FIELD_LENGTH} chars`)
});

export const StandardStory: FC = () => {
	const { control, errors, handleSubmit } = useForm<IFormData>({ resolver: yupResolver(schema) });

	return (
		<form onSubmit={handleSubmit(action("onSubmit"))} style={{ width: FORM_WIDTH }}>
			<TextInput
				control={control}
				name="testField"
				error={errors.testField?.message}
				disabled={boolean("disabled", false)}
				label={text("label", "Label")}
				labelInfo={text("labelInfo", "(required)")}
				leftElement={<Logo height={ICON_SIZE} width={ICON_SIZE} />}
				placeholder={text("placeholder", "Placeholder...")}
				submitOnEnter={boolean("submitOnEnter", false)}
			/>
			<button type="submit" style={{ marginTop: BTN_MARGIN }}>
				Submit
			</button>
		</form>
	);
};
