import Detector = require('../Simulation/Levels/detector');
import DetectorDisplay = require('./SimParts/detectorDisplay');
import DetectorDisplayFactory = require('./SimParts/detectorDisplayFactory');
import GameEndDetector = require('../Simulation/Levels/gameEndDetector');
import GameOverOverlay = require('./SimParts/gameOverOverlay');
import InputHandler = require('../Input/inputHandler');
import InputApplier = require('../Simulation/inputApplier');
import LevelDef = require('../Simulation/Levels/levelDef');
import LevelDetailsOverlay = require('./SimParts/levelDetailsOverlay');
import PlayerCountRenderer = require('../Renderer/playerCountRenderer');
import Scene = require('./scene');
import ScoreRenderer = require('../Renderer/scoreRenderer');
import Simulation = require('../Simulation/simulation');
import SimulationRenderer = require('../Renderer/simulationRenderer');

interface SimulationSceneConfiguration {
	/** If true updates run even when the levelDetailsOverlay is showing */
	alwaysRunUpdates?: boolean;
	
	/** If set  game over screen counts down {?} -> 0, otherwise shows 'click to continue' */
	gameOverCountdown?: number;
}

class SimulationScene implements Scene {
	private renderer: SimulationRenderer;
	private input: InputHandler;

	private haveFitRenderer = false;

	scoreRenderer: ScoreRenderer;
	playerCountRenderer: PlayerCountRenderer;

	levelDetailsOverlay: LevelDetailsOverlay;
	gameOverOverlay: GameOverOverlay;

	detectorDisplays = new Array<DetectorDisplay>();

	constructor(private group: Phaser.Group, private level: LevelDef, private simulation: Simulation, inputApplier: InputApplier, gameEndDetector: GameEndDetector, private config: SimulationSceneConfiguration) {
		this.renderer = new SimulationRenderer(group.game, this.simulation, new Phaser.Group(group.game, group));
		this.input = new InputHandler(group, this.renderer, this.simulation, inputApplier);

		this.scoreRenderer = new ScoreRenderer(new Phaser.Group(group.game, group));
		this.playerCountRenderer = new PlayerCountRenderer(new Phaser.Group(group.game, group));
		
		//TODO: Victory/Failure (gameEndDetector)
		this.createVictoryConditionDisplay(gameEndDetector.victoryDetector);
		this.createFailureConditionDisplay(gameEndDetector.failureDetector);

		this.levelDetailsOverlay = new LevelDetailsOverlay(new Phaser.Group(group.game, group), level, gameEndDetector.victoryDetector, gameEndDetector.failureDetector);

		//Disable the displays (stop them updating) when the game ends
		gameEndDetector.gameEnded.on((victory: boolean) => {
			for (let i = 0; i < this.detectorDisplays.length; i++) {
				this.detectorDisplays[i].disabled = true;
			}
			
			//TODO: How do we get the timer / click events out of here
			this.gameOverOverlay = new GameOverOverlay(new Phaser.Group(group.game, group), victory, config.gameOverCountdown);
		});
	}

	update(): void {
		this.levelDetailsOverlay.update();

		if (!this.haveFitRenderer && this.group.game.width != 0) {
			this.renderer.fitToBounds(this.group.game.width, this.group.game.height);
			this.haveFitRenderer = true;
		}

		if (this.gameOverOverlay) {
			this.gameOverOverlay.update();
		}

		if (this.config.alwaysRunUpdates || this.levelDetailsOverlay.closed) {
			this.simulation.update(this.group.game.time.physicsElapsed);
			this.renderer.update(this.group.game.time.physicsElapsed);
		}
	}


	createFailureConditionDisplay(detector: Detector) {
		let group = new Phaser.Group(this.group.game, this.group);
		group.y = 30;
		this.detectorDisplays.push(DetectorDisplayFactory.createDisplay(group, detector));
	}

	createVictoryConditionDisplay(detector: Detector) {
		let group = new Phaser.Group(this.group.game, this.group);
		group.y = 60;
		this.detectorDisplays.push(DetectorDisplayFactory.createDisplay(group, detector));
	}
}

export = SimulationScene;