/// <reference path="../../node_modules/phaser/typescript/phaser.comments.d.ts" />
import SimulationRenderer = require('../Renderer/simulationRenderer');
import PointerStateTracker = require('./pointerStateTracker');

class InputHandler {
	private game: Phaser.Game;
	private renderer: SimulationRenderer;
	private pointerStateTracker: PointerStateTracker;
	
	constructor(game: Phaser.Game, renderer: SimulationRenderer) {
		this.game = game;
		this.renderer = renderer;
		this.pointerStateTracker = new PointerStateTracker(game);

		this.game.input.mouse.mouseWheelCallback = this.mouseWheel.bind(this);
		this.pointerStateTracker.moveCallback = this.mouseMove.bind(this);
	}

	update(dt: number) {

	}

	private mouseWheel(event: MouseEvent) {
		this.renderer.zoomAt(event.clientX, event.clientY, this.game.input.mouse.wheelDelta);
	}

	private mouseMove(pointer: Phaser.Pointer, x: number, y: number, down: Boolean) {
		//console.log([pointer, x, y, down]);
		//console.log(this.renderer.position.x, this.renderer.position.y);
		
		if (pointer.middleButton.isDown && !down) {
			//console.log(pointer.movementX, pointer.movementY);
			this.renderer.translate(pointer.movementX, pointer.movementY);
		}
	}
}

export = InputHandler;