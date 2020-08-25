import clsx from "clsx";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import { SortableContainer, SortEndHandler } from "react-sortable-hoc";
import { ListContext } from "./context";
import { ListItem } from "./list-item.component";
import classes from "./styles.module.scss";

interface IProps extends DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement> {
	interactable?: boolean;
	onSortEnd?: SortEndHandler;
	sortable?: boolean;
}

const SortableList = SortableContainer<IProps>((props: IProps) => {
	const { children, className, interactable = false, sortable = false, ...restUlProps } = props;

	return (
		<ListContext.Provider value={{ interactable, sortable }}>
			<ul className={clsx(classes.root, className, "uitk-list")} {...restUlProps}>
				{children}
			</ul>
		</ListContext.Provider>
	);
});

const _List = (props: IProps) => {
	const { onSortEnd, ...restProps } = props;

	return (
		<SortableList
			helperClass={classes.sortable}
			onSortEnd={onSortEnd}
			{...(restProps as any)}
		/>
	);
};

_List.displayName = "List";

interface IWithStaticExports {
	Item: typeof ListItem;
}

(_List as typeof _List & IWithStaticExports).Item = ListItem;

export const List = _List as typeof _List & IWithStaticExports;
