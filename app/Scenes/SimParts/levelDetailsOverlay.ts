import Detector = require('../../Simulation/Levels/detector');
import HtmlOverlayManager = require('../../HtmlOverlay/manager')
import LevelDef = require('../../Simulation/Levels/levelDef');
import LiteEvent = require('../../liteEvent');

import GetThingsToBottomDetector = require('../../Simulation/Levels/Detectors/getThingsToBottomDetector');
import MatchXOfColorDetector = require('../../Simulation/Levels/Detectors/matchXOfColorDetector');
import RequireMatchDetector = require('../../Simulation/Levels/Detectors/requireMatchDetector');

var template = <(data: {}) => string>require('./levelDetailsOverlay.handlebars');
require('./levelDetailsOverlay.css');
var pig = require('file?name=pig.png?[hash:6]!../../../img/skin/emojione-animals/balls/6.png');
var pug = require('file?name=pug.png?[hash:6]!../../../img/skin/emojione-animals/balls/4.png');
var pug = require('file?name=pug.png?[hash:6]!../../../img/skin/emojione-animals/balls/4.png');
var cage = require('file?name=cage.png?[hash:6]!../../../img/skin/emojione-animals/requirematch.png');

class LevelDetailsOverlay {
	becameClosed = new LiteEvent<void>();

	constructor(private htmlOverlayManager: HtmlOverlayManager, private level: LevelDef, private victoryDetector: Detector, private failureDetector: Detector) {

		let details = {
			levelNumber: this.level.levelNumber,
			width: this.level.width,
			height: this.level.height,
			victoryText: this.victoryDetector.getDetailsText(),
			failureText: this.failureDetector.getDetailsText(),
			pig,
			pug,
			cage
		};

		if (victoryDetector instanceof MatchXOfColorDetector && failureDetector instanceof MatchXOfColorDetector) {
			(<any>details).pigsvspugs = true;
			(<any>details).yourstext = victoryDetector.getColorText();
			(<any>details).yours = victoryDetector.isPugs() ? pug : pig;
			(<any>details).notyours = victoryDetector.isPugs() ? pig : pug
		}
		if (victoryDetector instanceof GetThingsToBottomDetector) {
			(<any>details).getthingstobottom = true;
		}
		if (victoryDetector instanceof RequireMatchDetector) {
			(<any>details).requirematch = true;
		}

		htmlOverlayManager.showOverlay({
			className: 'frame level-details-overlay',
			content: template(details),
			closeOnBackgroundClick: true,
			closedCallback: () => this.becameClosed.trigger(),
			showBannerAd: true
		});
	}
}

export = LevelDetailsOverlay;