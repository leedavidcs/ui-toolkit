import { AbstractButton } from "@/components/button.component/abstract-button.component";
import React, { AnchorHTMLAttributes, DetailedHTMLProps, FC, ReactElement, ReactNode } from "react";

interface IProps
	extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
	children?: ReactNode;
	intent?: Intent;
	leftElement?: Maybe<ReactElement>;
	rightElement?: Maybe<ReactElement>;
	text?: ReactNode;
}

export const AnchorButton: FC<IProps> = (props) => <AbstractButton tagName="a" {...props} />;
