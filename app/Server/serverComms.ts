import BootData = require('../DataPackets/bootData');
import EmoteData = require('../DataPackets/emoteData');
import InitData = require('../DataPackets/initData');
import LiteEvent = require('../liteEvent');
import PacketType = require('../DataPackets/packetType');
import RejectData = require('../DataPackets/rejectData');
import SwapClientData = require('../DataPackets/swapClientData');
import TickData = require('../DataPackets/tickData');

abstract class ServerComms {
	connected = new LiteEvent<string>();
	disconnected = new LiteEvent<string>();
	dataReceived = new LiteEvent<{ id: string, packet: { packetType: PacketType, data: any } }>();

	warning = new LiteEvent<{ str: string, data?: any }>();

	abstract sendReject(rejectData: RejectData, id: string): void;
	abstract disconnect(id: string): void;

	abstract sendInit(initData: InitData, id: string): void;
	abstract sendBoot(bootData: BootData, ids: Array<string>): void;
	abstract sendTick(tickData: TickData, ids: Array<string>): void;
	abstract sendEmote(emoteData: EmoteData, ids: Array<string>): void;
}

export = ServerComms;