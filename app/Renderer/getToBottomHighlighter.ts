import Matchable = require('../Simulation/matchable');
import MatchableRenderer = require('./matchableRenderer');

class GetToBottomHighlighter {

	private highlighter: Phaser.Sprite;
	private tile: Phaser.TileSprite;
	private tween1: Phaser.Tween;
	private tween2: Phaser.Tween;
	
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
		this.tween1 = parentGroup.game.add.tween(hi.scale)
			.to({ x: 9, y: 9 }, time, Phaser.Easing.Cubic.Out, true, 0, -1)
			.repeatDelay(1000);
		this.tween2 = parentGroup.game.add.tween(hi)
			.to({ alpha: 0 }, time, Phaser.Easing.Sinusoidal.In, true, 0, -1)
			.repeatDelay(1000);
		this.highlighter = hi;

		this.update(0);
	}

	update(dt: number) {
		this.tile.tilePosition.y += dt * 300;

		let h = (this.matchable.y + 0.5) * MatchableRenderer.PositionScalar;

		this.tile.position.set(MatchableRenderer.PositionScalar * this.matchable.x + (MatchableRenderer.PositionScalar - 54) / 2, -h)
		this.tile.height = h;

		this.highlighter.position.set(MatchableRenderer.PositionScalar * this.matchable.x + (MatchableRenderer.PositionScalar) / 2, -h)
		
		if (this.matchable.y == 0) {
			this.tween1.repeat(0);
			this.tween2.repeat(0);
		}
	}
}

export = GetToBottomHighlighter;