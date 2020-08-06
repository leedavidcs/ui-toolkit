import { Button } from "@/components/button.component";
import { Popover } from "@/components/popover.component";
import { useUncontrolledProp } from "@/hooks";
import { isNil } from "@/utils";
import clsx from "clsx";
import React, {
	FC,
	memo,
	ReactNode,
	ReactText,
	SyntheticEvent,
	useCallback,
	useMemo,
	useState
} from "react";
import { ItemRenderer as _ItemRenderer, ItemRendererType } from "./item-renderer.component";
import classes from "./styles.module.scss";

export interface ISelectItemType<T = any> {
	info?: ReactNode;
	key: ReactText;
	name: ReactText;
	value: T;
}

interface IProps<T, TOriginal = T> {
	className?: string;
	disabled?: boolean;
	itemInfo?: (item: TOriginal) => ReactNode;
	itemKey?: (item: TOriginal) => ReactText;
	itemMap?: {
		from: (original: TOriginal) => T;
		to: (to: T) => TOriginal;
	};
	itemName?: (item: TOriginal) => ReactText;
	itemRenderer?: ItemRendererType<TOriginal>;
	items: readonly TOriginal[];
	minimal?: boolean;
	onItemSelect?: (item: T, event?: SyntheticEvent<HTMLElement>) => void;
	placeholder?: string;
	selected?: Maybe<T>;
	usePortal?: boolean;
}

const ofType = <T extends unknown, TOriginal = T>() => {
	type InternalItem = ISelectItemType<TOriginal>;

	const component: FC<IProps<T, TOriginal>> = memo((props) => {
		const {
			className,
			disabled,
			itemInfo,
			itemKey = (value: TOriginal) => (value as any)?.key ?? String(value),
			itemMap = {
				from: (value: any) => value,
				to: (value: any) => value
			},
			itemName = (value: TOriginal) => (value as any)?.key ?? String(value),
			itemRenderer: ItemRenderer = _ItemRenderer,
			items: _items,
			minimal = true,
			onItemSelect: _onItemSelect,
			placeholder = "",
			selected: _selected,
			usePortal = false
		} = props;

		const [isOpen, setIsOpen] = useState<boolean>(false);
		const [selected, setSelected] = useUncontrolledProp(_selected, null);

		const toInternalItem = useCallback(
			(value: TOriginal): InternalItem => {
				const info = itemInfo?.(value);
				const key = itemKey(value);
				const name = itemName(value);

				return { key, info, name, value };
			},
			[itemInfo, itemKey, itemName]
		);

		const items: InternalItem[] = useMemo(() => _items.map(toInternalItem), [
			_items,
			toInternalItem
		]);

		const onItemSelect = useCallback(
			(item: InternalItem) => {
				const newSelected: T = itemMap.from(item.value);

				setIsOpen(false);
				setSelected(newSelected);
				_onItemSelect?.(newSelected);
			},
			[_onItemSelect, itemMap, setSelected]
		);

		const isSelected = useCallback(
			({ key }: InternalItem): boolean => {
				if (isNil(selected)) {
					return false;
				}

				return key === itemKey(itemMap.to(selected));
			},
			[itemKey, itemMap, selected]
		);

		const onItemClick = useCallback((item: InternalItem) => onItemSelect?.(item), [
			onItemSelect
		]);

		const onClickButton = useCallback(() => setIsOpen(!isOpen), [isOpen]);

		const onClose = useCallback(() => setIsOpen(false), []);

		const content = useMemo(() => {
			return items.map((item, i) => (
				<ItemRenderer
					key={item.key}
					id={item.key}
					disabled={disabled}
					index={i}
					info={item.info}
					isSelected={isSelected(item)}
					name={item.name}
					onClick={onItemClick}
					value={item.value}
				/>
			));
		}, [disabled, isSelected, items, onItemClick]);

		return (
			<Popover
				classNameContent={clsx(classes.content, "uitk-select-content")}
				content={content}
				disabled={disabled}
				isOpen={isOpen}
				minimal={minimal}
				onClose={onClose}
				usePortal={usePortal}
			>
				<Button
					className={clsx(
						classes.root,
						{ [classes.selected]: !isNil(selected) },
						className,
						"uitk-select-button"
					)}
					disabled={disabled}
					onClick={onClickButton}
					text={isNil(selected) ? placeholder : itemName(itemMap.to(selected))}
				/>
			</Popover>
		);
	});

	component.displayName = "TypedSelect";

	return component;
};

interface IWithStaticExports {
	ofType: typeof ofType;
}

const _Select: FC<IProps<any>> = ofType<any>();
_Select.displayName = "Select";

(_Select as FC<IProps<any>> & IWithStaticExports).ofType = ofType;

export const Select = _Select as FC<IProps<any>> & IWithStaticExports;
