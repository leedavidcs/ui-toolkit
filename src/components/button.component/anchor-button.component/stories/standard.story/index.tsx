import { ReactComponent as Logo } from "@/assets/logo.svg";
import { AnchorButton } from "@/components/button.component/anchor-button.component";
import { select, text } from "@storybook/addon-knobs";
import React, { FC } from "react";

const LOGO_SIZE = 30;

export const StandardStory: FC = () => {
	return (
		<AnchorButton
			href="https://google.com"
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
