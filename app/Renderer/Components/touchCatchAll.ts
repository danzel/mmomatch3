/// <reference path="../../../typings/phaser/phaser.comments.d.ts" />
import LiteEvent = require('../../liteEvent');

//ref https://github.com/photonstorm/phaser/blob/c9c85330ab60547b39ba4c9400c258ed7fb2a317/src/input/InputHandler.js#L819-L858

interface XY {
	x: number;
	y: number;
}

/** Has its own events for pointers, only fired in relation to pointers that are down */
class TouchCatchAll {
	sprite: Phaser.Sprite;

	rawInputUpdate = new LiteEvent<Phaser.Pointer>();

	pointerDown = new LiteEvent<Phaser.Pointer>();
	pointerMove = new LiteEvent<Phaser.Pointer>();
	pointerUp = new LiteEvent<Phaser.Pointer>();

	private lastPointerPosition: { [pointerId: number]: XY } = {};

	constructor(game: Phaser.Game) {
		this.sprite = new Phaser.Sprite(game, 0, 0);
		this.sprite.alpha = 0;
		this.sprite.hitArea = { contains: function() { return true; } };
		this.sprite.inputEnabled = true;
		//this.sprite.input.enableDrag();
		
		this.sprite.input.update = (pointer: Phaser.Pointer) => {
			this.rawInputUpdate.trigger(pointer);

			if (pointer.isDown) {
				let lastPosition = this.lastPointerPosition[pointer.id];
				if (lastPosition) {
					//replicating https://github.com/photonstorm/phaser/blob/c9c85330ab60547b39ba4c9400c258ed7fb2a317/src/input/Pointer.js#L733-L740
					pointer.rawMovementX = pointer.x - lastPosition.x;
					pointer.rawMovementY = pointer.y - lastPosition.y;
					pointer.movementX += pointer.rawMovementX;
					pointer.movementY += pointer.rawMovementY;

					this.pointerMove.trigger(pointer);

					lastPosition.x = pointer.x;
					lastPosition.y = pointer.y;
				} else {
					pointer.resetMovement();
					this.lastPointerPosition[pointer.id] = pointer;
					this.pointerDown.trigger(pointer);
					this.lastPointerPosition[pointer.id] = { x: pointer.x, y: pointer.y };
				}


			} else {
				this.pointerUp.trigger(pointer);
				delete this.lastPointerPosition[pointer.id];
			}
		};
		
		
		//For some reason we don't get update calls when a touch is released, so use the sprite event for that
		this.sprite.events.onInputUp.add((sprite: Phaser.Sprite, pointer: Phaser.Pointer) => {
			if (this.lastPointerPosition[pointer.id]) {
				this.pointerUp.trigger(pointer);
				delete this.lastPointerPosition[pointer.id];
			}
		});
	}
}

export = TouchCatchAll;