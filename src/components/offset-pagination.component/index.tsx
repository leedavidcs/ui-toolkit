import { head, initial, last, range } from "@/utils";
import clsx from "clsx";
import React, { FC, useCallback, useMemo } from "react";
import classes from "./styles.module.scss";

const DEFAULT_INNER_PAGE_RANGE = 5;
const DEFAULT_MARGIN_PAGE_RANGE = 2;

export interface IOffsetPaginationParams {
	count: number;
	skip: number;
	take: number;
}

interface IProps extends IOffsetPaginationParams {
	className?: string;
	innerRange?: number;
	marginRange?: number;
	onPage?: (params: IOffsetPaginationParams) => void;
}

const getPageCount = ({ count, take }: IOffsetPaginationParams): number =>
	Math.ceil(count / take) || 1;

const getCurrentPage = ({ skip, take }: IOffsetPaginationParams): number => Math.floor(skip / take);

const getSkipFromPage = (page: number, take: number): number => page * take;

const doesOverlap = (firstRange: readonly number[], secondRange: readonly number[]): boolean => {
	const largestOfFirst: number | undefined = last(firstRange);
	const smallestOfSecond: number | undefined = head(secondRange);

	if (largestOfFirst === undefined || smallestOfSecond === undefined) {
		return false;
	}

	return 1 + largestOfFirst >= smallestOfSecond;
};

const mergeOverlap = (
	firstRange: readonly number[],
	secondRange: readonly number[]
): readonly number[] => {
	const largestOfFirst: number | undefined = last(firstRange);

	if (largestOfFirst === undefined) {
		return secondRange;
	}

	return [...firstRange, ...secondRange.filter((num) => num > largestOfFirst)];
};

const mergeAllRangeOverlaps = (
	pageRanges: readonly (readonly number[])[]
): readonly (readonly number[])[] => {
	return pageRanges.reduce((acc, currentRange) => {
		const previousRange = last(acc);

		if (previousRange === undefined) {
			return [currentRange];
		}

		if (!doesOverlap(previousRange, currentRange)) {
			return [...acc, currentRange];
		}

		return [...initial(acc), mergeOverlap(previousRange, currentRange)];
	}, [] as readonly (readonly number[])[]);
};

interface IGetPageRangesParams {
	pageCount: number;
	currentPage: number;
	innerRange: number;
	marginRange: number;
}

const getPageRanges = ({
	pageCount,
	currentPage,
	innerRange,
	marginRange
}: IGetPageRangesParams): readonly (readonly number[])[] => {
	if (pageCount === 0) {
		return [];
	}

	const innerOffset: number = (innerRange - 1) / 2;

	const startRange: readonly number[] = range(0, Math.min(marginRange, pageCount));
	const centerRange: readonly number[] = range(
		Math.max(0, currentPage - Math.floor(innerOffset)),
		Math.min(currentPage + Math.ceil(innerOffset + 1), pageCount)
	);
	const endRange: readonly number[] = range(Math.max(0, pageCount - marginRange), pageCount);

	const pageRanges: readonly (readonly number[])[] = [startRange, centerRange, endRange];

	return mergeAllRangeOverlaps(pageRanges);
};

export const OffsetPagination: FC<IProps> = ({
	className,
	count,
	innerRange = DEFAULT_INNER_PAGE_RANGE,
	marginRange = DEFAULT_MARGIN_PAGE_RANGE,
	onPage,
	skip,
	take
}) => {
	const pageCount = useMemo(() => getPageCount({ count, skip, take }), [count, skip, take]);
	const currentPage = useMemo(() => getCurrentPage({ count, skip, take }), [count, skip, take]);

	const pageRanges = useMemo(
		() => getPageRanges({ pageCount, currentPage, innerRange, marginRange }),
		[currentPage, innerRange, marginRange, pageCount]
	);

	const isLastRange = useCallback((i: number) => i === pageRanges.length - 1, [pageRanges]);
	const isFirstPage = currentPage === 0;
	const isLastPage = currentPage === pageCount - 1;

	const onClickPage = useCallback(
		(page: number) => () => onPage?.({ count, take, skip: getSkipFromPage(page, take) }),
		[count, onPage, take]
	);

	const onPreviousPage = useCallback(
		() => onPage?.({ count, take, skip: getSkipFromPage(currentPage - 1, take) }),
		[count, currentPage, onPage, take]
	);

	const onNextPage = useCallback(
		() => onPage?.({ count, take, skip: getSkipFromPage(currentPage + 1, take) }),
		[count, currentPage, onPage, take]
	);

	if (pageCount === 1) {
		return null;
	}

	return (
		<div className={classes.root}>
			{!isFirstPage && <div className={classes.sidePage} onClick={onPreviousPage} />}
			{pageRanges.map((pageRange, i) => (
				<>
					{pageRange.map((page) => (
						<span
							key={page}
							className={clsx(classes.page, {
								[classes.selected]: currentPage === page
							})}
							onClick={onClickPage(page)}
						>
							{page + 1}
						</span>
					))}
					{!isLastRange(i) && (
						<div className={clsx(classes.more, "uitk-pagination-more")}>
							&#x00b7;&#x00b7;&#x00b7;
						</div>
					)}
				</>
			))}
			{!isLastPage && <div className={classes.sidePage} onClick={onNextPage} />}
		</div>
	);
};
