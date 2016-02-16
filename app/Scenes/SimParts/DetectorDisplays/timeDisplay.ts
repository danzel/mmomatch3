import TimeDetector = require('../../../Simulation/Levels/Detectors/timeDetector');

import DetectorDisplay = require('../detectorDisplay');


class TimeDisplay extends DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: TimeDetector) {
		super();
		let text = new Phaser.Text(group.game, 0, 0, "Time Remaining: " + detector.timeRemaining.toFixed(1), {
			fill: 'white'
		});
		this.group.add(text);

		detector.valueChanged.on(() => {
			if (!this.disabled) {
				text.text = "Time Remaining: " + detector.timeRemaining.toFixed(1);
			}
		});
	}
}

export = TimeDisplay;