import InputApplier = require('../Simulation/inputApplier');
import Simulation = require('../Simulation/simulation');
import Matchable = require('../Simulation/matchable');
import MatchableNode = require('./matchableNode');

const xOffset = MatchableNode.PositionScalar / 2;
const yOffset = MatchableNode.PositionScalar / 2;

interface IXY {
	x: number;
	y: number;
}

class SimulationRenderer {
	private matchablesGroup: Phaser.Group;

	private matchableNodes: { [id: number]: MatchableNode }

	constructor(private game: Phaser.Game, private simulation: Simulation, private group: Phaser.Group) {
		this.matchablesGroup = game.add.group(this.group);
		this.matchableNodes = {};

		this.matchablesGroup.x = xOffset;
		this.matchablesGroup.y = -yOffset;

		this.scale = 0.2;
		this.group.y = 400;

		this.addDebugOverlay();

		simulation.spawnManager.matchableSpawned.on(this.onMatchableSpawned.bind(this));
		simulation.disappearer.matchableDisappeared.on(this.onMatchableDisappeared.bind(this));
		
		//Populate initial matchables from what's on the grid currently
		for (let x = 0; x < this.simulation.grid.width; x++) {
			var col = this.simulation.grid.cells[x];
			for (var y = 0; y < col.length; y++) {
				this.onMatchableSpawned(col[y]);
			}
		}
		
	}

	failedToSwap(matchable: Matchable, direction: IXY)  {
		if (matchable) {
			this.matchableNodes[matchable.id].failedToSwap(direction);
		}
	}

	translate(x: number, y: number) {
		this.group.x += x;
		this.group.y += y;
	}
	
	//x and y are in screen pixels
	zoomAt(x: number, y: number, scaleMultiplier: number) {
		let ourScale = this.scale;
		let newScale = ourScale * scaleMultiplier;
		
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
	}
	
	private onMatchableDisappeared(matchable: Matchable) {
		this.matchableNodes[matchable.id].disappear();
		delete this.matchableNodes[matchable.id];
	}

	private addDebugOverlay() {
		let graphics = this.game.add.graphics(0, 0, this.group);
		//graphics.beginFill(0x999999);
		graphics.lineStyle(10, 0xFF0000, 1);
		graphics.drawRect(0, 0, this.simulation.grid.width * MatchableNode.PositionScalar, -this.simulation.grid.height * MatchableNode.PositionScalar);
	}

	update(dt: Number) {
		for (let key in this.matchableNodes) {
			var node = this.matchableNodes[key];

			node.updatePosition();
		}
		
		var swaps = this.simulation.swapHandler.swaps;
		for (let i = 0; i < swaps.length; i++) {
			var swap = swaps[i];
			
			this.matchableNodes[swap.left.id].updatePosition(swap);
			this.matchableNodes[swap.right.id].updatePosition(swap);
		}
	}

}

export = SimulationRenderer;