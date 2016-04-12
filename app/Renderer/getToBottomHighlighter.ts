import Matchable = require('../Simulation/matchable');
import MatchableNode = require('./matchableNode');

class GetToBottomHighlighter {

	private highlighter: Phaser.Sprite;
	private tile: Phaser.TileSprite;
	
	private width = 54;

	constructor(parentGroup: Phaser.Group, private matchable: Matchable) {
		let t = parentGroup.game.add.tileSprite(0, 0, this.width, 0, 'atlas', 'gettobottom_repeat.png', parentGroup);
		t.alpha = 0.5;
		t.tilePosition.y = 20;
		this.tile = t;
		parentGroup.sendToBack(t);
		this.tile = t;

		let hi = parentGroup.game.add.sprite(0, 0, 'atlas', 'circle.png', parentGroup);
		hi.anchor.set(0.5);
		hi.scale.set(0);

		let time = 3000;
		parentGroup.game.add.tween(hi.scale)
			.to({ x: 9, y: 9 }, time, null, true, 0, -1);
		parentGroup.game.add.tween(hi)
			.to({ alpha: 0 }, time, null, true, 0, -1);
		this.highlighter = hi;

		this.update(0);
	}

	update(dt: number) {
		this.tile.tilePosition.y += dt * 300;

		let h = (this.matchable.y + 0.5) * MatchableNode.PositionScalar;

		this.tile.position.set(MatchableNode.PositionScalar * this.matchable.x + (MatchableNode.PositionScalar - 54) / 2, -h)
		this.tile.height = h;

		this.highlighter.position.set(MatchableNode.PositionScalar * this.matchable.x + (MatchableNode.PositionScalar) / 2, -h)
	}
}

export = GetToBottomHighlighter;