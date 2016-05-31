var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	context: __dirname + path.sep + 'app',
	entry: './entry_solo.ts',
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
			{ test: /\.tsx?$/, loader: 'ts-loader' },
			{ test: /\.handlebars$/, loader: 'handlebars-loader' },
			{ test: /\.css$/, loader: ExtractTextPlugin.extract("css-loader") },
			{ test: /\.(woff(2)?)$/, loader : 'file-loader?name=[name].[ext]' }
		]
	},
	plugins: [
		new ExtractTextPlugin("bundle.css"),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: '../dist/index.template.html',
			hash: true,
			inject: false
		}),
	]
};
