/// <reference path="../../node_modules/phaser/typescript/phaser.comments.d.ts" />

interface IXY {
	x: number;
	y: number;
}

//Updates pointer.movementX/Y
//They are not set by Phaser when not in pointer lock mode
class PointerStateTracker {
	private game: Phaser.Game;
	private pointerLastPosition: { [id: number]: IXY };

	moveCallback: (pointer: Phaser.Pointer, x: number, y: number, down: Boolean) => void;

	constructor(game: Phaser.Game) {
		this.game = game;
		this.pointerLastPosition = {};
		
		this.game.input.addMoveCallback(this.mouseMove, this);
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
		
		this.moveCallback(pointer, x, y, down);
	}
}

export = PointerStateTracker;