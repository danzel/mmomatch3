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
import PlayersOnSimulation = require('../Renderer/playersOnSimulation');
import Scene = require('./scene');
import ScoreRenderer = require('../Renderer/scoreRenderer');
import Simulation = require('../Simulation/simulation');
import SimulationRenderer = require('../Renderer/simulationRenderer');

interface SimulationSceneConfiguration {
	/** If true we update the simulation, otherwise it is controlled externally */
	inChargeOfSimulation?: boolean;
	
	/** If set  game over screen counts down {?} -> 0, otherwise shows 'click to continue' */
	gameOverCountdown?: number;
}

class SimulationScene implements Scene {
	private renderer: SimulationRenderer;
	private playersOnSimulation: PlayersOnSimulation;
	private input: InputHandler;

	private haveFitRenderer = false;

	scoreRenderer: ScoreRenderer;
	playerCountRenderer: PlayerCountRenderer;

	levelDetailsOverlay: LevelDetailsOverlay;
	gameOverOverlay: GameOverOverlay;

	detectorDisplays = new Array<DetectorDisplay>();

	constructor(private group: Phaser.Group, private level: LevelDef, private simulation: Simulation, inputApplier: InputApplier, gameEndDetector: GameEndDetector, private config: SimulationSceneConfiguration, playerId: number) {
		let simulationGroup = new Phaser.Group(group.game, group);
		this.renderer = new SimulationRenderer(this.simulation, simulationGroup);
		this.playersOnSimulation = new PlayersOnSimulation(this.simulation, simulationGroup, playerId)
		
		this.input = new InputHandler(group, this.renderer, this.simulation, inputApplier);

		this.scoreRenderer = new ScoreRenderer(new Phaser.Group(group.game, group), this.simulation.scoreTracker, playerId);
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
		
		this.scoreRenderer.updateData()

		if (this.gameOverOverlay) {
			this.gameOverOverlay.update();
		}

		if (this.config.inChargeOfSimulation && this.levelDetailsOverlay.closed) {
			this.simulation.update();
		}
		this.renderer.update(this.group.game.time.physicsElapsed);
		this.playersOnSimulation.update();
	}


	createFailureConditionDisplay(detector: Detector) {
		let group = new Phaser.Group(this.group.game, this.group);
		group.x = 130;
		this.detectorDisplays.push(DetectorDisplayFactory.createDisplay(group, detector));
	}

	createVictoryConditionDisplay(detector: Detector) {
		let group = new Phaser.Group(this.group.game, this.group);
		group.x = 130;
		group.y = 30;
		this.detectorDisplays.push(DetectorDisplayFactory.createDisplay(group, detector));
	}
}

export = SimulationScene;