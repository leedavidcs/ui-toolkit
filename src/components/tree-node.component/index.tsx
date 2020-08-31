import { useUncontrolledProp } from "@/hooks";
import clsx from "clsx";
import ms from "ms";
import React, {
	Children,
	cloneElement,
	DetailedHTMLProps,
	FC,
	HTMLAttributes,
	isValidElement,
	MouseEvent,
	ReactChild,
	ReactNode,
	useCallback
} from "react";
import AnimateHeight from "react-animate-height";
import classes from "./styles.module.scss";

interface IProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	children?: ReactNode;
	className?: string;
	isOpen?: boolean;
	label: ReactChild;
}

export const TreeNode: FC<IProps> = ({
	children,
	className,
	isOpen: _isOpen,
	label,
	onClick: _onClick,
	...restDivProps
}) => {
	const [isOpen, setIsOpen] = useUncontrolledProp(_isOpen, false);

	const renderChild = useCallback((child: ReactNode, i: number) => {
		if (!isValidElement(child) || child.type !== TreeNode) {
			throw new Error("Children must be a node-array of tree nodes");
		}

		return (
			<li className={clsx(classes.child, "uitk-tree-node-child")}>
				{cloneElement(child, { key: `${i}_${child.props.label}` })}
			</li>
		);
	}, []);

	const onToggle = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
			_onClick?.(event);
			setIsOpen((lastIsOpen) => !lastIsOpen);
		},
		[_onClick, setIsOpen]
	);

	return (
		<div
			className={clsx(
				className,
				{
					[classes.isOpen]: isOpen,
					[classes.withChildren]: children
				},
				`uitk-tree-node`
			)}
		>
			<div
				className={clsx(classes.label, "uitk-tree-node-label")}
				onClick={onToggle}
				{...restDivProps}
			>
				<div className={clsx(classes.arrow, "uitk-tree-node-arrow")} />
				{label}
			</div>
			{children && (
				<AnimateHeight duration={ms("0.15s")} height={isOpen ? "auto" : "0"}>
					<ul className={clsx(classes.list, "uitk-tree-node-list")}>
						{Children.map(children, renderChild)}
					</ul>
				</AnimateHeight>
			)}
		</div>
	);
};
