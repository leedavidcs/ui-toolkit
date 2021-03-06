import { PageDrawer, PageDrawerPosition } from "@/components/page-drawer.component";
import { boolean, select } from "@storybook/addon-knobs";
import Faker from "faker";
import React, { FC, useCallback, useState } from "react";

Faker.seed(1);

const paragraph: string = Faker.lorem.paragraph();

export const StandardStory: FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onOpen = useCallback(() => setIsOpen(true), []);
	const onClose = useCallback(() => setIsOpen(false), []);

	return (
		<div>
			<button onClick={onOpen}>Open Drawer</button>
			<PageDrawer
				canEscapeKeyClose={boolean("canEscapeKeyClose", true)}
				canOutsideClickClose={boolean("canOutsideClickClose", true)}
				isOpen={isOpen}
				onClose={onClose}
				position={select(
					"position",
					{
						[PageDrawerPosition.TOP]: PageDrawerPosition.TOP,
						[PageDrawerPosition.BOTTOM]: PageDrawerPosition.BOTTOM,
						[PageDrawerPosition.LEFT]: PageDrawerPosition.LEFT,
						[PageDrawerPosition.RIGHT]: PageDrawerPosition.RIGHT
					},
					PageDrawerPosition.LEFT
				)}
			>
				{paragraph}
			</PageDrawer>
		</div>
	);
};
