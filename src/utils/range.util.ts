export const range = (start: number, end: number, step: number = 1) => {
	return [...Array(end - start).keys()].map((_, i) => i * step + start);
};
