/// <reference path="../../node_modules/phaser/typescript/phaser.comments.d.ts" />
import Matchable = require('../Simulation/matchable');
import Swap = require('../Simulation/swap');

class MatchableNode {
	public static PositionScalar = 100;
	
	matchable: Matchable
	sprite: Phaser.Sprite;
	
	constructor(matchable: Matchable, parent : Phaser.Group) {
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
			
			//TODO: Easing
			this.sprite.x += diffX * swap.percent * MatchableNode.PositionScalar;
			this.sprite.y -= diffY * swap.percent * MatchableNode.PositionScalar;
		}
	}
	
	disappear() {
		this.sprite.destroy();
	}
}

export = MatchableNode;