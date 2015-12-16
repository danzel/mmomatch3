var path = require('path');
module.exports = {
	context: __dirname + path.sep + 'app',
	entry: './entry_web.ts',
	output: {
		path: __dirname + path.sep + 'dist',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{ test: /\.json$/, loader: 'json' },
			{ test: /\.ts$/, loader: 'ts-loader' }
		]
	}
};
