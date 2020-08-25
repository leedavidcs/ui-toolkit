import { RegionSelect } from "@/components/form.component/region-select.component";
import { yupResolver } from "@hookform/resolvers";
import { action } from "@storybook/addon-actions";
import { boolean, text } from "@storybook/addon-knobs";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const FORM_WIDTH = 200;
const BTN_MARGIN = 20;

interface IFormData {
	testField: string;
}

const schema = yup.object<IFormData>().shape({
	testField: yup
		.string()
		.required()
		.matches(/^California$/, "Must be California")
});

export const StandardStory: FC = () => {
	const { control, errors, handleSubmit } = useForm<IFormData>({ resolver: yupResolver(schema) });

	return (
		<form onSubmit={handleSubmit(action("onSubmit"))} style={{ width: FORM_WIDTH }}>
			<RegionSelect
				control={control}
				name="testField"
				error={errors.testField?.message}
				country="US"
				disabled={boolean("disabled", false)}
				label={text("label", "State")}
				labelInfo={text("labelInfo", "(required)")}
				placeholder={text("placeholder", "Select a state...")}
			/>
			<button type="submit" style={{ marginTop: BTN_MARGIN }}>
				Submit
			</button>
		</form>
	);
};
