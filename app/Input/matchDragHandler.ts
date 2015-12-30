/// <reference path="../../node_modules/phaser/typescript/phaser.comments.d.ts" />
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

class MatchDragHandler {
	private renderer: SimulationRenderer;
	private simulation: Simulation;
	
	private startDragPx: XY;
	private startDragMatchable: XY;
	
	private minDragPx = MatchableNode.PositionScalar / 2;
	
	//TODO: On touch we'll need to interact with multitouch to stop matching while multitouching

	constructor(renderer: SimulationRenderer, simulation: Simulation) {
		this.renderer = renderer;
		this.simulation = simulation;
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
					//TODO: X
					console.log('todo: x');
				}
				else {
					//TODO: Y
					console.log('todo: y');
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
		if (x < 0 || y < 0 || x >= this.simulation.grid.width || y >= this.simulation.grid.height) {
			return null;
		}

		return { x, y }; 
	}

}

export = MatchDragHandler;