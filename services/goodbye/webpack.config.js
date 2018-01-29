const path = require('path')
const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
	devtool: 'source-map',
	entry: slsw.lib.entries,
	target: 'node',
	module: {
		rules: [{
			test: /\.ts(x?)$/,
			loader: 'ts-loader'
		}, ],
	},
	resolve: {
		extensions: [
			'.js',
			'.json',
			'.ts',
		],
	},
}