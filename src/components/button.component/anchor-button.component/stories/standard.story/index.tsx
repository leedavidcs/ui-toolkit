import { ReactComponent as Logo } from "@/assets/logo.svg";
import { AnchorButton } from "@/components/button.component/anchor-button.component";
import { boolean, select, text } from "@storybook/addon-knobs";
import React, { FC } from "react";

const LOGO_SIZE = 30;

export const StandardStory: FC = () => {
	return (
		<AnchorButton
			disabled={boolean("disabled", false)}
			href="https://google.com"
			intent={select(
				"intent",
				{
					none: "none",
					primary: "primary",
					success: "success",
					warning: "warning",
					danger: "danger"
				},
				"none"
			)}
			leftElement={<Logo height={LOGO_SIZE} width={LOGO_SIZE} />}
			text={text("text", "Click Me!")}
		/>
	);
};
