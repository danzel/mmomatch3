import DefaultLevelAndSimulationProvider = require('./Server/defaultLevelAndSimulationProvider');
import LevelDefFactory = require('./Simulation/Levels/levelDefFactory');
import Serializer = require('./Serializer/simple');
import Server = require('./Server/server');
import SocketServer = require('./Server/socketServer');

class TimeBank {

	private tickMilliseconds: number;
	private pooledMilliseconds = 0;
	private lastTick: Array<number>;

	constructor(tickRate: number) {
		this.tickMilliseconds = (1000 / tickRate);
		this.lastTick = process.hrtime();
	}

	tick(): boolean {
		let now = process.hrtime();
		
		let diff = (now[0] - this.lastTick[0]) * 1000;
		diff += (now[1] - this.lastTick[1]) / 1000000; //nanoseconds to milliseconds
		
		this.lastTick = now;
		this.pooledMilliseconds += diff;
		
		if (this.pooledMilliseconds >= this.tickMilliseconds) {
			this.pooledMilliseconds -= this.tickMilliseconds;
			return true;
		}
		return false;
	}
}

class AppEntry {
	server: Server;

	fps = 60;
	timeBank = new TimeBank(this.fps);

	constructor() {
		this.server = new Server(new SocketServer(new Serializer()), new DefaultLevelAndSimulationProvider(new LevelDefFactory()));

		this.server.loadLevel(1);
	}

	update() {
		while (this.timeBank.tick()) {
			this.server.update();
		}
	}

	run() {
		setInterval(this.update.bind(this), 1000 / this.fps);
	}

	public static main(): number {
		new AppEntry().run();
		return 0;
	}
}

AppEntry.main();