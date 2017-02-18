import LiteEvent = require('../liteEvent');

class EmoteProxy {
	emoteTriggered = new LiteEvent<{emoteNumber: number, gridX: number, gridY: number}>();
}

export = EmoteProxy;