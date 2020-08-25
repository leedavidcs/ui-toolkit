import { useModal } from "@/components/modal.component/modal-provider.component";
import Faker from "faker";
import React, { FC, useCallback } from "react";

Faker.seed(1);

const paragraph = Faker.lorem.paragraph();

export const StandardStory: FC = () => {
	const { setContent, toggle } = useModal();

	const onOpen = useCallback(() => {
		setContent({ title: "Hello World~!", body: <div>{paragraph}</div> });
		toggle(true);
	}, [setContent, toggle]);

	return (
		<div>
			<button onClick={onOpen}>Open Modal</button>
		</div>
	);
};
