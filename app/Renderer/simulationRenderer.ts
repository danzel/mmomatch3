//import FailedToSwapAnimator = require('./failedToSwapAnimator');
import GetToBottomHighlighter = require('./getToBottomHighlighter');
import InputApplier = require('../Simulation/inputApplier');
import Simulation = require('../Simulation/simulation');
import Matchable = require('../Simulation/matchable');
import MatchableRenderer = require('./matchableRenderer');
import Type = require('../Simulation/type');

interface XY {
	x: number;
	y: number;
}

class SimulationRenderer {
	private matchablesGroup: Phaser.SpriteBatch;
	private getToBottomHighlighters = new Array<GetToBottomHighlighter>();
	//private failedToSwapAnimator = new FailedToSwapAnimator();

	private matchableRenderer: MatchableRenderer;
	
	constructor(private simulation: Simulation, private group: Phaser.Group) {
		this.matchablesGroup = group.game.add.spriteBatch(this.group);
		this.matchableRenderer = new MatchableRenderer(this.matchablesGroup);

		this.scale = 0.2;
		this.group.y = 400;

		this.addDebugOverlay();
	}

	fitToBounds(width: number, height: number) {
		this.scale = this.scaleClamp(Math.min(width / this.simulation.grid.width, height / this.simulation.grid.height) / MatchableRenderer.PositionScalar);

		let scaledWidth = this.scale * this.simulation.grid.width * MatchableRenderer.PositionScalar;
		let scaledHeight = this.scale * this.simulation.grid.height * MatchableRenderer.PositionScalar;

		this.group.x = (width - scaledWidth) / 2;
		this.group.y = height - (height - scaledHeight) / 2;
	}

	failedToSwap(matchable: Matchable, direction: XY) {
		if (matchable) {
			//TODO this.failedToSwapAnimator.failedToSwap(matchable, this.matchableNodes[matchable.id], direction);
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
		let maxOffscreenX = this.group.game.width / 2;
		let maxOffscreenY = this.group.game.height / 2;
		this.group.x = Math.min(this.group.game.width - maxOffscreenX, this.group.x);
		this.group.x = Math.max(this.group.x, -this.simulation.grid.width * MatchableRenderer.PositionScalar * this.scale + maxOffscreenX)

		this.group.y = Math.min(this.group.game.height + this.simulation.grid.height * MatchableRenderer.PositionScalar * this.scale - maxOffscreenY, this.group.y);
		this.group.y = Math.max(maxOffscreenY, this.group.y);
	}

	getPosition(): XY {
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

	private addDebugOverlay() {
		let graphics = this.group.game.add.graphics(0, 0, this.group);
		//graphics.beginFill(0x999999);
		graphics.lineStyle(3, 0xFFFFFF, 0.7);
		graphics.drawRect(0, 0, this.simulation.grid.width * MatchableRenderer.PositionScalar, -this.simulation.grid.height * MatchableRenderer.PositionScalar);
	}

	private left = [Phaser.Keyboard.LEFT, Phaser.Keyboard.A];
	private right = [Phaser.Keyboard.RIGHT, Phaser.Keyboard.D];
	private up = [Phaser.Keyboard.UP, Phaser.Keyboard.W];
	private down = [Phaser.Keyboard.DOWN, Phaser.Keyboard.S];

	private updateKeyboard(dt: number) {
		let keyboard = this.group.game.input.keyboard;
		let moveAmount = 1000 * dt;
		let anyKeyDown = false;
		
		if (this.left.some(k => keyboard.isDown(k))) {
			this.group.x += moveAmount;
			anyKeyDown = true;
		}
		if (this.right.some(k => keyboard.isDown(k))) {
			this.group.x -= moveAmount;
			anyKeyDown = true;
		}
		if (this.up.some(k => keyboard.isDown(k))) {
			this.group.y += moveAmount;
			anyKeyDown = true;
		}
		if (this.down.some(k => keyboard.isDown(k))) {
			this.group.y -= moveAmount;
			anyKeyDown = true;
		}
		
		if (anyKeyDown) {
			this.keepOnScreen();
		}
	}

	update(dt: number) {

		this.updateKeyboard(dt);

		for (let i = 0; i < this.getToBottomHighlighters.length; i++) {
			this.getToBottomHighlighters[i].update(dt);
		}
		
		this.matchableRenderer.begin();

		//First render those not swapping, then those swapping
		//Seperately because no good was to look up swaps in the swapHandler
		let cells = this.simulation.grid.cells;
		for (let x = 0; x < cells.length; x++) {
			let col = cells[x];
			for (let y = 0; y < col.length; y++) {
				let m = col[y];
				if (!m.beingSwapped) {
					this.matchableRenderer.render(m, null);
				}
			}
		}
		var swaps = this.simulation.swapHandler.swaps;
		for (let i = 0; i < swaps.length; i++) {
			var swap = swaps[i];

			this.matchableRenderer.render(this.simulation.grid.findMatchableById(swap.left.id), swap);
			this.matchableRenderer.render(this.simulation.grid.findMatchableById(swap.right.id), swap);
		}
		
		this.matchableRenderer.end();

		//TODO this.failedToSwapAnimator.update(dt);

	}

}

export = SimulationRenderer;