import Keycode from "keycode";
import { KeyboardEvent, KeyboardEventHandler, useCallback, useEffect } from "react";

interface IUseOnKeyDownOptions {
	global?: boolean;
	key: keyof typeof Keycode["codes"];
}

export const useOnKeyDown = <T extends HTMLElement>(
	options: IUseOnKeyDownOptions,
	callback: KeyboardEventHandler<T>
) => {
	const { global = false, key } = options;

	const onKeyDown = useCallback(
		(event: KeyboardEvent<T>): KeyboardEvent<T> => {
			const { keyCode } = event;

			if (keyCode !== Keycode.codes[key]) {
				return event;
			}

			callback(event);

			return event;
		},
		[callback, key]
	);

	useEffect(() => {
		if (!global) {
			return;
		}

		document.body.addEventListener("keydown", onKeyDown as any);
		document.body.addEventListener("keydown", onKeyDown as any);

		return () => {
			document.body.removeEventListener("keydown", onKeyDown as any);
			document.body.removeEventListener("keydown", onKeyDown as any);
		};
	}, [global, onKeyDown]);

	return onKeyDown;
};
