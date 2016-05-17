import fs = require('fs');

import ConfigFile = require('./config/configFile');
import Server = require('./server');

class StatePersister {
	private initialLevel = 1;
	
	constructor() {
		try
		{
			let file = fs.readFileSync('./state.json', 'UTF8');
			let data = JSON.parse(file);
			this.initialLevel = data.initialLevel || 1;
		}
		catch (err) {
			console.warn("Failed to load state.json", err)
		}
	}
	
	apply(config: ConfigFile) {
		config.server.initialLevel = this.initialLevel;
	}
	
	listen(server: Server) {
		server.levelStarted.on(level => {
			fs.writeFileSync('./state.json', JSON.stringify({
				initialLevel: level.level.levelNumber
			}));
		})
	}
}

export = StatePersister;