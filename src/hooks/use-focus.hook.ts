import composeRefs from "@seznam/compose-react-refs";
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useFocus = <T extends HTMLElement = any>(elemRef?: RefObject<T>) => {
	const localRef = useRef<T>(null);
	const ref = composeRefs(localRef, elemRef);

	const [isFocused, setIsFocused] = useState<boolean>(false);

	const onFocus = useCallback(() => setIsFocused(true), []);
	const onBlur = useCallback(() => setIsFocused(false), []);

	const handlers = useMemo(() => ({ onFocus, onBlur }), [onBlur, onFocus]);

	useEffect(() => {
		const elem = localRef.current ?? elemRef?.current;

		if (!elem) {
			return;
		}

		elem.addEventListener("focus", onFocus);
		elem.addEventListener("blur", onBlur);

		return () => {
			elem.removeEventListener("focus", onFocus);
			elem.removeEventListener("blur", onBlur);
		};
	}, [onFocus, onBlur, elemRef]);

	return useMemo(() => ({ ref, isFocused, handlers }), [handlers, isFocused, ref]);
};
