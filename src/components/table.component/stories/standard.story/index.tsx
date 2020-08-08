import { Table } from "@/components/table.component";
import { range } from "@/utils";
import { boolean, number } from "@storybook/addon-knobs";
import Faker from "faker";
import React, { FC, ReactText, useCallback, useState } from "react";

Faker.seed(1);

const DATA_SIZE = 100;
const MAX_AGE = 100;
const DEFAULT_COLUMN_WIDTHS = 100;
const DEFAULT_BOUNDING_HEIGHT = 480;
const DEFAULT_BOUNDING_WIDTH = 848;

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
	const [widths, setWidths] = useState<readonly number[]>([
		DEFAULT_COLUMN_WIDTHS,
		DEFAULT_COLUMN_WIDTHS
	]);

	const resizable = boolean("resizable", false);

	const onResize = useCallback(
		(newWidth: number, dataKey: ReactText, index: number) => {
			const newWidths = [...widths];

			newWidths[index] = newWidth;

			setWidths(newWidths);
		},
		[widths]
	);

	return (
		<div
			style={{
				height: number("bounding-height", DEFAULT_BOUNDING_HEIGHT),
				width: number("bounding-width", DEFAULT_BOUNDING_WIDTH)
			}}
		>
			<Table data={data} onDataChange={setData} sortable={boolean("sortable", false)}>
				<Table.Column onResize={onResize} resizable={resizable} width={widths[0]}>
					<Table.HeaderCell>Name</Table.HeaderCell>
					<Table.Cell dataKey="name" />
				</Table.Column>
				<Table.Column onResize={onResize} resizable={resizable} width={widths[1]}>
					<Table.HeaderCell>Age</Table.HeaderCell>
					<Table.Cell dataKey="age" />
				</Table.Column>
			</Table>
		</div>
	);
};
