const flow = require("lodash.flow");
const path = require("path");
const webpackCraOverrides = require("./webpack-cra-overrides");

module.exports = {
	stories:  ["../src/**/*.stories.mdx"],
	addons: [
		{
			name: "@storybook/preset-create-react-app",
			options: {
				tsDocgenLoaderOptions: {
					tsconfigPath: path.resolve(__dirname, "../tsconfig.json")
				}
			}
		},
		"@storybook/addon-actions",
		"@storybook/addon-docs",
		"@storybook/addon-knobs"
	],
	webpackFinal: (config) => {
		const tmpConfig = flow.apply(null, webpackCraOverrides)(config);

		tmpConfig.node = { ...tmpConfig.node, fs: "empty" };
		tmpConfig.resolve.extensions.push(".mdx");

		return tmpConfig;
	}
};
