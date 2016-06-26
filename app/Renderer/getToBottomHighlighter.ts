import CirclePingRenderer = require('./circlePingRenderer');
import Grid = require('../Simulation/grid');
import MagicNumbers = require('../Simulation/magicNumbers');
import Matchable = require('../Simulation/matchable');
import MatchableRenderer = require('./matchableRenderer');
import Type = require('../Simulation/type');
import TypeHelpers = require('../Simulation/typeHelpers');

class GetToBottomHighlighter {

	private width = 54;

	private tiles = new Array<Phaser.TileSprite>();

	constructor(private grid: Grid, private underGroup: Phaser.Group, private circlePingRenderer: CirclePingRenderer) {
	}

	render() {
		let nowS = this.underGroup.game.time.now / 1000;
		let index = 0;

		//TODO: We could get called in the simulationRenderer.update() loop to save us looping over all of them
		for (var x = 0; x < this.grid.width; x++) {
			var col = this.grid.cells[x];
			for (var y = col.length - 1; y > 0; y--) {
				let m = col[y];
				if (!TypeHelpers.isGetToBottom(m.type)) {
					continue;
				}
				let frame = this.tileFrameForType(m.type);

				if (this.tiles.length == index) {
					let t = this.underGroup.game.add.tileSprite(0, 0, this.width, 0, 'atlas', frame, this.underGroup);
					t.alpha = 0.5;
					this.tiles.push(t);
				}

				let tile = this.tiles[index];
				if (tile.frameName != frame) {
					tile.frameName = frame;
				}
				tile.visible = true;
				index++;

				//Use it
				tile.tilePosition.y = nowS * 300;
				let h = ((m.y / MagicNumbers.matchableYScale) + 0.5) * MatchableRenderer.PositionScalar;
				tile.height = h;
				tile.position.set(MatchableRenderer.PositionScalar * m.x + (MatchableRenderer.PositionScalar - 54) / 2, -h)

				this.circlePingRenderer.show(m.x, m.y);
			}
		}

		for (; index < this.tiles.length; index++) {
			this.tiles[index].visible = false;
		}
	}

	private tileFrameForType(type: Type): string {
		if (type == Type.GetToBottom) {
			return 'gettobottom_repeat.png';
		}
		if (type == Type.GetToBottomRace1) {
			return 'gettobottomrace1_repeat.png';
		}
		if (type == Type.GetToBottomRace2) {
			return 'gettobottomrace2_repeat.png';
		}
		throw new Error('dont know tileFrame for type ' + type);
	}
}

export = GetToBottomHighlighter;