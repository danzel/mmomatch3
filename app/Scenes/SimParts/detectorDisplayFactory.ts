import Detector = require('../../Simulation/Levels/detector');
import DetectorDisplay = require('./detectorDisplay');
import Detectors = require('../../Simulation/Levels/Detectors/allDetectors');

import GetThingToBottomDisplay = require('./DetectorDisplays/getThingToBottomDisplay');
import MatchesDisplay = require('./DetectorDisplays/matchesDisplay');
import RequireMatchDisplay = require('./DetectorDisplays/requireMatchDisplay')
import ScoreDisplay = require('./DetectorDisplays/scoreDisplay');
import SwapsDisplay = require('./DetectorDisplays/swapsDisplay');
import TimeDisplay = require('./DetectorDisplays/timeDisplay');


/** Creates UI to show the state of (Failure/Victory) Detectors */
var DetectorDisplayFactory = {
	createDisplay: function (group: Phaser.Group, detector: Detector): DetectorDisplay {
		if (detector instanceof Detectors.Matches) {
			return new MatchesDisplay(group, detector);
		} else if (detector instanceof Detectors.Time) {
			return new TimeDisplay(group, detector);
		} else if (detector instanceof Detectors.Score) {
			return new ScoreDisplay(group, detector);
		} else if (detector instanceof Detectors.Swaps) {
			return new SwapsDisplay(group, detector);
		} else if (detector instanceof Detectors.RequireMatch) {
			return new RequireMatchDisplay(group, detector);
		} else if (detector instanceof Detectors.GetThingToBottom) {
			return new GetThingToBottomDisplay(group, detector);
		} else {
			throw new Error("Don't know about detector " + detector);
		}
	}
}

export = DetectorDisplayFactory;