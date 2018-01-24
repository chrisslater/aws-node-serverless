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

			{
				test: /\.ts(x?)$/,
				loader: 'ts-loader'
			},

			// {
			// 	test: /\.js(x?)$/,
			// 	loader: 'babel-loader',
			// 	options: {
			// 		presets: ['es2015']
			// 	},
			// },

		],
	},
	resolve: {
		extensions: [
			'.js',
			'.json',
			'.ts',
		],
	},
}