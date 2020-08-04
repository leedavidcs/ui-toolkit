import { ReactComponent as Logo } from "@/assets/logo.svg";
import { Button } from "@/components/button.component/button.component";
import { select, text } from "@storybook/addon-knobs";
import React, { FC } from "react";

const LOGO_SIZE = 30;

export const StandardStory: FC = () => {
	return (
		<Button
			intent={select(
				"intent",
				{
					primary: "primary",
					success: "success",
					warning: "warning",
					danger: "danger"
				},
				"primary"
			)}
			leftElement={<Logo height={LOGO_SIZE} width={LOGO_SIZE} />}
			text={text("text", "Click Me!")}
		/>
	);
};
