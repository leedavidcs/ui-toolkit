import { Modal } from "@/components/modal.component";
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
			<Modal isOpen={isOpen} onClose={onClose}>
				{contents}
			</Modal>
		</div>
	);
};
