import { useCallback, useEffect, useMemo, useState } from "react";

export const useUncontrolledProp = <T extends unknown>(prop: T | undefined, defaultValue: T) => {
	const [controlled, setControlled] = useState<T>(defaultValue);

	const setProp = useCallback(
		(newValue: T) => {
			if (prop !== undefined) {
				return;
			}

			setControlled(newValue);
		},
		[prop]
	);

	useEffect(() => setControlled(prop ?? controlled), [controlled, prop]);

	return useMemo(() => [controlled, setProp] as [T, typeof setProp], [controlled, setProp]);
};
