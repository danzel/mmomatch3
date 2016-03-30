import GetThingToBottom = require('./getThingToBottomDetector');
import Matches = require('./matchesDetector');
import RequireMatch = require('./requireMatchDetector');
import Score = require('./scoreDetector');
import Swaps = require('./swapsDetector');
import Time = require('./timeDetector');

var AllDetectors = {
	//Victory
	Matches: Matches,
	Score: Score,
	RequireMatch: RequireMatch,
	GetThingToBottom: GetThingToBottom,
	
	//Failure
	Swaps: Swaps,
	Time: Time
};

export = AllDetectors;