/** Provides setInterval style callbacks but uses cpu pooling and tries to be more accurate */
class BetterInterval {

	lastTick: Array<number>;
	pool = 0;
	running = false;

	private boundTick: Function;

	constructor(private timeoutMs: number, private callback: Function) {
		this.boundTick = this.tick.bind(this);
	}

	start() {
		this.running = true;
		this.lastTick = process.hrtime();

		setTimeout(this.boundTick, this.timeoutMs)
	}

	private tick() {
		if (!this.running) {
			return;
		}

		this.updatePool();

		while (this.pool >= this.timeoutMs) {
			this.callback();
			this.pool -= this.timeoutMs;
		}

		this.updatePool();

		setTimeout(this.boundTick, this.timeoutMs - this.pool)
	}

	private updatePool() {
		var now = process.hrtime();
        var diff = (now[0] - this.lastTick[0]) * 1000;
        diff += (now[1] - this.lastTick[1]) / 1000000; //nanoseconds to milliseconds
		this.pool += diff;
		this.lastTick = now;
	}

	stop() {
		this.running = false;
	}
}

export = BetterInterval;