import LevelDef = require('./levelDef');

interface LevelDefFactory {
	getLevel(levelNumber: number): LevelDef;
}


export = LevelDefFactory;