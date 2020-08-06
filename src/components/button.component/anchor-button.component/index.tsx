import { AbstractButton } from "@/components/button.component/abstract-button.component";
import React, {
	AnchorHTMLAttributes,
	DetailedHTMLProps,
	FC,
	MouseEvent,
	ReactElement,
	ReactNode,
	useCallback
} from "react";

interface IProps
	extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
	children?: ReactNode;
	disabled?: boolean;
	intent?: Intent;
	leftElement?: Maybe<ReactElement>;
	rightElement?: Maybe<ReactElement>;
	text?: ReactNode;
}

export const AnchorButton: FC<IProps> = (props) => {
	const onClick = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			if (props.disabled) {
				event.preventDefault();
			}

			props.onClick?.(event);
		},
		[props.disabled, props.onClick]
	);

	return <AbstractButton onClick={onClick} tagName="a" {...props} />;
};
