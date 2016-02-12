import InputHandler = require('../Input/inputHandler');
import InputApplier = require('../Simulation/inputApplier');
import LevelDef = require('../Simulation/Levels/levelDef');
import PlayerCountRenderer = require('../Renderer/playerCountRenderer');
import Scene = require('./scene');
import ScoreRenderer = require('../Renderer/scoreRenderer');
import Simulation = require('../Simulation/simulation');
import SimulationRenderer = require('../Renderer/simulationRenderer');

class SimulationScene implements Scene {
	private renderer: SimulationRenderer;
	private input: InputHandler;

	scoreRenderer: ScoreRenderer;
	playerCountRenderer: PlayerCountRenderer;
	
	constructor(private group: Phaser.Group, private level: LevelDef, private simulation: Simulation, inputApplier: InputApplier) {
		this.renderer = new SimulationRenderer(this.group.game, this.simulation, new Phaser.Group(this.group.game, this.group));
		this.input = new InputHandler(this.group.game, this.renderer, this.simulation, inputApplier);
		
		this.scoreRenderer = new ScoreRenderer(new Phaser.Group(this.group.game, this.group));
		this.playerCountRenderer = new PlayerCountRenderer(new Phaser.Group(this.group.game, this.group));
	}
	
	update(): void {
		this.simulation.update(this.group.game.time.physicsElapsed);
		this.renderer.update(this.group.game.time.physicsElapsed);
	}
}

export = SimulationScene;