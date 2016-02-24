import Matches = require('./matchesDetector');
import Score = require('./scoreDetector');
import Time = require('./timeDetector');

var AllDetectors = {
	//Victory
	Matches: Matches,
	
	//Failure
	Score: Score,
	Time: Time
};

export = AllDetectors;