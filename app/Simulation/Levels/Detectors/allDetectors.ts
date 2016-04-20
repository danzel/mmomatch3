import GetThingToBottom = require('./getThingToBottomDetector');
import GetThingsToBottom = require('./getThingsToBottomDetector');
import Matches = require('./matchesDetector');
import MatchXOfColor = require('./matchXOfColorDetector');
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
	GetThingsToBottom: GetThingsToBottom,
	
	//Failure
	Swaps: Swaps,
	Time: Time,
	
	//Both
	MatchXOfColor: MatchXOfColor
};

export = AllDetectors;