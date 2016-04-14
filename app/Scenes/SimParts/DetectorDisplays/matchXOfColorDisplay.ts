import MatchXOfColorDetector = require('../../../Simulation/Levels/Detectors/matchXOfColorDetector');

import DetectorDisplay = require('../detectorDisplay');


class MatchXOfColorDisplay extends DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: MatchXOfColorDetector) {
		super();
		
		let text = new Phaser.Text(group.game, 0, 0, detector.getColorText() + " Remaining: " + detector.matchesRemaining, this.textStyle);
		this.group.add(text);

		detector.valueChanged.on(() => {
			if (!this.disabled) {
				text.text = detector.getColorText() + " Remaining: " + detector.matchesRemaining;
			}
		});
	}
}

export = MatchXOfColorDisplay;