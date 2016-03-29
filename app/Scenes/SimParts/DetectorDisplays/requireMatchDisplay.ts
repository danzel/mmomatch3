import RequireMatchDetector = require('../../../Simulation/Levels/Detectors/requireMatchDetector');

import DetectorDisplay = require('../detectorDisplay');


class RequireMatchDisplay extends DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: RequireMatchDetector) {
		super();
		let text = new Phaser.Text(group.game, 0, 0, "Require Matches Remaining: " + detector.requireMatches, {
			fill: 'white'
		});
		this.group.add(text);

		detector.valueChanged.on(() => {
			if (!this.disabled) {
				text.text = "Require Matches Remaining: " + detector.requireMatches;
			}
		});
	}
}

export = RequireMatchDisplay;