var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HashPlugin = require('hash-webpack-plugin');

module.exports = {
	context: __dirname + path.sep + 'app',
	entry: './entry_client.ts',
	devtool: 'inline-source-map',
	output: {
		path: __dirname + path.sep + 'dist',
		filename: 'bundle.js'
	},
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
	module: {
		loaders: [
			{ test: /\.tsx?$/, loader: 'ts-loader' },
			{ test: /\.handlebars$/, loader: 'handlebars-loader' },
			{ test: /\.css$/, loader: ExtractTextPlugin.extract("css-loader") },
			{ test: /\.(woff(2)?)$/, loader : 'file-loader?name=[name].[ext]' },
			{ test: /.(png|svg)$/, loader : 'file-loader?name=[name].[ext]?[hash:6]' }
		]
	},
	plugins: [
		new ExtractTextPlugin("bundle.css"),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			hash: true,
			inject: false
		}),
		new HtmlWebpackPlugin({
			filename: 'index_mobile.html',
			template: 'index_mobile.html',
			hash: true,
			inject: false
		}),
		new HashPlugin({ path: './', fileName: 'hash.txt' })
	]
};
