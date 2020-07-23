import React, { Children, FC, ReactNode, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";

const DEFAULT_TRANSITION_DURATION = 300;

interface IProps {
	className?: string;
	isOpen?: boolean;
	transitionDuration?: number;
	transitions: CSSTransitionClassNames;
	usePortal?: boolean;
}

export const Overlay: FC<IProps> = (props) => {
	const {
		children,
		className,
		isOpen = true,
		transitionDuration = DEFAULT_TRANSITION_DURATION,
		transitions,
		usePortal = true
	} = props;

	const renderChildWithTransition = useCallback(
		(child: ReactNode) => (
			<CSSTransition classNames={transitions} in={isOpen} timeout={transitionDuration}>
				{child}
			</CSSTransition>
		),
		[isOpen, transitionDuration, transitions]
	);

	const transitionContainer = useMemo(
		() => (
			<TransitionGroup appear={true} className={className} component="div">
				{Children.map(children ?? [], renderChildWithTransition)}
			</TransitionGroup>
		),
		[children, className, renderChildWithTransition]
	);

	return usePortal ? createPortal(transitionContainer, document.body) : transitionContainer;
};
