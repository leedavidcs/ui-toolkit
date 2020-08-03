import { Popover } from "@/components/popver.component";
import { action } from "@storybook/addon-actions";
import { boolean, select } from "@storybook/addon-knobs";
import React, { FC, useCallback, useState } from "react";
import classes from "./styles.module.scss";

export const StandardStory: FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onOpen = useCallback(() => setIsOpen(true), []);
	const onClose = useCallback(() => setIsOpen(false), []);

	return (
		<div className={classes.root}>
			<Popover
				canEscapeKeyClose={boolean("canEscapeKeyClose", true)}
				canOutsideClickClose={boolean("canOutsideClickClose", true)}
				content={
					<div style={{ height: 100, width: 100, backgroundColor: "purple" }}>
						<button onClick={onClose}>Close</button>
					</div>
				}
				disabled={boolean("disabled", false)}
				isOpen={isOpen}
				minimal={boolean("minimal", false)}
				onClose={action("onClose")}
				position={select(
					"position",
					{
						bottom: "bottom",
						"bottom-start": "bottom-start",
						"bottom-end": "bottom-end",
						top: "top",
						"top-start": "top-start",
						"top-end": "top-end",
						left: "left",
						"left-start": "left-start",
						"left-end": "left-end",
						right: "right",
						"right-start": "right-start",
						"right-end": "right-end"
					},
					"bottom-start"
				)}
				usePortal={boolean("usePortal", true)}
			>
				<button onClick={onOpen}>Open</button>
			</Popover>
		</div>
	);
};
