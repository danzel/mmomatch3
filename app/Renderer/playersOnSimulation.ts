import MatchableNode = require('./matchableNode');
import Simulation = require('../Simulation/simulation');
import Swap = require('../Simulation/swap');

class PlayerSprite {
	sprite: Phaser.Sprite;

	constructor(parentGroup: Phaser.Group, private playerId: number, x: number, y: number) {
		this.sprite = parentGroup.game.add.sprite(x, y, 'player', null, parentGroup);
		this.sprite.anchor.set(0.5);
		//TODO this.sprite.tint
	}
	
	notifyPosition(x: number, y: number) {
		this.sprite.game.add.tween(this.sprite)
			.to({ x: x, y: y}, 100)
			.start();
	}
}

class PlayersOnSimulation {
	group: Phaser.Group;
	playerSprites: {[playerId: number]: PlayerSprite } = {};
	
	constructor(simulation: Simulation, simulationGroup: Phaser.Group) {
		//We are a child of simGroup so we get the scaling and stuff
		this.group = simulationGroup.game.add.group(simulationGroup);
		
		simulation.swapHandler.swapStarted.on((swap) => this.swapStarted(swap));
	}
	
	private swapStarted(swap: Swap) {
		//TODO: Don't do anything if this is us doing the swap
		
		//Sorta stolen from MatchableNode.updatePosition
		let x = (swap.left.x + swap.right.x) / 2 * MatchableNode.PositionScalar + (MatchableNode.PositionScalar / 2);
		let y = - (swap.left.y + swap.right.y) / 2 * MatchableNode.PositionScalar - (MatchableNode.PositionScalar / 2);
		
		
		if (this.playerSprites[swap.playerId]) {
			 this.playerSprites[swap.playerId].notifyPosition(x, y);
			
 		} else {
			 this.playerSprites[swap.playerId] = new PlayerSprite(this.group, swap.playerId, x, y);
		 }
	}
}

export = PlayersOnSimulation;