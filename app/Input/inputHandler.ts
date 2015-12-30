/// <reference path="../../node_modules/phaser/typescript/phaser.comments.d.ts" />
import IInputApplier = require('../Simulation/iInputApplier');
import MatchableNode = require('../Renderer/matchableNode');
import MatchDragHandler = require('./matchDragHandler');
import PointerStateTracker = require('./pointerStateTracker');
import Simulation = require('../Simulation/simulation');
import SimulationRenderer = require('../Renderer/simulationRenderer');

class InputHandler {
	private game: Phaser.Game;
	private renderer: SimulationRenderer;
	private pointerStateTracker: PointerStateTracker;
	private matchDragHandler: MatchDragHandler;
	
	constructor(game: Phaser.Game, renderer: SimulationRenderer, simulation: Simulation, inputApplier: IInputApplier) {
		this.game = game;
		this.renderer = renderer;
		this.pointerStateTracker = new PointerStateTracker(game);
		this.matchDragHandler = new MatchDragHandler(renderer, simulation.grid, inputApplier);
		
		this.game.input.mouse.mouseWheelCallback = this.mouseWheel.bind(this);
		this.pointerStateTracker.moveCallback = this.mouseMove.bind(this);
		//TODO: Touch Zoom and movement
	}

	update(dt: number) {

	}

	private mouseWheel(event: MouseEvent) {
		this.renderer.zoomAt(event.clientX, event.clientY, this.game.input.mouse.wheelDelta);
	}

	private mouseMove(pointer: Phaser.Pointer, x: number, y: number, down: Boolean) {
		
		//Movement drag handling
		if (pointer.middleButton.isDown && !down) {
			this.renderer.translate(pointer.movementX, pointer.movementY);
		}
		
		this.matchDragHandler.mouseMove(pointer, x, y, down);
		
	}
}

export = InputHandler;