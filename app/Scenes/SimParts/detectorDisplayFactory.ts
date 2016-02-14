import Detector = require('../../Simulation/Levels/detector');
import DetectorDisplay = require('./detectorDisplay');
import Detectors = require('../../Simulation/Levels/Detectors/allDetectors');

import MatchesDisplay = require('./DetectorDisplays/matchesDisplay');
import TimeDisplay = require('./DetectorDisplays/timeDisplay');


/** Creates UI to show the state of (Failure/Victory) Detectors */
var DetectorDisplayFactory = {
	createDisplay: function (group: Phaser.Group, detector: Detector): DetectorDisplay {
		if (detector instanceof Detectors.Matches) {
			return new MatchesDisplay(group, detector);
		} else if (detector instanceof Detectors.Time) {
			return new TimeDisplay(group, detector);
		} else {
			throw new Error("Don't know about detector " + detector);
		}
	}
}

export = DetectorDisplayFactory;