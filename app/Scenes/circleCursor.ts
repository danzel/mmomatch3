/// <reference path="../../typings/mersenne-twister/mersenne-twister.d.ts" />
import MersenneTwister = require('mersenne-twister');

import HslToRgb = require('../Util/hslToRgb');

class CircleCursor {
	static setCursor(game: Phaser.Game, playerId: number): void {

		//Stolen from playersOnSimulation
		let rand = new MersenneTwister(playerId);
		let color = HslToRgb(rand.random_excl() * 360, 1, 0.5);
		
		let colorStr = color.toString(16);
		while (colorStr.length < 6) {
			colorStr = '0' + colorStr;
		}
		
		let size = 28;
		let strokeWidth = 6;

		let canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		
		let ctx = canvas.getContext('2d');
		
		ctx.lineWidth = strokeWidth;
		ctx.strokeStyle = 'black'
        ctx.fillStyle = '#' + colorStr;
		console.log('fill', ctx.fillStyle)
		
		ctx.beginPath();
		ctx.arc(size / 2, size / 2, (size - strokeWidth) / 2, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fill();
		
		let content = canvas.toDataURL();
		
		game.canvas.style.cursor = 'url(' + content + ') ' + (size / 2) + ' ' + (size / 2) + ', auto';
	}
}

export = CircleCursor;