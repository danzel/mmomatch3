import Detector = require('../Simulation/Levels/detector');
import DetectorDisplayFactory = require('./SimParts/detectorDisplayFactory');
import GameEndDetector = require('../Simulation/Levels/gameEndDetector');
import InputHandler = require('../Input/inputHandler');
import InputApplier = require('../Simulation/inputApplier');
import LevelDef = require('../Simulation/Levels/levelDef');
import LevelDetailsOverlay = require('./SimParts/levelDetailsOverlay');
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
	
	levelDetailsOverlay: LevelDetailsOverlay;
	
	constructor(private group: Phaser.Group, private level: LevelDef, private simulation: Simulation, inputApplier: InputApplier, gameEndDetector: GameEndDetector, private alwaysRunUpdates: boolean) {
		this.renderer = new SimulationRenderer(group.game, this.simulation, new Phaser.Group(group.game, group));
		this.input = new InputHandler(group, this.renderer, this.simulation, inputApplier);
		
		this.scoreRenderer = new ScoreRenderer(new Phaser.Group(group.game, group));
		this.playerCountRenderer = new PlayerCountRenderer(new Phaser.Group(group.game, group));
		
		//TODO: Victory/Failure (gameEndDetector)
		this.createVictoryConditionDisplay(gameEndDetector.victoryDetector);
		this.createFailureConditionDisplay(gameEndDetector.failureDetector);
		
		this.levelDetailsOverlay = new LevelDetailsOverlay(new Phaser.Group(group.game, group), level);
	}
	
	update(): void {
		this.levelDetailsOverlay.update();
		
		if (this.alwaysRunUpdates || this.levelDetailsOverlay.closed) {
			this.simulation.update(this.group.game.time.physicsElapsed);
			this.renderer.update(this.group.game.time.physicsElapsed);
		}
	}
	
	
	createFailureConditionDisplay(detector: Detector) {
		let group = new Phaser.Group(this.group.game, this.group);
		group.y = 30;
		DetectorDisplayFactory.createDisplay(group, detector);
	}

	createVictoryConditionDisplay(detector: Detector) {
		let group = new Phaser.Group(this.group.game, this.group);
		group.y = 60;
		DetectorDisplayFactory.createDisplay(group, detector);
	}
}

export = SimulationScene;