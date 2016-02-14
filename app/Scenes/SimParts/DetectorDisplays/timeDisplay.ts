import TimeDetector = require('../../../Simulation/Levels/Detectors/timeDetector');

import DetectorDisplay = require('../detectorDisplay');


class TimeDisplay implements DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: TimeDetector) {
		
	}
}

export = TimeDisplay;