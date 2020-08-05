import {
	IOffsetPaginationParams,
	OffsetPagination
} from "@/components/offset-pagination.component";
import React, { FC, useCallback, useState } from "react";

export const StandardStory: FC = () => {
	const [pagination, setPagination] = useState<IOffsetPaginationParams>({
		count: 100,
		skip: 60,
		take: 5
	});

	const onPage = useCallback((params: IOffsetPaginationParams) => setPagination(params), []);

	return <OffsetPagination {...pagination} onPage={onPage} />;
};
