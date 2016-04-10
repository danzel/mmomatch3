class GraphicsLoader {
	static loadBalls(game: Phaser.Game, spriteSet: string, count: number) {
		game.load.atlasJSONHash('atlas', 'img/skin/' + spriteSet + '.png', 'img/skin/' + spriteSet + '.json');
	}
}

export = GraphicsLoader;