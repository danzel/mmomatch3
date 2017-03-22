import InputApplier = require('../Simulation/inputApplier');
import MatchDragHandler = require('./matchDragHandler');
import Simulation = require('../Simulation/simulation');
import SimulationRenderer = require('../Renderer/simulationRenderer');
import TouchCatchAll = require('../Renderer/Components/touchCatchAll');
import XY = require('./xy');

interface IXY {
	x: number;
	y: number;
}

class InputHandler {
	private touchCatchAll: TouchCatchAll;
	private matchDragHandler: MatchDragHandler;

	private activeTouches: number = 0;
	private touchBecameMulti: boolean = false;

	private singleTouchHeldTime = 0;
	singleTouchPointer: Phaser.Pointer = null;

	constructor(private group: Phaser.Group, private renderer: SimulationRenderer, simulation: Simulation, inputApplier: InputApplier) {
		this.touchCatchAll = new TouchCatchAll(group.game);
		group.add(this.touchCatchAll.sprite);

		group.game.input.mouse.capture = true;
		document.body.oncontextmenu = function () { return false; };

		this.touchCatchAll.pointerDown.on((data) => this.pointerDown(data));
		this.touchCatchAll.pointerMove.on((data) => this.pointerMove(data));
		this.touchCatchAll.pointerUp.on((data) => this.pointerUp(data));

		this.matchDragHandler = new MatchDragHandler(renderer, simulation.grid, inputApplier);

		this.group.game.input.mouse.mouseWheelCallback = this.mouseWheel.bind(this);

		inputApplier.failedToSwap.on((data) => {
			this.renderer.failedToSwap(data.matchable, data.direction);
		})
	}

	get singleTouchDragIsActive(): boolean {
		return this.singleTouchPointer != null && this.activeTouches == 1 && !this.touchBecameMulti && this.singleTouchHeldTime >= 0.5;
	}

	//TODO: This should be in the renderer instead
	update(): void {
		if (this.activeTouches == 1 && !this.touchBecameMulti) {
			this.singleTouchHeldTime+= this.group.game.time.physicsElapsed;
		} else {
			this.singleTouchHeldTime = 0;
		}
	}

	private mouseWheel(event: MouseEvent) {
		this.renderer.zoomAt(event.clientX, event.clientY, (1 + 0.1 * this.group.game.input.mouse.wheelDelta));
	}

	private pointerDown(pointer: Phaser.Pointer) {
		if (pointer.pointerMode != Phaser.PointerMode.CURSOR) {
			this.activeTouches++;
			if (this.activeTouches >= 2 && !this.touchBecameMulti) {
				this.matchDragHandler.mouseUp(this.group.game.input.pointer1);
				this.touchBecameMulti = true;
			}
		}

		if (!this.touchBecameMulti) {
			this.matchDragHandler.mouseDown(pointer);
		}

		this.singleTouchPointer = pointer;
	}

	private pointerMove(pointer: Phaser.Pointer) {
		if (pointer.middleButton.isDown || pointer.rightButton.isDown) {
			this.renderer.translate(pointer.rawMovementX, pointer.rawMovementY);
		} else {
			if (this.touchBecameMulti) {
				this.multitouch(pointer);
			}
			else {
				if (this.singleTouchDragIsActive) {
					this.renderer.translate(pointer.rawMovementX, pointer.rawMovementY);
				} else {
					this.matchDragHandler.mouseMove(pointer);
				}
			}
		}
	}

	private pointerUp(pointer: Phaser.Pointer) {
		this.matchDragHandler.mouseUp(pointer);
		if (pointer.pointerMode != Phaser.PointerMode.CURSOR) {
			this.activeTouches--;
			if (this.activeTouches == 0) {
				this.touchBecameMulti = false;
			}
		}

		this.singleTouchPointer = null;
	}

	private multitouch(pointer: Phaser.Pointer) {
		if (this.activeTouches == 2 && (pointer.movementX || pointer.movementY)) {
			let previousCenter = this.calculatePreviousCenter(this.group.game.input.pointer1, this.group.game.input.pointer2);
			let center = this.calculateCenter(this.group.game.input.pointer1, this.group.game.input.pointer2);

			//Translate
			this.renderer.translate(center.x - previousCenter.x, center.y - previousCenter.y);

			//Scale
			var previousDist = this.previousDistanceBetween(this.group.game.input.pointer1, this.group.game.input.pointer2)
			var newDist = this.distanceBetween(this.group.game.input.pointer1, this.group.game.input.pointer2);

			var scaleChange = newDist / previousDist;
			this.renderer.zoomAt(center.x, center.y, scaleChange);

			this.group.game.input.pointer1.resetMovement();
			this.group.game.input.pointer2.resetMovement();
		}
	}

	calculatePreviousCenter(pointer1: Phaser.Pointer, pointer2: Phaser.Pointer): XY {

		return new XY(
			(pointer1.x - pointer1.movementX + pointer2.x - pointer2.movementX) / 2,
			(pointer1.y - pointer1.movementY + pointer2.y - pointer2.movementY) / 2
		);
	}

	calculateCenter(a: IXY, b: IXY): XY {
		return new XY((a.x + b.x) / 2, (a.y + b.y) / 2);
	}

	previousDistanceBetween(a: Phaser.Pointer, b: Phaser.Pointer): number {
		var x = (a.x - a.movementX) - (b.x - b.movementX);
		var y = (a.y - a.movementY) - (b.y - b.movementY);

		return Math.sqrt(x * x + y * y);
	}

	distanceBetween(a: IXY, b: IXY): number {
		var x = a.x - b.x;
		var y = a.y - b.y;

		return Math.sqrt(x * x + y * y);
	}
}

export = InputHandler;