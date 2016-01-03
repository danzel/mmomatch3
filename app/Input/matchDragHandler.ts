/// <reference path="../../typings/phaser/phaser.comments.d.ts" />
import IInputApplier = require('../Simulation/iInputApplier');
import MatchableNode = require('../Renderer/matchableNode');
import Simulation = require('../Simulation/simulation');
import SimulationRenderer = require('../Renderer/simulationRenderer');
import XY = require('./xy');

interface ISize {
	width: number;
	height: number;
}

class MatchDragHandler {
	private renderer: SimulationRenderer;
	private gridSize: ISize;
	private inputApplier: IInputApplier;
	
	private startDragPx: Array<XY>;
	private startDragMatchable: Array<XY>;
	
	constructor(renderer: SimulationRenderer, gridSize: ISize, inputApplier: IInputApplier) {
		this.renderer = renderer;
		this.gridSize = gridSize;
		this.inputApplier = inputApplier;

		this.startDragPx = [null, null];
		this.startDragMatchable = [null, null];
	}
	
	private get minDragPx() {
		return this.renderer.getScale() * MatchableNode.PositionScalar / 2;	
	}
	

	mouseMove(pointer: Phaser.Pointer, x: number, y: number, justDown: boolean, held: boolean) {
		if (held && justDown) {
			var selected = this.findMatchableIndex(x, y)
			
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
				var start = this.startDragMatchable[pointer.id];
				if (Math.abs(xDiff) > this.minDragPx) {
					this.inputApplier.swapMatchable(start.x, start.y, start.x + (xDiff > 0 ? 1 : -1), start.y);
				}
				else {
					this.inputApplier.swapMatchable(start.x, start.y, start.x, start.y + (yDiff > 0 ? -1 : 1));
				}
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
		if (x < 0 || y < 0 || x >= this.gridSize.width || y >= this.gridSize.height) {
			return null;
		}

		return { x, y }; 
	}

}

export = MatchDragHandler;