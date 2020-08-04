import { AbstractButton } from "@/components/button.component/abstract-button.component";
import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC, ReactElement, ReactNode } from "react";

interface IProps
	extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	children?: ReactNode;
	intent?: Intent;
	leftElement?: Maybe<ReactElement>;
	rightElement?: Maybe<ReactElement>;
	text?: ReactNode;
}

export const Button: FC<IProps> = (props) => <AbstractButton {...props} />;
