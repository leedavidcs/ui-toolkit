import { Context, createContext, ReactElement } from "react";

export interface IModalContextProps {
	active: boolean;
	setContent: (content: { title: string; body: ReactElement } | null) => void;
	toggle: (force?: boolean) => void;
}

export const ModalContext: Context<IModalContextProps> = createContext<IModalContextProps>({
	active: false,
	setContent: () => undefined,
	toggle: () => undefined
});

ModalContext.displayName = "ModalContext";
