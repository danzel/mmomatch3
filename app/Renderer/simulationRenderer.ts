import GetToBottomHighlighter = require('./getToBottomHighlighter');
import InputApplier = require('../Simulation/inputApplier');
import Simulation = require('../Simulation/simulation');
import Matchable = require('../Simulation/matchable');
import MatchableNode = require('./matchableNode');
import Type = require('../Simulation/type');

interface IXY {
	x: number;
	y: number;
}

class SimulationRenderer {
	private matchablesGroup: Phaser.Group;
	private getToBottomHighlighter: GetToBottomHighlighter;

	private matchableNodes: { [id: number]: MatchableNode }

	constructor(private simulation: Simulation, private group: Phaser.Group) {
		this.matchablesGroup = group.game.add.spriteBatch(this.group);
		this.matchableNodes = {};

		this.scale = 0.2;
		this.group.y = 400;

		this.addDebugOverlay();

		simulation.spawnManager.matchableSpawned.on(matchable => this.onMatchableSpawned(matchable));
		simulation.disappearer.matchableDisappeared.on(matchable => this.onMatchableDisappeared(matchable));

		simulation.matchableTransformer.matchableTransforming.on(matchable => this.onMatchableTransforming(matchable));
		simulation.disappearer.matchableTransformed.on(matchable => this.onMatchableTransformed(matchable));

		//Populate initial matchables from what's on the grid currently
		for (let x = 0; x < this.simulation.grid.width; x++) {
			var col = this.simulation.grid.cells[x];
			for (var y = 0; y < col.length; y++) {
				this.onMatchableSpawned(col[y]);
			}
		}
	}

	fitToBounds(width: number, height: number) {
		this.scale = this.scaleClamp(Math.min(width / this.simulation.grid.width, height / this.simulation.grid.height) / MatchableNode.PositionScalar);

		let scaledWidth = this.scale * this.simulation.grid.width * MatchableNode.PositionScalar;
		let scaledHeight = this.scale * this.simulation.grid.height * MatchableNode.PositionScalar;

		this.group.x = (width - scaledWidth) / 2;
		this.group.y = height - (height - scaledHeight) / 2;
	}

	failedToSwap(matchable: Matchable, direction: IXY) {
		if (matchable) {
			this.matchableNodes[matchable.id].failedToSwap(direction);
		}
	}

	translate(x: number, y: number) {
		this.group.x += x;
		this.group.y += y;

		this.keepOnScreen();
	}

	//x and y are in screen pixels
	zoomAt(x: number, y: number, scaleMultiplier: number) {
		let ourScale = this.scale;
		let newScale = this.scaleClamp(ourScale * scaleMultiplier);

		//translate y in to be relative to our position
		x -= this.group.x;
		y -= this.group.y;

		//flip because maths
		x = -x;
		y = -y;

		//Work our the magic amount to move ourselves so the place where the mouse is stays where it is
		let diffX = x / ourScale * (newScale - ourScale);
		let diffY = y / ourScale * (newScale - ourScale);

		//Move by that amount
		this.group.x += diffX;
		this.group.y += diffY;

		//Update scale
		this.scale = newScale;

		this.keepOnScreen();
	}

	private scaleClamp(scale: number): number {
		return Math.min(1, Math.max(0.1, scale));
	}

	private keepOnScreen() {
		this.group.x = Math.min(this.group.game.width - 100, this.group.x);
		this.group.x = Math.max(this.group.x, -this.simulation.grid.width * MatchableNode.PositionScalar * this.scale + 100)

		this.group.y = Math.min(this.group.game.height + this.simulation.grid.height * MatchableNode.PositionScalar * this.scale - 100, this.group.y);
		this.group.y = Math.max(100, this.group.y);
	}

	getPosition(): IXY {
		return this.group;
	}

	getScale(): number {
		return this.group.scale.x;
	}

	private get scale(): number {
		return this.group.scale.x;
	}

	private set scale(scale: number) {
		this.group.scale = new Phaser.Point(scale, scale);
	}

	private onMatchableSpawned(matchable: Matchable) {
		this.matchableNodes[matchable.id] = new MatchableNode(matchable, this.matchablesGroup);

		if (matchable.type == Type.GetToBottom) {
			this.getToBottomHighlighter = new GetToBottomHighlighter(this.group, matchable);
		}
	}

	private onMatchableDisappeared(matchable: Matchable) {
		this.matchableNodes[matchable.id].disappear();
		delete this.matchableNodes[matchable.id];
	}

	private onMatchableTransforming(matchable: Matchable) {
		this.matchableNodes[matchable.id].updateForTransforming();
	}

	private onMatchableTransformed(matchable: Matchable) {
		this.matchableNodes[matchable.id].updateForTransformed();
	}

	private addDebugOverlay() {
		let graphics = this.group.game.add.graphics(0, 0, this.group);
		//graphics.beginFill(0x999999);
		graphics.lineStyle(3, 0xFFFFFF, 0.7);
		graphics.drawRect(0, 0, this.simulation.grid.width * MatchableNode.PositionScalar, -this.simulation.grid.height * MatchableNode.PositionScalar);
	}

	update(dt: number) {
		if (this.getToBottomHighlighter) {
			this.getToBottomHighlighter.update(dt);
		}

		//Optimised version of the commented out bit below
		let cells = this.simulation.grid.cells;
		for (let x = 0; x < cells.length; x++) {
			let col = cells[x];
			for (let y = 0; y < col.length; y++) {
				let m = col[y];
				this.matchableNodes[m.id].updatePosition();
			}
		}
		/*
		for (let key in this.matchableNodes) {
			var node = this.matchableNodes[key];
			node.updatePosition();
		}*/


		var swaps = this.simulation.swapHandler.swaps;
		for (let i = 0; i < swaps.length; i++) {
			var swap = swaps[i];

			this.matchableNodes[swap.left.id].updatePositionForSwap(swap);
			this.matchableNodes[swap.right.id].updatePositionForSwap(swap);
		}
	}

}

export = SimulationRenderer;