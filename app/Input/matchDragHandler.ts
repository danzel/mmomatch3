import Grid = require('../Simulation/grid');
import InputApplier = require('../Simulation/inputApplier');
import Matchable = require('../Simulation/matchable');
import MatchableRenderer = require('../Renderer/matchableRenderer');
import Simulation = require('../Simulation/simulation');
import SimulationRenderer = require('../Renderer/simulationRenderer');
import XY = require('./xy');

class MatchDragHandler {
	private startDragMatchable: Array<XY>;

	constructor(private renderer: SimulationRenderer, private grid: Grid, private inputApplier: InputApplier) {
		this.startDragMatchable = [null, null];
	}

	private get minDragPx() {
		return this.renderer.getScale() * MatchableRenderer.PositionScalar / 4;
	}

	mouseDown(pointer: Phaser.Pointer) {
		let selected = this.findMatchableIndex(pointer.x, pointer.y)

		if (selected) {
			console.log(selected.x, selected.y);

			this.startDragMatchable[pointer.id] = selected;
		}
	}

	mouseMove(pointer: Phaser.Pointer) {
		if (this.startDragMatchable[pointer.id]) {

			let xDiff = pointer.movementX;
			let yDiff = pointer.movementY;
			
			//If there is a movement in just one direction
			if (Math.abs(xDiff) > this.minDragPx !== Math.abs(yDiff) > this.minDragPx) {
				let start = this.startDragMatchable[pointer.id];

				let horizontal = Math.abs(xDiff) > this.minDragPx;
				let left = this.grid.findMatchableAtPosition(start.x, start.y);
				let right: Matchable;
				if (horizontal) {
					right = this.grid.findMatchableAtPosition(start.x + (xDiff > 0 ? 1 : -1), start.y);
				}
				else {
					right = this.grid.findMatchableAtPosition(start.x, start.y + (yDiff > 0 ? -1 : 1));
				}
				let dir = { x: horizontal ? (xDiff > 0 ? 1 : -1) : 0, y: !horizontal ? (yDiff > 0 ? -1 : 1) : 0}
				this.inputApplier.swapMatchable(left, right, dir);

				this.mouseUp(pointer);
			}
		}
	}

	mouseUp(pointer: Phaser.Pointer) {
		this.startDragMatchable[pointer.id] = null;
	}

	private findMatchableIndex(x: number, y: number): XY {
		let pos = this.renderer.getPosition();
		let scale = this.renderer.getScale();

		x = Math.floor((x - pos.x) / MatchableRenderer.PositionScalar / scale);
		y = Math.floor(-(y - pos.y) / MatchableRenderer.PositionScalar / scale);
		
		//Only return valid positions
		if (x < 0 || y < 0 || x >= this.grid.width || y >= this.grid.height) {
			return null;
		}

		return { x, y };
	}

}

export = MatchDragHandler;