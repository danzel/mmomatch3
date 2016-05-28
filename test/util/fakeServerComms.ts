import BootData = require('../../app/DataPackets/bootData');
import Client = require('../../app/Client/client');
import ClientComms = require('../../app/Client/clientComms');
import ClientSimulationHandler = require('../../app/Client/clientSimulationHandler');
import GameEndDetector = require('../../app/Simulation/Levels/gameEndDetector');
import InitData = require('../../app/DataPackets/initData');
import JoinData = require('../../app/DataPackets/joinData');
import PacketType = require('../../app/DataPackets/packetType');
import Server = require('../../app/Server/server');
import ServerComms = require('../../app/Server/serverComms');
import Simulation = require('../../app/Simulation/simulation');
import SwapClientData = require('../../app/DataPackets/swapClientData');
import RejectData = require('../../app/DataPackets/rejectData');
import TickData = require('../../app/DataPackets/tickData');
import UnavailableData = require('../../app/DataPackets/unavailableData');

class FakeClientComms extends ClientComms {
	simulationHandler: ClientSimulationHandler;

	constructor(private id: string, private server: FakeServerComms) {
		super();
	}

	sendJoin(joinData: JoinData): void {
		this.server.dataReceived.trigger({ id: this.id, packet: { packetType: PacketType.Join, data: joinData } });
	}

	sendSwap(swapClientData: SwapClientData) {
		this.server.dataReceived.trigger({ id: this.id, packet: { packetType: PacketType.SwapClient, data: swapClientData } });
	}

	setClient(client: Client) {
		client.simulationReceived.on(data => {
			this.simulationHandler = new ClientSimulationHandler(data.level, data.simulation, data.gameEndDetector, client, this.server.tickRate);
		});
		client.tickReceived.on(data => {
			this.simulationHandler.tickReceived(data);
		})
	}

	update() {
		if (this.simulationHandler) {
			this.simulationHandler.update();
		}
	}
}

class FakeServerComms extends ServerComms {
	private idCounter = 0;
	server: Server;
	clients = new Array<Client>();
	clientsLookup: { [id: string]: FakeClientComms } = {};

	constructor(public tickRate: number) {
		super();
	}

	sendReject(rejectData: RejectData, id: string): void {
		throw new Error("FakeServerComms doesnt know how to send reject");
	}
	disconnect(id: string): void {
		throw new Error("FakeServerComms doesnt know how to disconnect");
	}

	sendInit(initData: InitData, id: string): void {
		let client = this.clientsLookup[id];
		client.dataReceived.trigger({ packetType: PacketType.Init, data: initData });
	}

	sendBoot(bootData: BootData, ids: Array<string>) {
		ids.forEach(id => {
			let client = this.clientsLookup[id];
			client.dataReceived.trigger({ packetType: PacketType.Boot, data: bootData });
		});
	}

	sendTick(tickData: TickData, ids: Array<string>) {
		ids.forEach(id => {
			this.clientsLookup[id].dataReceived.trigger({ packetType: PacketType.Tick, data: tickData });
		});
	}

	sendUnavailable(unavailableData: UnavailableData, id?: string) {
		if (id) {
			this.clientsLookup[id].dataReceived.trigger({ packetType: PacketType.Unavailable, data: unavailableData });
		} else {
			for (let i in this.clientsLookup) {
				this.clientsLookup[i].dataReceived.trigger({ packetType: PacketType.Unavailable, data: unavailableData });
			}
		}
	}

	addClient() {
		this.idCounter++;
		let id = '' + this.idCounter;
		let comms = new FakeClientComms(id, this);
		let client = new Client(comms, '');
		comms.setClient(client);

		this.clients.push(client);
		this.clientsLookup[id] = comms;

		this.connected.trigger(id);
		comms.connected.trigger();
	}

	update() {
		this.server.update();

		Object.keys(this.clientsLookup).forEach(key => {
			this.clientsLookup[key].update();
		})
	}

	getAllSimulations(): Array<Simulation> {
		let res = new Array<Simulation>();

		res.push((<any>this.server).simulation)

		Object.keys(this.clientsLookup).forEach(key => {
			let handler = this.clientsLookup[key].simulationHandler;
			if (handler) {
				res.push(handler.simulation);
			}
		})

		return res;
	}

	getAllGameEndDetectors(): Array<GameEndDetector> {
		let res = new Array<GameEndDetector>();

		res.push((<any>this.server).gameEndDetector)

		Object.keys(this.clientsLookup).forEach(key => {
			let handler = this.clientsLookup[key].simulationHandler;
			if (handler) {
				res.push(handler.gameEndDetector);
			}
		})

		return res;
	}

	flushClients() {
		Object.keys(this.clientsLookup).forEach(key => {
			for (var i = 0; i < 10; i++) {
				this.clientsLookup[key].update();
			}
		});
	}
};

export = FakeServerComms