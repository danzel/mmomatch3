import Color = require('../Simulation/color');
import Matchable = require('../Simulation/matchable');
import Swap = require('../Simulation/swap');
import Type = require('../Simulation/type');

const positionScalar = 100;
const xOffset = positionScalar / 2;
const yOffset = positionScalar / 2;

class MatchableNode {
	public static PositionScalar = positionScalar;

	matchable: Matchable;

	sprite: Phaser.Image;
	replacementSprite: Phaser.Image;
	overlay: Phaser.Image;

	constructor(matchable: Matchable, parent: Phaser.Group) {
		this.matchable = matchable;

		this.sprite = parent.game.add.image(0, 0, 'atlas', MatchableNode.getSpriteFrame(matchable.color, matchable.type), parent);

		this.sprite.anchor = new Phaser.Point(0.5, 0.5);

		if (matchable.type == Type.GetToBottom) {
			this.sprite.scale.set(0.9, 0.9);
			parent.game.add.tween(this.sprite.scale)
				.to({ x: 1.1, y: 1.1 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
				.start();
		}

		this.updatePosition();
	}

	static getSpriteFrame(color: Color, type: Type): string {
		if (type == Type.GetToBottom) {
			return "balls/gettobottom.png";
		}
		if (type == Type.ColorClearWhenSwapped) {
			return 'balls/colorclear.png';
		}

		return 'balls/' + (color + 1) + ".png";
	}

	updatePosition() {
		this.sprite.x = this.matchable.x * MatchableNode.PositionScalar + xOffset;
		this.sprite.y = - this.matchable.y * MatchableNode.PositionScalar - yOffset;

		if (this.overlay) {
			if (this.matchable.transformTo) {
				this.overlay.alpha = this.matchable.disappearingPercent;
			} else {
				this.overlay.alpha = 1;
			}
		}

		if (!this.matchable.transformTo || this.replacementSprite) {
			this.sprite.alpha = 1 - this.matchable.disappearingPercent;
			if (this.overlay) {
				this.overlay.alpha = this.sprite.alpha;
			}
		}

		if (this.replacementSprite) {
			this.replacementSprite.alpha = 1 - this.sprite.alpha;
			this.replacementSprite.position.x = this.sprite.position.x;
			this.replacementSprite.position.y = this.sprite.position.y;
		}
	}

	updatePositionForSwap(swap: Swap) {
		let otherMatchable = swap.left == this.matchable ? swap.right : swap.left;

		var diffX = otherMatchable.x - this.matchable.x;
		var diffY = otherMatchable.y - this.matchable.y;

		this.sprite.position.x += diffX * swap.percent * MatchableNode.PositionScalar;
		this.sprite.position.y -= diffY * swap.percent * MatchableNode.PositionScalar;
	}

	updateForTransforming() {
		if (this.matchable.transformTo == Type.ColorClearWhenSwapped) {
			this.replacementSprite = new Phaser.Image(this.sprite.game, 0, 0, 'atlas', 'balls/colorclear.png');
			this.replacementSprite.anchor.set(0.5, 0.5);
			this.sprite.parent.addChild(this.replacementSprite);
			return;
		}

		let frame: string;
		switch (this.matchable.transformTo) {
			case Type.VerticalClearWhenMatched:
				frame = 'balloverlays/vertical.png';
				break;
			case Type.HorizontalClearWhenMatched:
				frame = 'balloverlays/horizontal.png';
				break;
			case Type.AreaClear3x3WhenMatched:
				frame = 'balloverlays/areaclear.png';
				break;
			default:
				throw new Error("Don't know how to update for transform to type " + Type[this.matchable.transformTo])
		}

		let child = new Phaser.Image(this.sprite.game, 0, 0, 'atlas', frame);
		child.anchor.set(0.5, 0.5);
		this.sprite.parent.addChild(child);
		child.position = this.sprite.position; //HACK - we always want these to be in the same place
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