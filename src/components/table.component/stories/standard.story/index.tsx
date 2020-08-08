import { Table } from "@/components/table.component";
import { range } from "@/utils";
import { boolean } from "@storybook/addon-knobs";
import Faker from "faker";
import React, { FC, useState } from "react";

Faker.seed(1);

const DATA_SIZE = 100;
const MAX_AGE = 100;

interface ITableData {
	age: number;
	index: number;
	name: string;
}

const _data = range(0, DATA_SIZE).map<ITableData>((_, i) => ({
	age: Faker.random.number(MAX_AGE),
	index: i,
	name: Faker.name.findName()
}));

export const StandardStory: FC = () => {
	const [data, setData] = useState<readonly ITableData[]>(_data);

	return (
		<div style={{ height: 500, width: 500 }}>
			<Table data={data} onDataChange={setData} sortable={boolean("sortable", false)}>
				<Table.Column width={100}>
					<Table.HeaderCell>Name</Table.HeaderCell>
					<Table.Cell dataKey="name" />
				</Table.Column>
				<Table.Column width={100}>
					<Table.HeaderCell>Age</Table.HeaderCell>
					<Table.Cell dataKey="age" />
				</Table.Column>
			</Table>
		</div>
	);
};
