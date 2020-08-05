import { MouseEvent, RefObject, SyntheticEvent, TouchEvent, useCallback, useEffect } from "react";

export const useOnClickOutside = (
	ref: RefObject<HTMLElement>,
	handler: (event: SyntheticEvent<HTMLElement>) => void
) => {
	const listener = useCallback(
		(event: MouseEvent<HTMLElement> | TouchEvent<HTMLElement>) => {
			const didClickIn = !ref.current || ref.current.contains(event.target as Node | null);

			if (didClickIn) {
				return;
			}

			handler(event);
		},
		[handler, ref]
	);

	useEffect(() => {
		document.addEventListener("mousedown", listener as any);
		document.addEventListener("touchstart", listener as any);

		return () => {
			document.removeEventListener("mousedown", listener as any);
			document.removeEventListener("touchstart", listener as any);
		};
	}, [listener]);
};
