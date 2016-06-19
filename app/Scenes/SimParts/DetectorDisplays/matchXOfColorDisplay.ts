import DetectorDisplay = require('../detectorDisplay');

import MatchXOfColorDetector = require('../../../Simulation/Levels/Detectors/matchXOfColorDetector');
import Language = require('../../../Language');

class MatchXOfColorDisplay extends DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: MatchXOfColorDetector) {
		super();
		
		let text = new Phaser.Text(group.game, 0, 50, 'todo', this.textStyle);
		this.updateText(text);
		this.group.add(text);
		
		if (detector.isVictory) {
			//Copy'ish' the object, if we had ES6 we could Object.assign
			// http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
			let headerStyle = Object.create(this.textStyle);
			headerStyle.fontSize = 40;
			
			let headerText = new Phaser.Text(group.game, 0, 0, Language.t('teamx', { team: detector.getColorText() }), headerStyle);
			this.group.add(headerText);
		}
		
		detector.valueChanged.on(() => this.updateText(text));
	}

	private updateText(text: Phaser.Text) {
		if (!this.disabled) {
			text.text = Language.t('xremaining', { thing: this.detector.getColorText(), num: this.detector.matchesRemaining });
		}
	}
}

export = MatchXOfColorDisplay;