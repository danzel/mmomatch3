import DefaultLevelAndSimulationProvider = require('./Server/defaultLevelAndSimulationProvider');
import LevelDefFactory = require('./Simulation/Levels/levelDefFactory');
import Serializer = require('./Serializer/simple');
import Server = require('./Server/server');
import SocketServer = require('./Server/socketServer');

class AppEntry {
	server: Server;

	fps: number;
	tickRate: number;

	constructor() {
		this.server = new Server(new SocketServer(new Serializer()), new DefaultLevelAndSimulationProvider(new LevelDefFactory()));
		
		this.server.loadLevel(1);
	}

	update() {
		this.server.update(this.tickRate);
	}

	run(fps: number) {
		this.fps = fps;
		this.tickRate = 1 / fps;

		setInterval(this.update.bind(this), this.tickRate * 1000);
	}

	public static main(): number {
		new AppEntry().run(60);
		return 0;
	}
}

AppEntry.main();