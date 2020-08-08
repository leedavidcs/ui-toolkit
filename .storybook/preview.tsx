import addons from "@storybook/addons";
import { addDecorator, addParameters } from "@storybook/react";
import "../src/app.scss";
import { withJss, withStripe } from "../src/storybook";

const alphabeticSort = (a, b) => {
	const isSameKind: boolean = a[1].kind === b[1].kind;

	if (isSameKind) {
		return false;
	}

	const compared: boolean = a[1].id.localeCompare(b[1].id, undefined, { numeric: true });

	return compared;
};

addons.setConfig({
	showRoots: true
});

addParameters({
	options: {
		storySort: alphabeticSort
	}
});

addDecorator(withJss);
addDecorator(withStripe);
