import { Context, createContext } from "react";

export interface IListContextProps {
	interactable: boolean;
	sortable: boolean;
}

export const ListContext: Context<IListContextProps> = createContext<IListContextProps>({
	interactable: false,
	sortable: false
});
