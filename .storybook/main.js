const flow = require("lodash.flow");
const path = require("path");
const webpackCraOverrides = require("./webpack-cra-overrides");

module.exports = {
	stories: [
		"../src/**/*.stories.@(tsx|mdx)",
		"../src/**/stories/index.@(tsx|mdx)",
		"../src/**/stories/*.stories/index.@(tsx|mdx)"
	],
	addons: [
		"@storybook/addon-essentials",
		"@storybook/addon-knobs",
		"@storybook/addon-storysource",
		{
			name: "@storybook/preset-create-react-app",
			options: {
				tsDocgenLoaderOptions: {
					tsconfigPath: path.resolve(__dirname, "../tsconfig.json")
				}
			}
		}
	],
	webpackFinal: (config) => {
		const tmpConfig = flow.apply(null, webpackCraOverrides)(config);

		tmpConfig.node = { ...tmpConfig.node, fs: "empty" };
		tmpConfig.resolve.extensions.push(".mdx");

		return tmpConfig;
	}
};
