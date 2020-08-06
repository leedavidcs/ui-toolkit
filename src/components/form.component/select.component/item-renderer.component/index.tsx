import type { ISelectItemType } from "@/components/form.component/select.component";
import clsx from "clsx";
import React, {
	MouseEvent,
	ReactElement,
	ReactNode,
	ReactText,
	SyntheticEvent,
	useCallback
} from "react";
import classes from "./styles.module.scss";

export interface IItemRendererProps<T extends unknown> extends ISelectItemType<T> {
	disabled?: boolean;
	id: ReactText;
	index: number;
	info?: ReactNode;
	isSelected?: boolean;
	name: ReactText;
	onClick?: (
		item: ISelectItemType<T>,
		index: number,
		event?: SyntheticEvent<HTMLElement>
	) => void;
	value: T;
}

export type ItemRendererType<T extends unknown> = (props: IItemRendererProps<T>) => ReactElement;

export const ItemRenderer: ItemRendererType<any> = ({
	id,
	index,
	info,
	isSelected,
	name,
	onClick: _onClick,
	value
}) => {
	const onClick = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
			_onClick?.(
				{
					key: id,
					info,
					name,
					value
				},
				index,
				event
			);
		},
		[_onClick, id, index, info, name, value]
	);

	return (
		<div className={clsx(classes.root, { [classes.selected]: isSelected })} onClick={onClick}>
			<span className={classes.name}>{name}</span>
			{info && <span className={classes.info}>{info}</span>}
		</div>
	);
};
