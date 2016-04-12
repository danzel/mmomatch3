import fs = require('fs');

import BetterInterval = require('./Server/betterInterval');
import DatadogStats = require('./Server/datadogStats');
import DefaultLevelAndSimulationProvider = require('./Server/defaultLevelAndSimulationProvider');
import LevelDefFactoryDebug = require('./Simulation/Levels/levelDefFactoryDebug');
import LevelDefFactoryDynamic1 = require('./Simulation/Levels/levelDefFactoryDynamic1');
import Serializer = require('./Serializer/simple');
import Server = require('./Server/server');
import ServerConfig = require('./Server/serverConfig');
import ServerLogger = require('./Server/serverLogger');
import SocketServer = require('./Server/socketServer');

class AppEntry {
	server: Server;

	framesPerTick = 3;
	fps = 60;

	constructor(config: ServerConfig) {
		let levelDefFactory = new LevelDefFactoryDynamic1();
		this.server = new Server(new SocketServer(new Serializer(), config), new DefaultLevelAndSimulationProvider(levelDefFactory), this.framesPerTick);
		new DatadogStats(this.server);
		new ServerLogger(this.server);

		this.server.loadLevel(1);
	}

	run() {
		new BetterInterval(1000 / this.fps * this.framesPerTick, () => {
			for (let i = 0; i < this.framesPerTick; i++) {
				this.server.update();
			}
		}).start();
	}

	public static main(config: ServerConfig): number {
		new AppEntry(config).run();
		return 0;
	}
}

let config = JSON.parse(fs.readFileSync('./serverconfig.json', 'utf8'));

AppEntry.main(config);