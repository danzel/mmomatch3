import FrameData = require('../DataPackets/frameData');
import TickPoints = require('./tickPoints');


class TickData {
	framesElapsed: number;
	frameData: { [frame: number]: FrameData }

	playerCount: number;

	constructor(framesElapsed: number, frames: { [frame: number]: FrameData }) {
		this.framesElapsed = framesElapsed;
		this.frameData = frames;
	}
}

export = TickData;