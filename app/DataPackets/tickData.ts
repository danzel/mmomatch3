import FrameData = require('../DataPackets/frameData');
import TickPoints = require('./tickPoints');


class TickData {
	playerCount: number;
	/** Names of all players that joined during this tick */
	names: { [id: number]: string }

	constructor(public framesElapsed: number, public frameData: { [frame: number]: FrameData }) {
	}
}

export = TickData;