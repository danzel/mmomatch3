import Detector = require('../../Simulation/Levels/detector');
import HtmlOverlayManager = require('../../HtmlOverlay/manager')
import LevelDef = require('../../Simulation/Levels/levelDef');
import LiteEvent = require('../../liteEvent');
import TouchCatchAll = require('../../Renderer/Components/touchCatchAll');

declare function require(filename: string): (data: {}) => string;
var template = <(data: {}) => string>require('./levelDetailsOverlay.handlebars');
require('./levelDetailsOverlay.css');

class LevelDetailsOverlay {
	closed = false;

	becameClosed = new LiteEvent<void>();

	constructor(private htmlOverlayManager: HtmlOverlayManager, private level: LevelDef, private victoryDetector: Detector, private failureDetector: Detector) {

		htmlOverlayManager.showOverlay('level-details-overlay', template({
			levelNumber: this.level.levelNumber,
			width: this.level.width,
			height: this.level.height,
			victoryText: this.victoryDetector.getDetailsText(),
			failureText: this.failureDetector.getDetailsText()
		}), () => {
			this.closed = true;
			this.becameClosed.trigger()
		});
	}
}

export = LevelDetailsOverlay;