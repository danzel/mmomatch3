/// <reference path="../../node_modules/phaser/typescript/phaser.comments.d.ts" />
import IInputApplier = require('../Simulation/iInputApplier');
import MatchableNode = require('../Renderer/matchableNode');
import Simulation = require('../Simulation/simulation');
import SimulationRenderer = require('../Renderer/simulationRenderer');

class XY {
	x: number;
	y: number;
	
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
};

interface ISize {
	width: number;
	height: number;
}

class MatchDragHandler {
	private renderer: SimulationRenderer;
	private gridSize: ISize;
	private inputApplier: IInputApplier;
	
	private startDragPx: XY;
	private startDragMatchable: XY;
	
	private minDragPx = MatchableNode.PositionScalar / 2;
	
	//TODO: On touch we'll need to interact with multitouch to stop matching while multitouching

	constructor(renderer: SimulationRenderer, gridSize: ISize, inputApplier: IInputApplier) {
		this.renderer = renderer;
		this.gridSize = gridSize;
		this.inputApplier = inputApplier;
	}

	mouseMove(pointer: Phaser.Pointer, x: number, y: number, down: Boolean) {
		if (pointer.leftButton.isDown && down) {
			var selected = this.findMatchableIndex(pointer.clientX, pointer.clientY)
			
			if (selected) {
				console.log(selected.x, selected.y);
				
				this.startDragPx = new XY(x, y);
				this.startDragMatchable = selected;
			}
		}
		else if (!pointer.leftButton.isDown && this.startDragPx) {
			
			let xDiff = x - this.startDragPx.x;
			let yDiff = y - this.startDragPx.y;
			
			//If there is a movement in just one direction
			if (Math.abs(xDiff) > this.minDragPx !== Math.abs(yDiff) > this.minDragPx) {
				if (Math.abs(xDiff) > this.minDragPx) {
					this.inputApplier.swapMatchable(this.startDragMatchable.x, this.startDragMatchable.y, this.startDragMatchable.x + (xDiff > 0 ? 1 : -1), this.startDragMatchable.y);
				}
				else {
					this.inputApplier.swapMatchable(this.startDragMatchable.x, this.startDragMatchable.y, this.startDragMatchable.x, this.startDragMatchable.y + (yDiff > 0 ? -1 : 1));
				}
			}
			
			
			this.startDragPx = null;
			this.startDragMatchable = null;
		}
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