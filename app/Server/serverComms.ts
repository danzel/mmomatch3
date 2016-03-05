import BootData = require('../DataPackets/bootData');
import LiteEvent = require('../liteEvent');
import PacketType = require('../DataPackets/packetType');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');

abstract class ServerComms {
	connected = new LiteEvent<string>();
	disconnected = new LiteEvent<string>();
	dataReceived = new LiteEvent<{ id: string, packet: { packetType: PacketType, data: any }}>();

	abstract sendTick(tickData: TickData, ids: Array<string>): void;
	abstract sendBoot(bootData: BootData, id: string): void;
}

export = ServerComms;