import CirclePingRenderer = require('./circlePingRenderer');
import GameEndDetector = require('../Simulation/Levels/gameEndDetector');
import GetToBottomRaceDetector = require('../Simulation/Levels/Detectors/getToBottomRaceDetector');
import Grid = require('../Simulation/grid');
import MagicNumbers = require('../Simulation/magicNumbers');
import Matchable = require('../Simulation/matchable');
import MatchableRenderer = require('./matchableRenderer');
import Type = require('../Simulation/type');
import TypeHelpers = require('../Simulation/typeHelpers');

const currentSkin = 'skin-emojione-animals';

class GetToBottomHighlighter {

	private width = 54;
	private highlightType = Type.GetToBottom;

	private index = 0;
	private tiles = new Array<Phaser.TileSprite>();
	private nowS: number;

	constructor(private underGroup: Phaser.Group, private circlePingRenderer: CirclePingRenderer) {
	}

	begin(gameEndDetector: GameEndDetector) {
		this.index = 0;
		this.nowS = this.underGroup.game.time.now / 1000;

		if (gameEndDetector.victoryDetector instanceof GetToBottomRaceDetector) {
			this.highlightType = (<GetToBottomRaceDetector>gameEndDetector.victoryDetector).matchableType;
		} else {
			this.highlightType = Type.GetToBottom;
		}
	}

	render(m: Matchable) {
		if (m.type != this.highlightType) {
			return;
		}
		let frame = this.tileFrameForType(m.type);

		if (this.tiles.length == this.index) {
			let t = this.underGroup.game.add.tileSprite(0, 0, this.width, 0, 'atlas', frame, this.underGroup);
			t.alpha = 0.5;
			this.tiles.push(t);
		}

		let tile = this.tiles[this.index];
		if (tile.frameName != frame) {
			tile.frameName = frame;
		}
		tile.visible = true;
		this.index++;

		//Use it
		tile.tilePosition.y = this.nowS * 300;
		let h = ((m.y / MagicNumbers.matchableYScale) + 0.5) * MatchableRenderer.PositionScalar;
		tile.height = h;
		tile.position.set(MatchableRenderer.PositionScalar * m.x + (MatchableRenderer.PositionScalar - 54) / 2, -h)

		this.circlePingRenderer.show(m.x, m.y);
	}

	end() {
		while (this.index < this.tiles.length) {
			this.tiles[this.index].visible = false;
			this.index++
		}
	}

	private tileFrameForType(type: Type): string {
		if (type == Type.GetToBottom) {
			return currentSkin + '/gettobottom_repeat.png';
		}
		if (type == Type.GetToBottomRace1) {
			return currentSkin + '/gettobottomrace1_repeat.png';
		}
		if (type == Type.GetToBottomRace2) {
			return currentSkin + '/gettobottomrace2_repeat.png';
		}
		throw new Error('dont know tileFrame for type ' + type);
	}
}

export = GetToBottomHighlighter;