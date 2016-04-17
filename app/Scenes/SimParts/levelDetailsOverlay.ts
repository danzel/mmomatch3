import Detector = require('../../Simulation/Levels/detector');
import HtmlOverlayManager = require('../../HtmlOverlay/manager')
import LevelDef = require('../../Simulation/Levels/levelDef');
import LiteEvent = require('../../liteEvent');
import MatchXOfColorDetector = require('../../Simulation/Levels/Detectors/matchXOfColorDetector');
import TouchCatchAll = require('../../Renderer/Components/touchCatchAll');

declare function require(filename: string): (data: {}) => string;
var template = <(data: {}) => string>require('./levelDetailsOverlay.handlebars');
require('./levelDetailsOverlay.css');

class LevelDetailsOverlay {
	becameClosed = new LiteEvent<void>();

	constructor(private htmlOverlayManager: HtmlOverlayManager, private level: LevelDef, private victoryDetector: Detector, private failureDetector: Detector) {

		let details = {
			levelNumber: this.level.levelNumber,
			width: this.level.width,
			height: this.level.height,
			victoryText: this.victoryDetector.getDetailsText(),
			failureText: this.failureDetector.getDetailsText()
		};
		
		if (victoryDetector instanceof MatchXOfColorDetector && failureDetector instanceof MatchXOfColorDetector) {
			(<any>details).pigsvspugs = true;
			(<any>details).yours = victoryDetector.getColorText();
			(<any>details).notyours = failureDetector.getColorText()
		}
		
		htmlOverlayManager.showOverlay('level-details-overlay', template(details), () => {
			this.becameClosed.trigger()
		});
	}
}

export = LevelDetailsOverlay;