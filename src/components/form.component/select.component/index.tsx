import { Button } from "@/components/button.component";
import { FormGroup } from "@/components/form.component/form-group.component";
import { Popover } from "@/components/popover.component";
import { useUncontrolledProp } from "@/hooks";
import { isNil } from "@/utils";
import clsx from "clsx";
import React, {
	FC,
	memo,
	ReactElement,
	ReactNode,
	ReactText,
	SyntheticEvent,
	useCallback,
	useMemo,
	useState
} from "react";
import { Control, Controller } from "react-hook-form";
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
	control?: Control<any>;
	defaultSelected?: Maybe<T>;
	disabled?: boolean;
	error?: string | ReactElement;
	intent?: Intent;
	itemInfo?: (item: TOriginal) => ReactNode;
	itemKey?: (item: TOriginal) => ReactText;
	itemMap?: {
		from: (original: TOriginal) => T;
		to: (to: T) => TOriginal;
	};
	itemName?: (item: TOriginal) => ReactText;
	itemRenderer?: ItemRendererType<TOriginal>;
	items: readonly TOriginal[];
	label?: string;
	labelInfo?: string;
	minimal?: boolean;
	name?: string;
	onItemSelect?: (item: T, index: number, event?: SyntheticEvent<HTMLElement>) => void;
	placeholder?: string;
	selected?: Maybe<T>;
	usePortal?: boolean;
}

const ofType = <T extends unknown, TOriginal = T>() => {
	type InternalItem = ISelectItemType<TOriginal>;

	const BaseComponent: FC<IProps<T, TOriginal>> = memo((props) => {
		const {
			className,
			disabled,
			error,
			intent: _intent,
			itemInfo,
			itemKey = (value: TOriginal) => (value as any)?.key ?? String(value),
			itemMap = {
				from: (value: any) => value,
				to: (value: any) => value
			},
			itemName = (value: TOriginal) => (value as any)?.key ?? String(value),
			itemRenderer: ItemRenderer = _ItemRenderer,
			items: _items,
			label,
			labelInfo,
			minimal = true,
			onItemSelect: _onItemSelect,
			placeholder = "",
			selected: _selected,
			usePortal = false
		} = props;

		const intent: Intent = _intent ?? (error ? "danger" : "none");

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
			(item: InternalItem, index: number, event?: SyntheticEvent<HTMLElement>) => {
				const newSelected: T = itemMap.from(item.value);

				setIsOpen(false);
				setSelected(newSelected);
				_onItemSelect?.(newSelected, index, event);
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

		const onItemClick = useCallback(
			(item: InternalItem, index: number, event?: SyntheticEvent<HTMLElement>) => {
				onItemSelect?.(item, index, event);
			},
			[onItemSelect]
		);

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
			<FormGroup
				disabled={disabled}
				helperText={error}
				intent={intent}
				label={label}
				labelInfo={labelInfo}
			>
				<Popover
					classNameContent={clsx(classes.content, "uitk-select-content")}
					canOutsideClickClose={true}
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
			</FormGroup>
		);
	});

	BaseComponent.displayName = "BaseTypedSelect";

	const withController: typeof BaseComponent = (props) => {
		const {
			control,
			defaultSelected,
			name,
			onItemSelect: _onItemSelect,
			selected: _selected,
			...restProps
		} = props;

		if (control) {
			if (!name) {
				throw new Error("Select is used in a form without a name!");
			}

			return (
				<Controller
					control={control}
					name={name}
					defaultValue={defaultSelected}
					render={({ onChange, value }) => (
						<BaseComponent
							{...restProps}
							name={name}
							onItemSelect={(item, index, event) => {
								_onItemSelect?.(item, index, event);
								onChange(item);
							}}
							selected={value ?? null}
						/>
					)}
				/>
			);
		}

		return <BaseComponent {...props} />;
	};

	withController.displayName = "TypedSelect";

	return withController;
};

interface IWithStaticExports {
	ofType: typeof ofType;
}

const _Select: FC<IProps<any>> = ofType<any>();
_Select.displayName = "Select";

(_Select as FC<IProps<any>> & IWithStaticExports).ofType = ofType;

export const Select = _Select as FC<IProps<any>> & IWithStaticExports;
