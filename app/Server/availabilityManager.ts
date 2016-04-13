import ServerConfig = require('./config/serverConfig')

class TimePeriod {
	startTime: number;
	endTime: number;

	constructor(public startDateJSON: string, endDateJSON: string) {
		this.startTime = new Date(startDateJSON).getTime();
		this.endTime = new Date(endDateJSON).getTime();
	}

	contains(dateTime: number) {
		return dateTime >= this.startTime && dateTime < this.endTime;
	}
}

class AvailabilityManager {
	private alwaysAvailable = false;

	private schedule = new Array<TimePeriod>();

	constructor(config: ServerConfig) {
		if (!config.availability) {
			this.alwaysAvailable = true;
			return;
		}

		for (let i = 0; i < config.availability.length; i++) {
			this.schedule.push(new TimePeriod(config.availability[i].start, config.availability[i].end));
		}
	}

	availableAt(date: Date): boolean {
		if (this.alwaysAvailable) {
			return true;
		}

		let dateTime = date.getTime();
		return this.schedule.some(p => p.contains(dateTime));
	}

	nextAvailableJSON(date: Date): string {
		let dateTime = date.getTime();
		for (let i = 0; i < this.schedule.length; i++) {
			if (this.schedule[i].startTime > dateTime) {
				return this.schedule[i].startDateJSON;
			}
		}

		return null;
	}
}

export = AvailabilityManager;