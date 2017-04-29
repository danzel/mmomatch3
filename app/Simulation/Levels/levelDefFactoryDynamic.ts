import LevelDef = require('./levelDef');
import LevelDefFactory = require('./levelDefFactory');

abstract class LevelDefFactoryDynamic implements LevelDefFactory {
	playerCount = 24;
	
	abstract getLevel(levelNumber: number): LevelDef;
}

export = LevelDefFactoryDynamic;