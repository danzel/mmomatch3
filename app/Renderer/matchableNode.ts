import Color = require('../Simulation/color');
import Matchable = require('../Simulation/matchable');
import Swap = require('../Simulation/swap');
import Type = require('../Simulation/type');

class MatchableNode {
	public static PositionScalar = 100;

	matchable: Matchable;

	sprite: Phaser.Sprite;
	replacementSprite: Phaser.Sprite;
	overlay: Phaser.Sprite;

	constructor(matchable: Matchable, parent: Phaser.Group) {
		this.matchable = matchable;

		this.sprite = parent.create(0, 0, MatchableNode.getSpriteKey(matchable.color, matchable.type));

		this.sprite.anchor = new Phaser.Point(0.5, 0.5);

		if (matchable.type == Type.GetToBottom) {
			this.sprite.scale.set(0.9, 0.9);
			parent.game.add.tween(this.sprite.scale)
				.to({ x: 1.1, y: 1.1 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
				.start();
		}

		this.updatePosition();
	}

	static getSpriteKey(color: Color, type: Type): string {
		if (type == Type.GetToBottom) {
			return "ball_gettobottom";
		}

		return 'ball_' + (color + 1);
	}

	updatePosition(swap?: Swap) {
		this.sprite.x = this.matchable.x * MatchableNode.PositionScalar;
		this.sprite.y = - this.matchable.y * MatchableNode.PositionScalar;

		if (this.matchable.transformTo && this.overlay) {
			this.overlay.alpha = this.matchable.disappearingPercent;
		} else {
			if (this.overlay) {
				this.overlay.alpha = 1;
			}
			this.sprite.alpha = 1 - this.matchable.disappearingPercent;
		}
		if (this.replacementSprite) {
			this.replacementSprite.alpha = 1 - this.sprite.alpha;
			this.replacementSprite.x = this.sprite.x;
			this.replacementSprite.y = this.sprite.y;
		}

		if (swap) {
			let otherMatchable = swap.left == this.matchable ? swap.right : swap.left;

			var diffX = otherMatchable.x - this.matchable.x;
			var diffY = otherMatchable.y - this.matchable.y;

			this.sprite.x += diffX * swap.percent * MatchableNode.PositionScalar;
			this.sprite.y -= diffY * swap.percent * MatchableNode.PositionScalar;
		}
	}

	private static easingFunction(p: number): number {
		return Math.sin(p * Math.PI * 2) * (1 - p * p);
	}

	failedToSwap(direction: { x: number, y: number }) {
		//Wobble back and forwards a bit
		let startX = this.sprite.x;
		let startY = this.sprite.y;

		this.sprite.bringToTop();

		this.sprite.game.add.tween(this.sprite).to({
			x: startX + direction.x * 0.5 * MatchableNode.PositionScalar,
			y: startY - direction.y * 0.5 * MatchableNode.PositionScalar
		}, 300, MatchableNode.easingFunction, true);
	}

	updateForTransforming() {
		if (this.matchable.transformTo == Type.ColorClearWhenSwapped) {
			this.replacementSprite = new Phaser.Sprite(this.sprite.game, 0, 0, 'ball_colorclear');
			this.replacementSprite.anchor.set(0.5, 0.5);
			this.sprite.parent.addChild(this.replacementSprite);
			return;
		}

		let key: string;
		switch (this.matchable.transformTo) {
			case Type.VerticalClearWhenMatched:
				key = 'overlay_vertical';
				break;
			case Type.HorizontalClearWhenMatched:
				key = 'overlay_horizontal';
				break;
			case Type.AreaClear3x3WhenMatched:
				key = 'overlay_areaclear';
				break;
			default:
				throw new Error("Don't know how to update for transform to type " + Type[this.matchable.transformTo])
		}

		let child = new Phaser.Sprite(this.sprite.game, 0, 0, key);
		child.anchor.set(0.5, 0.5);
		this.sprite.addChild(child);
		this.overlay = child;

		child.game.add.tween(child.scale)
			.to({ x: 0.95, y: 0.95 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
	}

	updateForTransformed() {
		if (this.replacementSprite) {
			this.sprite.destroy();
			this.sprite = this.replacementSprite;
			delete this.replacementSprite;
		}
	}

	disappear() {
		this.sprite.destroy();
	}
}

export = MatchableNode;