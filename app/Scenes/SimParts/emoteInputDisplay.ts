import InputApplier = require('../../Simulation/inputApplier');
import SwapHandler = require('../../Simulation/swapHandler');

class EmoteInputDisplay {
	private group: Phaser.Group;
	private button: Phaser.Sprite;

	private lastGameHeight = 0;
	private lastGameWidth = 0;

	private lastEmoteTime = 0;
	private showingEmotes = false;
	private emotesAvailable = false;

	private targetX: number;
	private targetY: number;

	private emoteSprites: Array<Phaser.Sprite>;

	constructor(group: Phaser.Group, private inputApplier: InputApplier, swapHandler: SwapHandler, playerId: number) {
		this.group = group.game.add.group();
		this.group.alpha = 0;
		this.button = group.game.add.sprite(0, -64, 'atlas', 'emote.png', this.group);
		this.button.anchor.set(0.5, 1);

		let boxWidth = 50 * 6 + 8;
		let graphics = this.group.game.add.graphics(-boxWidth / 2, -56, this.group);
		graphics.lineStyle(5, 0x6382B8, 1);
		graphics.beginFill(0x8FB863);
		graphics.drawRoundedRect(0, 0, boxWidth, 60, 5);
		graphics.endFill();
		graphics.cacheAsBitmap = true;

		this.emoteSprites = [
			group.game.add.sprite(-boxWidth / 2 + 5 + 0 * 50, -51, 'atlas', 'emotes/1.png', this.group),
			group.game.add.sprite(-boxWidth / 2 + 5 + 1 * 50, -51, 'atlas', 'emotes/2.png', this.group),
			group.game.add.sprite(-boxWidth / 2 + 5 + 2 * 50, -51, 'atlas', 'emotes/3.png', this.group),
			group.game.add.sprite(-boxWidth / 2 + 5 + 3 * 50, -51, 'atlas', 'emotes/4.png', this.group),
			group.game.add.sprite(-boxWidth / 2 + 5 + 4 * 50, -51, 'atlas', 'emotes/5.png', this.group),
			group.game.add.sprite(-boxWidth / 2 + 5 + 5 * 50, -51, 'atlas', 'emotes/6.png', this.group)
		];

		for (let i = 0; i < this.emoteSprites.length; i++) {
			let s = this.emoteSprites[i];
			s.scale.set(0.5);
			s.inputEnabled = true;
			let emoteNumber = 1 + i;
			s.events.onInputUp.add(() => {
				if (!this.emotesAvailable || !this.showingEmotes) {
					return;
				}

				this.inputApplier.emote(emoteNumber, this.targetX, this.targetY);

				this.click();
				this.emotesAvailable = false;
				this.group.game.add.tween(this.group).to({ alpha: 0 }, 200).start();
			});
		}

		this.button.inputEnabled = true;
		this.button.events.onInputUp.add(this.click, this);

		swapHandler.swapStarted.on(swap => {
			if (swap.playerId == playerId) {
				this.makeAvailable((swap.left.x + swap.right.x) / 2, (swap.left.y + swap.right.y) / 2);
			}
		})
	}

	private makeAvailable(x: number, y: number) {
		if (!this.emotesAvailable) {
			this.emotesAvailable = true;
			this.group.game.add.tween(this.group).to({ alpha: 1 }, 200).start();
		}

		this.targetX = x;
		this.targetY = y;
	}

	private click() {
		this.showingEmotes = !this.showingEmotes;

		let tween = this.button.game.add.tween(this.group);
		tween.to({ y: this.group.game.height + (this.showingEmotes ? 0 : 60) }, 250, Phaser.Easing.Cubic.InOut);
		tween.start();
	}

	update() {
		if (this.group.game.width != this.lastGameWidth || this.group.game.height != this.lastGameHeight) {
			this.group.position.set(this.group.game.width / 2, this.group.game.height + (this.showingEmotes ? 0 : 60));
			this.lastGameHeight = this.group.game.height;
			this.lastGameWidth = this.group.game.width;

			if (this.group.game.width < 400) {
				this.button.scale.set(0.6);
			} else {
				this.button.scale.set(1);
			}
		}
	}

	destroy() {
		this.group.destroy();
	}
}

export = EmoteInputDisplay;