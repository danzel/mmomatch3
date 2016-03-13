var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	context: __dirname + path.sep + 'app',
	entry: './entry_client.ts',
	devtool: 'inline-source-map',
	output: {
		path: __dirname + path.sep + 'dist',
		filename: 'bundle.js'
	},
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
	module: {
		loaders: [
			{ test: /\.json$/, loader: 'json' },
			{ test: /\.tsx?$/, loader: 'ts-loader' }
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: '../dist/index.template.html',
			hash: true,
			inject: false
		})
	]
};
