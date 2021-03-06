import GameEndType = require('./gameEndType');
import LiteEvent = require('../../liteEvent');

abstract class Detector {
	detected = new LiteEvent<void>();
	valueChanged = new LiteEvent<void>();

	constructor(public gameEndType: GameEndType) {
	}

	/** For the LevelDetailsOverlay */
	abstract getDetailsText(): string;
	/** Perform an initial check after being constructed */
	abstract update(): void;
}

export = Detector;