import fs = require('fs');

import BetterInterval = require('./Server/betterInterval');
import ConfigFile = require('./Server/config/configFile');
import DatadogStats = require('./Server/datadogStats');
import DefaultLevelAndSimulationProvider = require('./Server/defaultLevelAndSimulationProvider');
import LevelDefFactoryDebug = require('./Simulation/Levels/levelDefFactoryDebug');
import LevelDefFactoryDynamic1 = require('./Simulation/Levels/levelDefFactoryDynamic1');
import Serializer = require('./Serializer/simple');
import Server = require('./Server/server');
import ServerLogger = require('./Server/serverLogger');
import SocketServer = require('./Server/socketServer');

class AppEntry {
	server: Server;

	constructor(private config: ConfigFile) {
		let levelDefFactory = new LevelDefFactoryDynamic1();
		this.server = new Server(new SocketServer(new Serializer(), config.socketServer), new DefaultLevelAndSimulationProvider(levelDefFactory), config.server);
		new DatadogStats(this.server);
		new ServerLogger(this.server);

		this.server.start();
	}

	run() {
		new BetterInterval(1000 / this.config.server.fps * this.config.server.framesPerTick, () => {
			for (let i = 0; i < this.config.server.framesPerTick; i++) {
				this.server.update();
			}
		}).start();
	}

	public static main(config: ConfigFile): number {
		new AppEntry(config).run();
		return 0;
	}
}

let config = JSON.parse(fs.readFileSync('./serverconfig.json', 'utf8'));

AppEntry.main(config);