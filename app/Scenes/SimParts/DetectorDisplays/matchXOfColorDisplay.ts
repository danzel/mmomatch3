import MatchXOfColorDetector = require('../../../Simulation/Levels/Detectors/matchXOfColorDetector');

import DetectorDisplay = require('../detectorDisplay');


class MatchXOfColorDisplay extends DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: MatchXOfColorDetector) {
		super();
		
		let text = new Phaser.Text(group.game, 0, 50, detector.getColorText() + " Remaining: " + detector.matchesRemaining, this.textStyle);
		this.group.add(text);
		
		if (detector.isVictory) {
			//Copy'ish' the object, if we had ES6 we could Object.assign
			// http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
			let headerStyle = Object.create(this.textStyle);
			headerStyle.fontSize = 40;
			
			let headerText = new Phaser.Text(group.game, 0, 0, "Team " + detector.getColorText(), headerStyle);
			this.group.add(headerText);
		}
		
		detector.valueChanged.on(() => {
			if (!this.disabled) {
				text.text = detector.getColorText() + " Remaining: " + detector.matchesRemaining;
			}
		});
	}
}

export = MatchXOfColorDisplay;