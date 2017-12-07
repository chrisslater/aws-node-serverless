const path = require('path')
const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
	devtool: 'source-map',
	entry: slsw.lib.entries,
	target: 'node',
	externals: [nodeExternals()],
	module: {

		rules: [

			// {
			// 	test: /\.ts(x?)$/,
			// 	// loaders: ['babel-loader', 'ts-loader']
			// 	loader: 'ts-loader'
			// },

			{
				test: /\.js(x?)$/,
				loader: 'babel-loader',
				options: {
					presets: ['es2015']
				}
			},


		],

	},
	resolve: {
		extensions: [
			'.js',
			'.json',
			'.ts',
		],
		// modules: [
		// 	'node_modules',
		// path.resolve(__dirname, 'app')
		// ],
	},
	// output: {
	// 	devtoolModuleFilenameTemplate: '[absolute-resource-path]',
	// 	devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',

	// 	// library: true,
	// 	// libraryTarget: 'commonjs2',

	// 	path: path.resolve(__dirname, '.webpack'),
	// 	filename: '[name].js',
	// },
}