import { RefObject, useCallback, useEffect } from "react";

export const useOnClickOutside = (ref: RefObject<HTMLElement>, handler: () => void) => {
	const listener = useCallback(
		(event: MouseEvent | TouchEvent) => {
			const didClickIn = !ref.current || ref.current.contains(event.target as Node | null);

			if (didClickIn) {
				return;
			}

			handler();
		},
		[handler, ref]
	);

	useEffect(() => {
		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [listener]);
};
