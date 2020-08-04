import { Switch } from "@/components/form.component/switch.component";
import { yupResolver } from "@hookform/resolvers";
import { action } from "@storybook/addon-actions";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const BUTTON_MARGIN = 20;

interface IFormData {
	testField: boolean;
}

const schema = yup.object<IFormData>().shape({
	testField: yup.boolean().required().oneOf([true], "Must be true")
});

export const StandardStory: FC = () => {
	const { control, errors, handleSubmit } = useForm<IFormData>({ resolver: yupResolver(schema) });

	return (
		<form onSubmit={handleSubmit(action("onSubmit"))}>
			<Switch
				control={control}
				defaultChecked={false}
				name="testField"
				error={errors.testField?.message}
				label="Enabled"
			/>
			<button type="submit" style={{ marginTop: BUTTON_MARGIN }}>
				Submit
			</button>
		</form>
	);
};
