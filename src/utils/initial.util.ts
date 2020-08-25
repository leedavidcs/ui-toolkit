export const initial = <T>(arr: MaybeReadonlyArray<T>): T[] => arr.slice(0, arr.length - 1);
