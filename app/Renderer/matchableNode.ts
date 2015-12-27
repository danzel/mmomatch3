/// <reference path="../../node_modules/phaser/typescript/phaser.comments.d.ts" />
import Matchable = require('../Simulation/matchable');

class MatchableNode {
	public static PositionScalar = 100;
	
	matchable: Matchable
	sprite: Phaser.Sprite;
	
	constructor(matchable: Matchable, parent : Phaser.Group) {
		this.matchable = matchable;
		this.sprite = parent.create(0, 0, 'ball_1');

		this.sprite.anchor = new Phaser.Point(0.5, 0.5);
		
		this.updatePosition();
	}
	
	updatePosition() {
		this.sprite.x = this.matchable.x * MatchableNode.PositionScalar;
		this.sprite.y = - this.matchable.y * MatchableNode.PositionScalar;
	}
}

export = MatchableNode;