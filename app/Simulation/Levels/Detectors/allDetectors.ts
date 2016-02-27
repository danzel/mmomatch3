import Matches = require('./matchesDetector');
import Score = require('./scoreDetector');
import Swaps = require('./swapsDetector');
import Time = require('./timeDetector');

var AllDetectors = {
	//Victory
	Matches: Matches,
	Score: Score,
	
	//Failure
	Swaps: Swaps,
	Time: Time
};

export = AllDetectors;