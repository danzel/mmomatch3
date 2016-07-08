/// <reference path="../../typings/mersenne-twister/mersenne-twister.d.ts" />
import MersenneTwister = require('mersenne-twister');

import HslToRgb = require('../Util/hslToRgb');
import MagicNumbers = require('../Simulation/magicNumbers');
import MatchableRenderer = require('./matchableRenderer');
import Simulation = require('../Simulation/simulation');
import Swap = require('../Simulation/swap');

class PlayerSprite {
	sprite: Phaser.Sprite;
	lastUpdate: number;

	constructor(parentGroup: Phaser.Group, private playerId: number, x: number, y: number) {
		this.sprite = parentGroup.game.add.sprite(x, y, 'atlas', 'player.png', parentGroup);
		this.sprite.anchor.set(0.5);

		let rand = new MersenneTwister(playerId);
		this.sprite.tint = HslToRgb(rand.random_excl() * 360, 1, 0.5);

		this.lastUpdate = this.sprite.game.time.now;
	}

	notifyPosition(x: number, y: number) {
		this.lastUpdate = this.sprite.game.time.now;
		let randX = (Math.random() - 0.5) * 20;
		let randY = (Math.random() - 0.5) * 20;
		this.sprite.game.add.tween(this.sprite)
			.to({ x: x + randX, y: y + randY }, 100, Phaser.Easing.Cubic.In)
			.start();
	}

	update() {
		this.sprite.alpha = Math.min(1, 1 - (this.sprite.game.time.now - this.lastUpdate - 5000) / 1000);
	}
}

class PlayersOnSimulation {
	group: Phaser.Group;
	playerSprites: { [playerId: number]: PlayerSprite } = {};

	constructor(simulation: Simulation, simulationGroup: Phaser.Group, private playerId: number) {
		//We are a child of simGroup so we get the scaling and stuff
		this.group = simulationGroup.game.add.group(simulationGroup);

		simulation.swapHandler.swapStarted.on((swap) => this.swapStarted(swap));
	}

	removeFromSimulationRendererGroup() {
		this.group.destroy();
	}

	private swapStarted(swap: Swap) {
		if (swap.playerId == this.playerId) {
			return;
		}

		//Sorta stolen from MatchableNode.updatePosition
		let x = (swap.left.x + swap.right.x) / 2 * MatchableRenderer.PositionScalar + (MatchableRenderer.PositionScalar / 2);
		let y = - (swap.left.y + swap.right.y) / 2 * MatchableRenderer.PositionScalar / MagicNumbers.matchableYScale - (MatchableRenderer.PositionScalar / 2);


		if (this.playerSprites[swap.playerId]) {
			this.playerSprites[swap.playerId].notifyPosition(x, y);

		} else {
			this.playerSprites[swap.playerId] = new PlayerSprite(this.group, swap.playerId, x, y);
		}
	}

	update() {
		for (let i in this.playerSprites) {
			this.playerSprites[i].update();
		}
	}
}

export = PlayersOnSimulation;