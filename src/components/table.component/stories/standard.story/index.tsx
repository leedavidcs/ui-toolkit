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
	firstName: string;
	index: number;
	lastName: string;
	country: string;
	state: string;
	city: string;
	street: string;
	zipcode: string;
	company: string;
	phoneNumber: string;
}

const _data = range(0, DATA_SIZE).map<ITableData>((_, i) => ({
	index: i,
	firstName: Faker.name.firstName(),
	lastName: Faker.name.lastName(),
	age: Faker.random.number(MAX_AGE),
	country: Faker.address.country(),
	state: Faker.address.state(),
	city: Faker.address.city(),
	street: Faker.address.streetName(),
	zipcode: Faker.address.zipCode(),
	company: Faker.company.companyName(),
	phoneNumber: Faker.phone.phoneNumber("(###)###-####")
}));

export const StandardStory: FC = () => {
	const [data, setData] = useState<readonly ITableData[]>(_data);
	const [widths, setWidths] = useState<readonly number[]>(
		range(0, Object.keys(data[0]).length).map(() => DEFAULT_COLUMN_WIDTHS)
	);

	const resizable = boolean("resizable", false);

	const onResize = useCallback(
		(newWidth: number, dataKey: ReactText, index: number) => {
			const newWidths = [...widths];

			newWidths[index] = newWidth;

			setWidths(newWidths);
		},
		[widths]
	);

	/* eslint-disable no-magic-numbers */
	return (
		<div
			style={{
				height: number("bounding-height", DEFAULT_BOUNDING_HEIGHT),
				width: number("bounding-width", DEFAULT_BOUNDING_WIDTH)
			}}
		>
			<Table data={data} onDataChange={setData} sortable={boolean("sortable", false)}>
				<Table.Column onResize={onResize} resizable={resizable} width={widths[0]}>
					<Table.HeaderCell>Index</Table.HeaderCell>
					<Table.Cell dataKey="index" />
				</Table.Column>
				<Table.Column onResize={onResize} resizable={resizable} width={widths[1]}>
					<Table.HeaderCell>First Name</Table.HeaderCell>
					<Table.Cell dataKey="firstName" />
				</Table.Column>
				<Table.Column onResize={onResize} resizable={resizable} width={widths[2]}>
					<Table.HeaderCell>Last Name</Table.HeaderCell>
					<Table.Cell dataKey="lastName" />
				</Table.Column>
				<Table.Column onResize={onResize} resizable={resizable} width={widths[3]}>
					<Table.HeaderCell>Age</Table.HeaderCell>
					<Table.Cell dataKey="age" />
				</Table.Column>
				<Table.Column onResize={onResize} resizable={resizable} width={widths[4]}>
					<Table.HeaderCell>Country</Table.HeaderCell>
					<Table.Cell dataKey="country" />
				</Table.Column>
				<Table.Column onResize={onResize} resizable={resizable} width={widths[5]}>
					<Table.HeaderCell>State</Table.HeaderCell>
					<Table.Cell dataKey="state" />
				</Table.Column>
				<Table.Column onResize={onResize} resizable={resizable} width={widths[6]}>
					<Table.HeaderCell>City</Table.HeaderCell>
					<Table.Cell dataKey="city" />
				</Table.Column>
				<Table.Column onResize={onResize} resizable={resizable} width={widths[7]}>
					<Table.HeaderCell>Street</Table.HeaderCell>
					<Table.Cell dataKey="street" />
				</Table.Column>
				<Table.Column onResize={onResize} resizable={resizable} width={widths[8]}>
					<Table.HeaderCell>Zipcode</Table.HeaderCell>
					<Table.Cell dataKey="zipcode" />
				</Table.Column>
				<Table.Column onResize={onResize} resizable={resizable} width={widths[9]}>
					<Table.HeaderCell>Company</Table.HeaderCell>
					<Table.Cell dataKey="company" />
				</Table.Column>
				<Table.Column onResize={onResize} resizable={resizable} width={widths[10]}>
					<Table.HeaderCell>Phone Number</Table.HeaderCell>
					<Table.Cell dataKey="phoneNumber" />
				</Table.Column>
			</Table>
		</div>
	);
	/* eslint-enable no-magic-numbers */
};
