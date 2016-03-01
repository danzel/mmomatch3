import Matchable = require('../Simulation/matchable');
import Swap = require('../Simulation/swap');
import Type = require('../Simulation/type');

class MatchableNode {
	public static PositionScalar = 100;

	matchable: Matchable
	sprite: Phaser.Sprite;

	constructor(matchable: Matchable, parent: Phaser.Group) {
		this.matchable = matchable;
		this.sprite = parent.create(0, 0, 'ball_' + (matchable.color + 1));

		this.sprite.anchor = new Phaser.Point(0.5, 0.5);

		this.updatePosition();
	}

	updatePosition(swap?: Swap) {
		this.sprite.x = this.matchable.x * MatchableNode.PositionScalar;
		this.sprite.y = - this.matchable.y * MatchableNode.PositionScalar;

		this.sprite.alpha = 1 - this.matchable.disappearingPercent;

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

	updateForTransform() {
		let key: string;
		switch (this.matchable.type) {
			case Type.VerticalClearWhenMatched:
				key = 'overlay_vertical';
				break;
			case Type.HorizontalClearWhenMatched:
				key = 'overlay_horizontal';
				break;
			default:
				throw new Error("Don't know how to update for transform to type " + Type[this.matchable.type])
		}

		let child = new Phaser.Sprite(this.sprite.game, 0, 0, key);
		child.anchor.set(0.5, 0.5);
		this.sprite.addChild(child);
	}

	disappear() {
		this.sprite.destroy();
	}
}

export = MatchableNode;