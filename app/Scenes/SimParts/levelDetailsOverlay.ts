import Detector = require('../../Simulation/Levels/detector');
import HtmlOverlayManager = require('../../HtmlOverlay/manager')
import Language = require('../../Language');
import LevelDef = require('../../Simulation/Levels/levelDef');
import LiteEvent = require('../../liteEvent');

import GetThingsToBottomDetector = require('../../Simulation/Levels/Detectors/getThingsToBottomDetector');
import GetToBottomRaceDetector = require('../../Simulation/Levels/Detectors/getToBottomRaceDetector');
import MatchXOfColorDetector = require('../../Simulation/Levels/Detectors/matchXOfColorDetector');
import RequireMatchDetector = require('../../Simulation/Levels/Detectors/requireMatchDetector');

var template = <(data: {}) => string>require('./levelDetailsOverlay.handlebars');
require('./levelDetailsOverlay.css');
var pig = require('file?name=pig.png?[hash:6]!../../../img/skin/emojione-animals/balls/6.png');
var pug = require('file?name=pug.png?[hash:6]!../../../img/skin/emojione-animals/balls/4.png');
var pug = require('file?name=pug.png?[hash:6]!../../../img/skin/emojione-animals/balls/4.png');
var cage = require('file?name=cage.png?[hash:6]!../../../img/skin/emojione-animals/requirematch.png');
var gettobottom = require('file?name=gettobottom.png?[hash:6]!../../../img/skin/emojione-animals/balls/gettobottom.png');
var bee = require('file?name=bee.png?[hash:6]!../../../img/skin/emojione-animals/balls/gettobottomrace2.png');
var butterfly = require('file?name=butterfly.png?[hash:6]!../../../img/skin/emojione-animals/balls/gettobottomrace1.png');

class LevelDetailsOverlay {
	becameClosed = new LiteEvent<void>();

	constructor(private htmlOverlayManager: HtmlOverlayManager, private level: LevelDef, private victoryDetector: Detector, private failureDetector: Detector) {

		let details = {
			width: this.level.width,
			height: this.level.height,
			victoryText: this.victoryDetector.getDetailsText(),
			failureText: this.failureDetector.getDetailsText(),
			pig,
			pug,
			cage,
			gettobottom,

			_level: Language.t('level x', { num: this.level.levelNumber }),
			_size: Language.t('size'),
			_clicktostart: Language.t('click to start'),
		};

		if (victoryDetector instanceof MatchXOfColorDetector && failureDetector instanceof MatchXOfColorDetector) {
			(<any>details).pigsvspugs = true;
			(<any>details)._pigsvspugs = Language.t('pigsvspugs');

			let yoursText = victoryDetector.getColorText();
			let notYoursText = failureDetector.getColorText();
			
			(<any>details)._youareonteam = Language.t('youareonteam', { team: yoursText });
			(<any>details)._matchbutdontmatch = Language.t('matchbutdontmatch', { team: yoursText, notteam: notYoursText });

			(<any>details).yourstext = yoursText;
			(<any>details).notyourstext = notYoursText;
			(<any>details).yours = victoryDetector.isPugs() ? pug : pig;
			(<any>details).notyours = victoryDetector.isPugs() ? pig : pug;
		}
		if (victoryDetector instanceof GetThingsToBottomDetector) {
			(<any>details).getthingstobottom = true;
		}
		if (victoryDetector instanceof RequireMatchDetector) {
			(<any>details).requirematch = true;
		}
		if (victoryDetector instanceof GetToBottomRaceDetector) {
			(<any>details).getToBottomRace = true;
			(<any>details)._butterflysvsbees = Language.t('butterflyvsbee');

			(<any>details).yours = victoryDetector.isButterfly() ? butterfly : bee;
			(<any>details).notyours = victoryDetector.isButterfly() ? bee : butterfly;
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