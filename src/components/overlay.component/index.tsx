import clsx from "clsx";
import React, {
	Children,
	cloneElement,
	FC,
	isValidElement,
	ReactNode,
	useCallback,
	useMemo
} from "react";
import { createPortal } from "react-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";
import backdropTranistions from "./backdrop-transitions.module.scss";
import classes from "./styles.module.scss";

const DEFAULT_TRANSITION_DURATION = 300;

const backdropTransitionDuration: TransitionTimeout = {
	enter: 300,
	exit: 100
};

type TransitionTimeout = number | { appear?: number; enter?: number; exit?: number };

interface IProps {
	className?: string;
	hasBackdrop?: boolean;
	isOpen: boolean;
	transitionDuration?: TransitionTimeout;
	transitions: CSSTransitionClassNames;
	usePortal?: boolean;
}

export const Overlay: FC<IProps> = (props) => {
	const {
		children,
		className,
		hasBackdrop = true,
		isOpen = true,
		transitionDuration = DEFAULT_TRANSITION_DURATION,
		transitions,
		usePortal = true
	} = props;

	const backdrop = useMemo(
		() =>
			hasBackdrop && isOpen ? (
				<CSSTransition
					classNames={backdropTranistions}
					timeout={backdropTransitionDuration}
				>
					<div className={classes.backdrop} tabIndex={0} />
				</CSSTransition>
			) : null,
		[hasBackdrop, isOpen]
	);

	const renderChildWithTransition = useCallback(
		(child: ReactNode) => (
			<CSSTransition classNames={transitions} in={isOpen} timeout={transitionDuration}>
				{isValidElement(child) ? (
					cloneElement(child, {
						className: clsx(classes.content, child.props.className),
						tabIndex: 0
					})
				) : (
					<span className={classes.content}>{child}</span>
				)}
			</CSSTransition>
		),
		[isOpen, transitionDuration, transitions]
	);

	const childrenWithTransitions = useMemo(() => {
		return isOpen ? Children.map(children ?? [], renderChildWithTransition) : [];
	}, [children, isOpen, renderChildWithTransition]);

	const transitionContainer = useMemo(
		() => (
			<TransitionGroup appear={true} className={className} component="div">
				{[backdrop, ...childrenWithTransitions]}
			</TransitionGroup>
		),
		[backdrop, childrenWithTransitions, className]
	);

	return usePortal ? createPortal(transitionContainer, document.body) : transitionContainer;
};
