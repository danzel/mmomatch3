import BootData = require('../DataPackets/bootData');
import InitData = require('../DataPackets/initData');
import LiteEvent = require('../liteEvent');
import PacketType = require('../DataPackets/packetType');
import RejectData = require('../DataPackets/rejectData');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');
import UnavailableData = require('../DataPackets/unavailableData');

abstract class ServerComms {
	connected = new LiteEvent<string>();
	disconnected = new LiteEvent<string>();
	dataReceived = new LiteEvent<{ id: string, packet: { packetType: PacketType, data: any } }>();

	abstract sendReject(rejectData: RejectData, id: string): void;
	abstract disconnect(id: string): void;

	abstract sendInit(initData: InitData, id: string): void;
	abstract sendBoot(bootData: BootData, ids: Array<string>): void;
	abstract sendTick(tickData: TickData, ids: Array<string>): void;
	abstract sendUnavailable(unavailableData: UnavailableData, id?: string): void;
}

export = ServerComms;