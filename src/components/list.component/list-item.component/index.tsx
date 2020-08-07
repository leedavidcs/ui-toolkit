import { IListContextProps, ListContext } from "@/components/list.component/context";
import clsx from "clsx";
import React, { DetailedHTMLProps, FC, LiHTMLAttributes, useContext } from "react";
import { SortableElement } from "react-sortable-hoc";
import classes from "./styles.module.scss";

interface IProps extends DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> {
	index?: number;
}

const BaseListItem: FC<IProps> = ({ children, className, ...restUlProps }) => {
	const { interactable, sortable } = useContext<IListContextProps>(ListContext);

	return (
		<li
			className={clsx(
				classes.root,

				className,
				"uitk-list-item"
			)}
			{...restUlProps}
		>
			<div
				className={clsx(
					classes.content,
					{
						[classes.interactable]: interactable,
						[classes.sortable]: sortable
					},
					"uitk-list-item-content"
				)}
			>
				{children}
			</div>
		</li>
	);
};

const SortableListItem = SortableElement<IProps>((props: IProps) => {
	return <BaseListItem {...props} />;
});

export const ListItem: FC<IProps> = (props) => {
	const { index, ...restProps } = props;

	const { sortable } = useContext<IListContextProps>(ListContext);

	if (sortable) {
		if (typeof index !== "number") {
			throw new Error("List item is used in a sortable list without an index!");
		}

		return <SortableListItem index={index} {...(restProps as any)} />;
	}

	return <BaseListItem {...restProps} />;
};
