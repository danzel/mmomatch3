import LiteEvent = require('../../liteEvent');

abstract class Detector {
	detected = new LiteEvent<void>();
	valueChanged = new LiteEvent<void>();
}

export = Detector;