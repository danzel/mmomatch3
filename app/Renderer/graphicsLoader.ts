declare function require(filename: string): string;
var json = require('file-loader?name=atlas.json?[hash:6]!../../img/game.json');
var png = require('file-loader?name=atlas.png?[hash:6]!../../img/game.png');

class GraphicsLoader {
	static load(game: Phaser.Game) {
		game.load.atlasJSONHash('atlas', png, json);
	}
}

export = GraphicsLoader;