declare module "node-dogstatsd" {

	module NodeDogstatsd {
		class StatsD {
			constructor();
			constructor(address: string, port: number);

			/** Sends a timing command with the specified milliseconds */
			timing(name: string, value: number): void;

			/** Increments a stat by a value (default is 1) */
			increment(name: string, value?: number): void;

			/** Decrements a stat by a value (default is -1) */
			decrement(name: string, value?: number): void;

			/** Send data for histogram stat */
			histogram(name: string, value: number): void;

			/** Gauge a stat by a specified amount */
			gauge(name: string, value: number): void;
		}
	}

	export = NodeDogstatsd;
}