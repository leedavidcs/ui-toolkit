export const arrayMove = <T>(
	array: MaybeReadonlyArray<T>,
	from: number,
	to: number
): readonly T[] => {
	const newArray: T[] = [...array];

	const startIndex = to < 0 ? newArray.length + to : to;

	if (startIndex >= 0 && startIndex < newArray.length) {
		const item: T = newArray.splice(from, 1)[0];

		newArray.splice(startIndex, 0, item);
	}

	return newArray;
};
