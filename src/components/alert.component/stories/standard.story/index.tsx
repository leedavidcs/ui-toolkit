import { Alert } from "@/components/alert.component";
import { boolean, select, text } from "@storybook/addon-knobs";
import Faker from "faker";
import React, { FC, useCallback, useState } from "react";

Faker.seed(1);

const contents = Faker.lorem.paragraph();

export const StandardStory: FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onOpen = useCallback(() => setIsOpen(true), []);
	const onClose = useCallback(() => setIsOpen(false), []);

	return (
		<div>
			<button onClick={onOpen}>Open</button>
			<Alert
				cancelButtonText={text("cancelButtonText", "Cancel")}
				canEscapeKeyCancel={boolean("canEscapeKeyCancel", false)}
				canOutsideClickCancel={boolean("canOutsideClickCancel", false)}
				confirmButtonText={text("confirmButtonText", "Confirm")}
				intent={select(
					"intent",
					{
						primary: "primary",
						success: "success",
						warning: "warning",
						danger: "danger"
					},
					"danger"
				)}
				isOpen={isOpen}
				onClose={onClose}
				usePortal={boolean("usePortal", true)}
			>
				{contents}
			</Alert>
		</div>
	);
};
