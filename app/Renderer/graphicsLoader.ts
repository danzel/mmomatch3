declare function require(filename: string): string;
var json = require('file?name=atlas.json?[hash:6]!../../img/skin/emojione-animals.json');
var png = require('file?name=atlas.png?[hash:6]!../../img/skin/emojione-animals.png');

class GraphicsLoader {
	static load(game: Phaser.Game) {
		game.load.atlasJSONHash('atlas', png, json);
	}
}

export = GraphicsLoader;