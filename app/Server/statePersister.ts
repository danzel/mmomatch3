import fs = require('fs');

import ConfigFile = require('./config/configFile');
import LevelDefFactoryDynamic = require('../Simulation/Levels/levelDefFactoryDynamic');
import Server = require('./server');

class StatePersister {
	private initialLevel = 1;
	private playerCount: number;
	
	constructor() {
		try
		{
			let file = fs.readFileSync('./state.json', 'UTF8');
			let data = JSON.parse(file);
			this.initialLevel = data.initialLevel || 1;
			this.playerCount = data.playerCount;
		}
		catch (err) {
			console.warn("Failed to load state.json", err)
		}
	}
	
	apply(config: ConfigFile, levelDefFactory: LevelDefFactoryDynamic) {
		config.server.initialLevel = this.initialLevel;
		
		if (levelDefFactory && this.playerCount) {
			levelDefFactory.playerCount = this.playerCount;
		}
	}
	
	listen(server: Server) {
		server.levelStarted.on(level => {
			fs.writeFileSync('./state.json', JSON.stringify({
				initialLevel: level.level.levelNumber,
				playerCount: server.getPlayerCount() || this.playerCount //When we start the initial level don't undo our state
			}));
		})
	}
}

export = StatePersister;