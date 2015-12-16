/// <reference path="../node_modules/phaser/typescript/phaser.comments.d.ts" />


class AppEntry {
	game: Phaser.Game;
	
	constructor(){
		this.game = new Phaser.Game(800, 600, Phaser.AUTO, null, this, false, true, null);
	}
	
	preload(){
		console.log("preload");
		this.game.load.image('ball_1', 'img/balls/blue.png');
		this.game.load.image('ball_2', 'img/balls/green.png');
		this.game.load.image('ball_3', 'img/balls/red.png');
		this.game.load.image('ball_4', 'img/balls/yellow.png');
	}
	
	update(){
	}
}

new AppEntry();