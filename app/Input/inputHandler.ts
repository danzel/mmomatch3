/// <reference path="../../typings/phaser/phaser.comments.d.ts" />
import InputApplier = require('../Simulation/inputApplier');
import MatchableNode = require('../Renderer/matchableNode');
import MatchDragHandler = require('./matchDragHandler');
import PointerStateTracker = require('./pointerStateTracker');
import Simulation = require('../Simulation/simulation');
import SimulationRenderer = require('../Renderer/simulationRenderer');
import XY = require('./xy');

interface IXY {
	x: number;
	y: number;
}

class InputHandler {
	private pointerStateTracker: PointerStateTracker;
	private matchDragHandler: MatchDragHandler;
	
	constructor(private game: Phaser.Game, private renderer: SimulationRenderer, simulation: Simulation, inputApplier: InputApplier) {
		this.pointerStateTracker = new PointerStateTracker(game, this);
		this.matchDragHandler = new MatchDragHandler(renderer, simulation.grid, inputApplier);
		
		this.game.input.mouse.mouseWheelCallback = this.mouseWheel.bind(this);
		
		inputApplier.failedToSwap.on((data) => {
			this.renderer.failedToSwap(data.matchable, data.direction);
		})
	}

	update(dt: number) {

	}

	private mouseWheel(event: MouseEvent) {
		this.renderer.zoomAt(event.clientX, event.clientY, (1 + 0.1 * this.game.input.mouse.wheelDelta));
	}

	mouseCallback(pointer: Phaser.Pointer, x: number, y: number, down: boolean) {

		//Hack code to cause matches anywhere you move the mouse
		//let index = (<any>this.matchDragHandler).findMatchableIndex(x, y);
		//if (index)
		//	(<InputApplier>(<any>this.matchDragHandler).inputApplier).swapMatchable(index.x, index.y, index.x + Math.round(Math.random() * 2 - 1), index.y + Math.round(Math.random() * 2 - 1)); 
		//return;

		//Movement drag handling
		if (pointer.middleButton.isDown && !down) {
			this.renderer.translate(pointer.movementX, pointer.movementY);
		}
		
		this.matchDragHandler.mouseMove(pointer, x, y, down, pointer.leftButton.isDown);
	}
	
	private previousPointer1Px: XY;
	private previousPointer2Px: XY;
	private touchBecameMulti: boolean;
	
	touchCallback(pointer: Phaser.Pointer, x: number, y: number, down: boolean) {
		
		if (this.game.input.pointer1.isDown && this.game.input.pointer2.isDown) {
			if (!this.touchBecameMulti)
				this.matchDragHandler.mouseCancel(this.game.input.pointer1);
			this.touchBecameMulti = true;
			
			if (this.previousPointer1Px) {

				let previousCenter = this.calculateCenter(this.previousPointer1Px, this.previousPointer2Px);
				let center = this.calculateCenter(this.game.input.pointer1, this.game.input.pointer2);
				
				//Translate
				this.renderer.translate(center.x - previousCenter.x, center.y - previousCenter.y);
				
				//Scale
				var previousDist = this.distanceBetween(this.previousPointer1Px, this.previousPointer2Px)
				var newDist = this.distanceBetween(this.game.input.pointer1, this.game.input.pointer2);
				
				var scaleChange = newDist / previousDist;
				this.renderer.zoomAt(center.x, center.y, scaleChange);
			}
			
			this.previousPointer1Px = new XY(this.game.input.pointer1.x, this.game.input.pointer1.y);
			this.previousPointer2Px = new XY(this.game.input.pointer2.x, this.game.input.pointer2.y);
		}
		else {
			delete this.previousPointer1Px;
			delete this.previousPointer2Px;
			
			//Swap drag
			if (!this.game.input.pointer1.isDown && !this.game.input.pointer2.isDown) {
				this.touchBecameMulti = false;
			}
			
			if (pointer == this.game.input.pointer1)
				this.matchDragHandler.mouseMove(pointer, x ,y, down, pointer.isDown);
		}
	}
	
	calculateCenter(a: IXY, b: IXY) : XY {
		return new XY((a.x + b.x) / 2, (a.y + b.y) / 2);
	}
	
	distanceBetween(a: IXY, b: IXY) : number {
		var x = a.x - b.x;
		var y = a.y - b.y;
		
		return Math.sqrt(x * x + y * y);
	}
}

export = InputHandler;