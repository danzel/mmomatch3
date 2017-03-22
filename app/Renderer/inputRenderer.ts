import InputHandler = require('../Input/inputHandler');

class InputRenderer {
	sprite: Phaser.Sprite;

	constructor(group: Phaser.Group, private input: InputHandler) {
		this.sprite = group.game.add.sprite(0, 0, 'atlas', 'drag.png', group);
		this.sprite.anchor.set(0.5, 0.5);
		this.sprite.alpha = 0;
	}

	update(): void {
		if (this.input.singleTouchDragIsActive) {
			this.sprite.position.set(this.input.singleTouchPointer.x, this.input.singleTouchPointer.y);
			this.sprite.alpha = Math.min(1, this.sprite.alpha + this.sprite.game.time.physicsElapsed);
		} else {
			this.sprite.alpha = 0;
		}
	}
}

export = InputRenderer;