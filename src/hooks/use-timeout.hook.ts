import { useCallback, useEffect, useRef } from "react";

export const useTimeout = (fn: () => void, timeout: number) => {
	const timeoutId = useRef<NodeJS.Timeout>();

	const clear = useCallback((): void => {
		if (timeoutId.current) {
			clearTimeout(timeoutId.current);
		}
	}, []);

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(
		() => {
			timeoutId.current = setTimeout(fn, timeout);

			return () => clear();
		},
		[
			/* Only on mount and unmount */
		]
	);
	/* eslint-enable react-hooks/exhaustive-deps */

	return clear;
};
