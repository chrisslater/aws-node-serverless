const path = require('path')
const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
	devtool: 'source-map',

	entry: slsw.lib.entries,
	// entry: './handler.ts',
	target: 'node',
	externals: [nodeExternals()],
	module: {
		loaders: [{
			test: /\.ts(x?)$/,
			loader: 'ts-loader'
		}]
	},
	// resolve: {
	// 	extensions: ['.ts', '.js', '.tsx', '.jsx', '']
	// },
	output: {
		devtoolModuleFilenameTemplate: '[absolute-resource-path]',
		devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',

		libraryTarget: 'commonjs',
		path: path.resolve(__dirname, '.webpack'),
		filename: 'handler.js',
	},
}