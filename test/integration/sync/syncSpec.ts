///<reference path="../../../typings/jasmine/jasmine.d.ts"/>
import BootData = require('../../../app/DataPackets/bootData');
import Client = require('../../../app/Client/client');
import ClientComms = require('../../../app/Client/clientComms');
import ClientSimulationHandler = require('../../../app/Client/clientSimulationHandler');
import LevelAndSimulationProvider = require('../../../app/Server/levelAndSimulationProvider');
import LevelDef = require('../../../app/Simulation/Levels/levelDef');
import PacketType = require('../../../app/DataPackets/packetType');
import Server = require('../../../app/Server/server');
import ServerComms = require('../../../app/Server/serverComms');
import Simulation = require('../../../app/Simulation/simulation');
import SwapClientData = require('../../../app/DataPackets/swapClientData');
import TestUtil = require('../../util/util');
import TickData = require('../../../app/DataPackets/tickData');

let dt = 1 / 60;

class FakeClientComms extends ClientComms {
	simulationHandler: ClientSimulationHandler;

	constructor(private id: string, private server: FakeServerComms) {
		super();
	}
	sendSwap(swapClientData: SwapClientData) {
		this.server.dataReceived.trigger({ id: this.id, packet: { packetType: PacketType.SwapClient, data: swapClientData } });
	}

	setClient(client: Client) {
		client.simulationReceived.on(data => {
			this.simulationHandler = new ClientSimulationHandler(data.level, data.simulation, client, this.server.tickRate);
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

	sendTick(tickData: TickData, ids: Array<string>) {
		for (let i = 0; i < ids.length; i++) {
			let id = ids[i];

			this.clientsLookup[id].dataReceived.trigger({ packetType: PacketType.Tick, data: tickData });
		}
	}

	sendBoot(bootData: BootData, id: string) {
		let client = this.clientsLookup[id];
		client.dataReceived.trigger({ packetType: PacketType.Boot, data: bootData });
	}

	addClient() {
		this.idCounter++;
		let id = '' + this.idCounter;
		let comms = new FakeClientComms(id, this);
		let client = new Client(comms);
		comms.setClient(client);

		this.clients.push(client);
		this.clientsLookup[id] = comms;

		this.connected.trigger(id);
	}

	update() {
		this.server.update(this.tickRate);

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
};

class TestLASProvider implements LevelAndSimulationProvider {
	constructor(private level: LevelDef, private simulation: Simulation) {
	}

	loadLevel(levelNumber: number): { level: LevelDef, simulation: Simulation } {
		return { level: this.level, simulation: this.simulation };
	}
};

describe('Sync.comboSync', () => {
    it('correctly syncs the current scores and ownership of columns for combos', () => {
		let serverComms = new FakeServerComms(1 / 10);
		let simulation = TestUtil.prepareForTest([
			"8218",
			"1122"
		]);
		let server = new Server(serverComms, new TestLASProvider(TestUtil.createNeverEndingLevel(4, 2), simulation));
		server.loadLevel(1);
		serverComms.server = server;

		serverComms.addClient();
		serverComms.update();
		serverComms.update();

		serverComms.clients[0].sendSwap(simulation.grid.cells[2][0].id, simulation.grid.cells[2][1].id);
		for (let i = 0; i < 40; i++) {
			serverComms.addClient();
			serverComms.update();
		}
		serverComms.update();
		serverComms.update();

		let points =
			1 * simulation.scoreTracker.pointsPerMatchable * 3 +
			2 * simulation.scoreTracker.pointsPerMatchable * 3;

		let simulations = serverComms.getAllSimulations();
		expect(simulations.length).toBe(42); //server + 1 + 40
		
		let score = 0;
		for (let i = 0; i < simulations.length; i++) {
			let sim = simulations[i];
			//console.log(i, sim.scoreTracker.points[1]);
			expect(sim.scoreTracker.points[1]).toBe(points);
			if (sim.scoreTracker.points[1] == points) {
				score++;
			}
			TestUtil.expectGridQuiet(sim);
		}
		
		console.log(score, '/', simulations.length);
	});
});