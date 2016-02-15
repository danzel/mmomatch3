import MatchesDetector = require('../../../Simulation/Levels/Detectors/matchesDetector');

import DetectorDisplay = require('../detectorDisplay');


class MatchesDisplay implements DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: MatchesDetector) {
		let text = new Phaser.Text(group.game, 0, 0, "Matches Remaining: " + detector.matchesRemaining, {
			fill: 'white'
		});
		this.group.add(text);

		detector.valueChanged.on(() => {
			text.text = "Matches Remaining: " + detector.matchesRemaining;
		});
	}
}

export = MatchesDisplay;