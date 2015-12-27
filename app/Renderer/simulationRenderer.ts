/// <reference path="../../node_modules/phaser/typescript/phaser.comments.d.ts" />
import Simulation = require('../Simulation/simulation');
import Matchable = require('../Simulation/matchable');
import MatchableNode = require('./matchableNode');

const xOffset = MatchableNode.PositionScalar / 2;
const yOffset = 500 + MatchableNode.PositionScalar / 2;

class SimulationRenderer {
	private game: Phaser.Game;
	private simulation: Simulation;
	private group: Phaser.Group;
	private matchablesGroup: Phaser.Group;

	private matchableNodes: { [id: number]: MatchableNode }

	constructor(game: Phaser.Game, simulation: Simulation, group: Phaser.Group) {
		this.game = game;
		this.simulation = simulation;
		this.group = group;
		this.matchablesGroup = game.add.group(this.group);
		this.matchableNodes = {};

		this.matchablesGroup.x = xOffset;
		this.matchablesGroup.y = yOffset;
		
		this.group.scale = new Phaser.Point(0.2, 0.2);
		this.group.y = 400;

		this.addDebugOverlay();

		simulation.spawnManager.matchableSpawned.on(this.onMatchableSpawned.bind(this));
	}

	private onMatchableSpawned(matchable: Matchable) {
		this.matchableNodes[matchable.id] = new MatchableNode(matchable, this.matchablesGroup);
	}

	private addDebugOverlay() {
		let graphics = this.game.add.graphics(0,0,this.group);
		//graphics.beginFill(0x999999);
		graphics.lineStyle(10, 0xFF0000, 1);
		graphics.drawRect(0, yOffset + MatchableNode.PositionScalar / 2, this.simulation.grid.width * MatchableNode.PositionScalar, -this.simulation.grid.height * MatchableNode.PositionScalar);
	}

	update(dt: Number) {
		for (let key in this.matchableNodes) {
			var node = this.matchableNodes[key];
			
			node.updatePosition();
		}
	}

}

export = SimulationRenderer;