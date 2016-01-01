/// <reference path="../../node_modules/phaser/typescript/phaser.comments.d.ts" />

interface IXY {
	x: number;
	y: number;
}

interface PointerCallback {
	mouseCallback: (pointer: Phaser.Pointer, x: number, y: number, down: Boolean) => void;
	touchCallback: (pointer: Phaser.Pointer, x: number, y: number, down: Boolean) => void;
}

//Updates pointer.movementX/Y
//They are not set by Phaser when not in pointer lock mode
//Also splits mouse and touch callbacks
class PointerStateTracker {
	private game: Phaser.Game;
	private callback: PointerCallback;

	private pointerLastPosition: { [id: number]: IXY };

	constructor(game: Phaser.Game, callback: PointerCallback) {
		this.game = game;
		this.callback = callback;
		this.pointerLastPosition = {};
		
		this.game.input.addMoveCallback(this.mouseMove, this);
		this.game.input.onUp.add(this.onPointerUp, this);
	}
	
	private onPointerUp(pointer: Phaser.Pointer) {
		if (pointer.pointerMode != Phaser.PointerMode.CURSOR) {
			pointer.isUp = true;
			pointer.isDown = false;
			
			let lastPosition = this.pointerLastPosition[pointer.id];
			this.mouseMove(pointer, lastPosition.x, lastPosition.y, false);
		}
	}

	private mouseMove(pointer: Phaser.Pointer, x: number, y: number, down: Boolean) {
		if (this.pointerLastPosition[pointer.id]) {
			var last = this.pointerLastPosition[pointer.id];
			pointer.movementX = pointer.clientX - last.x;
			pointer.movementY = pointer.clientY - last.y;

			last.x = pointer.clientX;
			last.y = pointer.clientY;
		}
		else {
			this.pointerLastPosition[pointer.id] = { x: pointer.clientX, y: pointer.clientY };
		}

		if (pointer.pointerMode == Phaser.PointerMode.CURSOR)
			this.callback.mouseCallback(pointer, x, y, down);
		else
			this.callback.touchCallback(pointer, x, y, down);
	}
}

export = PointerStateTracker;