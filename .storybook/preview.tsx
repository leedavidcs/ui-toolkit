import { addDecorator, addParameters, configure } from "@storybook/react";
import "../src/app.scss";
import { withStripe } from "../src/storybook";

const alphabeticSort = (a, b) => {
	const isSameKind: boolean = a[1].kind === b[1].kind;

	if (isSameKind) {
		return false;
	}

	const compared: boolean = a[1].id.localeCompare(b[1].id, undefined, { numeric: true });

	return compared;
};

addParameters({
	options: {
		showRoots: true,
		storySort: alphabeticSort
	}
});

addDecorator(withStripe);

configure(require.context("../src", true, /\.?stories(\/index)?\.mdx$/), module);
