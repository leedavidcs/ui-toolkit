import { DecoratorFunction } from "@storybook/addons";
import React, { ReactElement } from "react";
import { JssProvider } from "react-jss";

// Prefix to avoid collision with css-modules
const CLASS_NAME_PREFIX = "uitk-dyn";

export const withJss: DecoratorFunction<ReactElement> = (getStory) => {
	return <JssProvider classNamePrefix={CLASS_NAME_PREFIX}>{getStory()}</JssProvider>;
};
