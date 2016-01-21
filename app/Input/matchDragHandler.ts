/// <reference path="../../typings/phaser/phaser.comments.d.ts" />
import Grid = require('../Simulation/grid');
import InputApplier = require('../Simulation/inputApplier');
import Matchable = require('../Simulation/matchable');
import MatchableNode = require('../Renderer/matchableNode');
import Simulation = require('../Simulation/simulation');
import SimulationRenderer = require('../Renderer/simulationRenderer');
import XY = require('./xy');

class MatchDragHandler {
	private renderer: SimulationRenderer;
	private grid: Grid;
	private inputApplier: InputApplier;
	
	private startDragPx: Array<XY>;
	private startDragMatchable: Array<XY>;
	
	constructor(renderer: SimulationRenderer, grid: Grid, inputApplier: InputApplier) {
		this.renderer = renderer;
		this.grid = grid;
		this.inputApplier = inputApplier;

		this.startDragPx = [null, null];
		this.startDragMatchable = [null, null];
	}
	
	private get minDragPx() {
		return this.renderer.getScale() * MatchableNode.PositionScalar / 2;	
	}
	

	mouseMove(pointer: Phaser.Pointer, x: number, y: number, justDown: boolean, held: boolean) {
		if (held && justDown) {
			let selected = this.findMatchableIndex(x, y)
			
			if (selected) {
				console.log(selected.x, selected.y);
				
				this.startDragPx[pointer.id] = new XY(x, y);
				this.startDragMatchable[pointer.id] = selected;
			}
		}
		else if (!held && this.startDragPx[pointer.id]) {
			
			let xDiff = x - this.startDragPx[pointer.id].x;
			let yDiff = y - this.startDragPx[pointer.id].y;
			
			//If there is a movement in just one direction
			if (Math.abs(xDiff) > this.minDragPx !== Math.abs(yDiff) > this.minDragPx) {
				let start = this.startDragMatchable[pointer.id];

				let left = this.grid.findMatchableAtPosition(start.x, start.y);
				let right: Matchable;
				if (Math.abs(xDiff) > this.minDragPx) {
					right = this.grid.findMatchableAtPosition(start.x + (xDiff > 0 ? 1 : -1), start.y);
				}
				else {
					right = this.grid.findMatchableAtPosition(start.x, start.y + (yDiff > 0 ? -1 : 1));
				}
				this.inputApplier.swapMatchable(left, right);
			}
			
			
			this.startDragPx[pointer.id] = null;
			this.startDragMatchable[pointer.id] = null;
		}
	}
	
	mouseCancel(pointer: Phaser.Pointer) {
		this.startDragPx[pointer.id] = null;
		this.startDragMatchable[pointer.id] = null;
	}

	private findMatchableIndex(x: number, y: number) : XY {
		let pos = this.renderer.getPosition();
		let scale = this.renderer.getScale();
		
		x = Math.floor((x - pos.x) / MatchableNode.PositionScalar / scale);
		y = Math.floor(-(y - pos.y) / MatchableNode.PositionScalar / scale);
		
		//Only return valid positions
		if (x < 0 || y < 0 || x >= this.grid.width || y >= this.grid.height) {
			return null;
		}

		return { x, y }; 
	}

}

export = MatchDragHandler;