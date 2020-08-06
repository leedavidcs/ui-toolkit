import { Select } from "@/components/form.component/select.component";
import { range } from "@/utils";
import { yupResolver } from "@hookform/resolvers";
import { action } from "@storybook/addon-actions";
import { boolean, text } from "@storybook/addon-knobs";
import Faker from "faker";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

Faker.seed(1);

const DATA_SIZE = 100;
const BUTTON_MARGIN = 20;

interface IFormData {
	testField: {
		value: string;
		key: string;
	};
}

interface ISelectItem {
	value: string;
	key: string;
}

const schema = yup.object<IFormData>().shape({
	testField: yup
		.object<IFormData["testField"]>()
		.shape({
			value: yup.string().required().matches(/^m/i, "Must start with M"),
			key: yup.string().required()
		})
		.required()
});

const TypedSelect = Select.ofType<ISelectItem>();

const items: readonly ISelectItem[] = range(0, DATA_SIZE).map(() => ({
	value: Faker.name.findName(),
	key: Faker.random.uuid()
}));

export const StandardStory: FC = () => {
	const { control, errors, handleSubmit } = useForm<IFormData>({ resolver: yupResolver(schema) });

	return (
		<form onSubmit={handleSubmit(action("onSubmit"))}>
			<TypedSelect
				control={control}
				name="testField"
				error={errors.testField?.value?.message}
				disabled={boolean("disabled", false)}
				label={text("label", "Name")}
				labelInfo={text("labelInfo", "(required)")}
				itemName={(item) => item.value}
				items={items}
				minimal={boolean("minimal", true)}
				placeholder={text("placeholder", "Placeholder...")}
				usePortal={boolean("usePortal", false)}
			/>
			<button type="submit" style={{ marginTop: BUTTON_MARGIN }}>
				Submit
			</button>
		</form>
	);
};
