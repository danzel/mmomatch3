import TimeDetector = require('../../../Simulation/Levels/Detectors/timeDetector');

import DetectorDisplay = require('../detectorDisplay');


class TimeDisplay implements DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: TimeDetector) {
		let text = new Phaser.Text(group.game, 0, 0, "Time Remaining: " + detector.timeRemaining.toFixed(1), {
			fill: 'white'
		});
		this.group.add(text);

		detector.valueChanged.on(() => {
			text.text = "Time Remaining: " + detector.timeRemaining.toFixed(1);
		});
	}
}

export = TimeDisplay;