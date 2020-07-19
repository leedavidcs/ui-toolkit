import { Popover } from "@/components/popover.component";
import { boolean } from "@storybook/addon-knobs";
import React, { FC, useCallback, useState } from "react";
import classes from "./styles.module.scss";

export const StandardStory: FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<div className={classes.root}>
			<Popover
				canEscapeKeyClose={boolean("canEscapeKeyClose", true)}
				canOutsideClickClose={boolean("canOutsideClickClose", true)}
				content={<div className={classes.content}>Hello world!</div>}
				isOpen={isOpen}
				disabled={boolean("disabled", false)}
				minimal={boolean("minimal", false)}
				onClose={close}
				position="bottom-start"
				usePortal={boolean("usePortal", false)}
			>
				<button onClick={open} type="button">
					Click me
				</button>
			</Popover>
		</div>
	);
};
