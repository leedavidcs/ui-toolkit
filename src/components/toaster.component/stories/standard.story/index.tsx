import { useToaster } from "@/components/toaster.component";
import React, { FC, useCallback, useRef } from "react";

export const StandardStory: FC = () => {
	const { show } = useToaster();

	const count = useRef<number>(0);

	const onClick = useCallback(() => show({ message: `New toast: ${++count.current}` }), [show]);

	return (
		<button onClick={onClick} type="button">
			Click me
		</button>
	);
};
