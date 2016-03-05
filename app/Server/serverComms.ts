import BootData = require('../DataPackets/bootData');
import LiteEvent = require('../liteEvent');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');

abstract class ServerComms {
	connected = new LiteEvent<string>();
	disconnected = new LiteEvent<string>();
	swapReceived = new LiteEvent<{ id: string, swap: SwapClientData }>();

	abstract sendTick(tickData: TickData, ids: Array<string>): void;
	abstract sendBoot(bootData: BootData, id: string): void;
}

export = ServerComms;