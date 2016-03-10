import BetterInterval = require('./Server/betterInterval');
import DefaultLevelAndSimulationProvider = require('./Server/defaultLevelAndSimulationProvider');
import LevelDefFactory = require('./Simulation/Levels/levelDefFactory');
import Serializer = require('./Serializer/simple');
import Server = require('./Server/server');
import SocketServer = require('./Server/socketServer');

class AppEntry {
	server: Server;

	framesPerTick = 3;
	fps = 60;

	constructor() {
		this.server = new Server(new SocketServer(new Serializer()), new DefaultLevelAndSimulationProvider(new LevelDefFactory()), this.framesPerTick);

		this.server.loadLevel(1);
	}

	run() {
		new BetterInterval(1000 / this.fps * this.framesPerTick, () => {
			for (let i = 0; i < this.framesPerTick; i++) {
				this.server.update();
			}
		}).start();
	}

	public static main(): number {
		new AppEntry().run();
		return 0;
	}
}

AppEntry.main();