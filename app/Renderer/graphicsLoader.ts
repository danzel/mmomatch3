class GraphicsLoader {
	static loadBalls(game: Phaser.Game, spriteSet: string, count: number) {
		for (var i = 1; i <= count; i++) {
			game.load.image('ball_' + i, 'img/skin/' + spriteSet + '/balls/' + i + '.png');

		}
	}
}

export = GraphicsLoader;