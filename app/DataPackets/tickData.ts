import FrameData = require('../DataPackets/frameData');

class TickData {
	framesElapsed: number;
	frameData: { [frame: number]: FrameData}

		
	constructor(framesElapsed: number, frames: { [frame: number]: FrameData}) {
		this.framesElapsed = framesElapsed;
		this.frameData = frames;
	}
}

export = TickData;