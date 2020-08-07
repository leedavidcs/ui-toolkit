import { List } from "@/components/list.component";
import { arrayMove, range } from "@/utils";
import { boolean } from "@storybook/addon-knobs";
import Faker from "faker";
import React, { FC, useCallback, useState } from "react";
import { SortEndHandler } from "react-sortable-hoc";

Faker.seed(1);

const DATA_SIZE = 10;

const _data = range(0, DATA_SIZE).map(() => Faker.name.findName());

export const StandardStory: FC = () => {
	const [data, setData] = useState<readonly string[]>(_data);

	const onSortEnd: SortEndHandler = useCallback(({ oldIndex, newIndex }) => {
		setData((oldData) => arrayMove(oldData, oldIndex, newIndex));
	}, []);

	return (
		<List
			interactable={boolean("interactable", false)}
			onSortEnd={onSortEnd}
			sortable={boolean("sortable", false)}
		>
			{data.map((datum, i) => (
				<List.Item key={i} index={i}>
					{datum}
				</List.Item>
			))}
		</List>
	);
};
