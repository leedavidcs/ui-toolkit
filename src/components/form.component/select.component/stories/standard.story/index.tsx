import { Select } from "@/components/form.component/select.component";
import { range } from "@/utils";
import { text } from "@storybook/addon-knobs";
import Faker from "faker";
import React, { FC } from "react";

Faker.seed(1);

const DATA_SIZE = 100;

interface ISelectItem {
	value: string;
	key: string;
}

const TypedSelect = Select.ofType<string, ISelectItem>();

const items: readonly ISelectItem[] = range(0, DATA_SIZE).map(() => ({
	value: Faker.name.findName(),
	key: Faker.random.uuid()
}));

export const StandardStory: FC = () => {
	return <TypedSelect items={items} placeholder={text("placeholder", "Placeholder...")} />;
};
