class GraphicsLoader {
	static loadBalls(game: Phaser.Game, spriteSet: string, count: number) {
		for (var i = 1; i <= count; i++) {
			game.load.image('ball_' + i, 'img/skin/' + spriteSet + '/balls/' + i + '.png');
		}
		
		game.load.image('overlay_horizontal', 'img/skin/' + spriteSet +'/balloverlays/horizontal.png');
		game.load.image('overlay_vertical', 'img/skin/' + spriteSet +'/balloverlays/vertical.png');

		game.load.image('ball_colorclear', 'img/skin/' + spriteSet +'/balls/11.png'); //TODO: UNHACK. Needs its own graphics
		
		game.load.image('player', 'img/skin/' + spriteSet +'/player.png');
		
	}
}

export = GraphicsLoader;