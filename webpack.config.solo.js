var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');

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
			{ test: /\.json$/, loader: 'json' },
			{ test: /\.tsx?$/, loader: 'ts-loader' },
			{ test: /\.handlebars$/, loader: 'handlebars-loader' },
			{ test: /\.css$/, loader: ExtractTextPlugin.extract("css-loader") }
		]
	},
	plugins: [
		new ExtractTextPlugin("bundle.css")
	]
};
