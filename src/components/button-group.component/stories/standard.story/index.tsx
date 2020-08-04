import { ButtonGroup } from "@/components/button-group.component";
import { Button } from "@/components/button.component";
import { Popover } from "@/components/popver.component";
import React, { FC } from "react";

const POPOVER_CONTENT = "I am some popover content!";

export const StandardStory: FC = () => {
	return (
		<ButtonGroup>
			<Button text="First Button" />
			<Button text="Second Button" />
			<Popover content={POPOVER_CONTENT}>
				<Button text="Popover Button" />
			</Popover>
			<Popover content={POPOVER_CONTENT}>
				<Button text="Popover Button" />
			</Popover>
		</ButtonGroup>
	);
};
