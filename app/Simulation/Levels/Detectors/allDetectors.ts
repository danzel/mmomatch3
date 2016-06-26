import GetThingsToBottom = require('./getThingsToBottomDetector');
import GetToBottomRace = require('./getToBottomRaceDetector');
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
	GetThingsToBottom: GetThingsToBottom,
	
	//Failure
	Swaps: Swaps,
	Time: Time,
	
	//Both
	MatchXOfColor: MatchXOfColor,
	GetToBottomRace: GetToBottomRace
};

export = AllDetectors;