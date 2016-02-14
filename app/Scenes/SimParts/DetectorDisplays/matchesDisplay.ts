import MatchesDetector = require('../../../Simulation/Levels/Detectors/matchesDetector');

import DetectorDisplay = require('../detectorDisplay');


class MatchesDisplay implements DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: MatchesDetector) {
		
	}
}

export = MatchesDisplay;