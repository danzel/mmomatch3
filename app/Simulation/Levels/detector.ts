import LiteEvent = require('../../liteEvent');

abstract class Detector {
	detected = new LiteEvent<void>();
	valueChanged = new LiteEvent<void>();
	
	/** For the LevelDetailsOverlay */
	abstract getDetailsText(): string;
}

export = Detector;