import Grid = require('../Simulation/grid');
import MagicNumbers = require('../Simulation/magicNumbers');
import Matchable = require('../Simulation/matchable');
import MatchableRenderer = require('./matchableRenderer');
import Type = require('../Simulation/type');

class GetToBottomHighlighter {

	private width = 54;

	private highlighters = new Array<Phaser.Sprite>();
	private tiles = new Array<Phaser.TileSprite>();

	constructor(private grid: Grid, private underGroup: Phaser.Group, private overGroup: Phaser.Group) {
	}

	render() {
		let nowS = this.underGroup.game.time.now / 1000;
		let index = 0;

		//TODO: We could get called in the simulationRenderer.update() loop to save us looping over all of them
		for (var x = 0; x < this.grid.width; x++) {
			var col = this.grid.cells[x];
			for (var y = col.length - 1; y > 0; y--) {
				let m = col[y];
				if (m.type != Type.GetToBottom) {
					continue;
				}

				if (this.tiles.length == index) {
					let t = this.underGroup.game.add.tileSprite(0, 0, this.width, 0, 'atlas', 'gettobottom_repeat.png', this.underGroup);
					t.alpha = 0.5;
					this.tiles.push(t);
					let hi = this.underGroup.game.add.sprite(0, 0, 'atlas', 'circle.png', this.overGroup);
					hi.anchor.set(0.5);
					this.highlighters.push(hi);
				}

				let tile = this.tiles[index];
				tile.renderable = true;
				let highlighter = this.highlighters[index];
				highlighter.renderable = true;
				index++;

				//Use them
				tile.tilePosition.y = nowS * 300;
				let h = ((m.y / MagicNumbers.matchableYScale) + 0.5) * MatchableRenderer.PositionScalar;
				tile.height = h;
				tile.position.set(MatchableRenderer.PositionScalar * m.x + (MatchableRenderer.PositionScalar - 54) / 2, -h)

				highlighter.position.set(MatchableRenderer.PositionScalar * m.x + (MatchableRenderer.PositionScalar) / 2, -h)
				highlighter.scale.set(Phaser.Easing.Cubic.Out((nowS / 3) % 1) * 9);
				highlighter.alpha = 1 - Phaser.Easing.Sinusoidal.In((nowS / 3) % 1);
			}
		}

		for (; index < this.tiles.length; index++) {
			this.tiles[index].renderable = false;
			this.highlighters[index].renderable = false;
		}
	}
}

export = GetToBottomHighlighter;