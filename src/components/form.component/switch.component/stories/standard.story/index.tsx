import { Switch, SwitchAlign } from "@/components/form.component/switch.component";
import { yupResolver } from "@hookform/resolvers";
import { action } from "@storybook/addon-actions";
import { boolean, select, text } from "@storybook/addon-knobs";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const BUTTON_MARGIN = 20;

interface IFormData {
	testField: boolean;
}

const schema = yup.object<IFormData>().shape({
	testField: yup.boolean()
});

export const StandardStory: FC = () => {
	const { control, handleSubmit } = useForm<IFormData>({ resolver: yupResolver(schema) });

	return (
		<form onSubmit={handleSubmit(action("onSubmit"))}>
			<div>
				<Switch
					control={control}
					defaultChecked={false}
					name="testField"
					align={select(
						"align",
						{
							LEFT: SwitchAlign.LEFT,
							RIGHT: SwitchAlign.RIGHT
						},
						SwitchAlign.LEFT
					)}
					disabled={boolean("disabled", false)}
					label={text("label0", "Activity Enabled")}
				/>
			</div>
			<button type="submit" style={{ marginTop: BUTTON_MARGIN }}>
				Submit
			</button>
		</form>
	);
};
