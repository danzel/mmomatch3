import Detector = require('../Simulation/Levels/detector');
import DetectorDisplay = require('./SimParts/detectorDisplay');
import DetectorDisplayFactory = require('./SimParts/detectorDisplayFactory');
import GameEndDetector = require('../Simulation/Levels/gameEndDetector');
import GameOverOverlay = require('./SimParts/gameOverOverlay');
import HtmlOverlayManager = require('../HtmlOverlay/manager')
import InputHandler = require('../Input/inputHandler');
import InputApplier = require('../Simulation/inputApplier');
import LevelDef = require('../Simulation/Levels/levelDef');
import LevelDetailsOverlay = require('./SimParts/levelDetailsOverlay');
import MatchableNode = require('../Renderer/matchableNode');
import PlayerCountRenderer = require('../Renderer/playerCountRenderer');
import PlayersOnSimulation = require('../Renderer/playersOnSimulation');
import RequireMatchRenderer = require('../Renderer/requireMatchRenderer');
import ScoreRenderer = require('../Renderer/scoreRenderer');
import Simulation = require('../Simulation/simulation');
import SimulationRenderer = require('../Renderer/simulationRenderer');

interface SimulationSceneConfiguration {
	/** If set game over screen counts down {?} -> 0, otherwise shows 'click to continue' */
	gameOverCountdown?: number;
}

class SimulationScene {
	private renderer: SimulationRenderer;
	private playersOnSimulation: PlayersOnSimulation;
	private requireMatchRenderer: RequireMatchRenderer;
	private input: InputHandler;

	private haveFitRenderer = false;
	private playerCountValue = 1;

	private initialZoomIn: () => void;

	scoreRenderer: ScoreRenderer;
	playerCountRenderer: PlayerCountRenderer;

	levelDetailsOverlay: LevelDetailsOverlay;
	gameOverOverlay: GameOverOverlay;

	detectorDisplays = new Array<DetectorDisplay>();


	constructor(private group: Phaser.Group, private htmlOverlayManager: HtmlOverlayManager, private level: LevelDef, private simulation: Simulation, inputApplier: InputApplier, gameEndDetector: GameEndDetector, private config: SimulationSceneConfiguration, playerId: number, endAvailabilityDate: Date) {
		let simulationGroup = new Phaser.Group(group.game, group);
		this.renderer = new SimulationRenderer(this.simulation, simulationGroup);
		this.playersOnSimulation = new PlayersOnSimulation(this.simulation, simulationGroup, playerId)
		this.requireMatchRenderer = new RequireMatchRenderer(this.simulation, simulationGroup);

		this.input = new InputHandler(group, this.renderer, this.simulation, inputApplier);

		this.levelDetailsOverlay = new LevelDetailsOverlay(htmlOverlayManager, level, gameEndDetector.victoryDetector, gameEndDetector.failureDetector);

		this.levelDetailsOverlay.becameClosed.on(() => {
			this.createLevelNumberDisplay();
			this.createVictoryConditionDisplay(gameEndDetector.victoryDetector);
			this.createFailureConditionDisplay(gameEndDetector.failureDetector);

			this.scoreRenderer = new ScoreRenderer(new Phaser.Group(group.game, group), this.simulation.scoreTracker, playerId);
			this.playerCountRenderer = new PlayerCountRenderer(new Phaser.Group(group.game, group), endAvailabilityDate);
			this.playerCountRenderer.updateData(this.playerCountValue);

			this.zoomToRandomLocation();
		});


		//Disable the displays (stop them updating) when the game ends
		gameEndDetector.gameEnded.on((victory: boolean) => {
			for (let i = 0; i < this.detectorDisplays.length; i++) {
				this.detectorDisplays[i].disabled = true;
			}

			//TODO: How do we get the timer / click events out of here
			this.gameOverOverlay = new GameOverOverlay(htmlOverlayManager, this.group.game.time, victory, config.gameOverCountdown, this.simulation.scoreTracker, playerId, this.playerCountValue);
		});
	}

	private zoomToRandomLocation() {
		let posX = this.group.game.width * Math.random();
		let posY = this.group.game.height * Math.random();

		//Track if player changes the scale, cancel if they do
		let currentScale = this.renderer.getScale();
		
		this.initialZoomIn = () => {
			if (this.renderer.getScale() > 0.4 || currentScale != this.renderer.getScale()) {
				this.initialZoomIn = null;
				return;
			}
			this.renderer.zoomAt(posX, posY, Math.sqrt(Math.sqrt(Math.sqrt(Math.sqrt(0.405 / this.renderer.getScale())))));
			currentScale = this.renderer.getScale();
		};
	}

	set playerCount(playerCount: number) {
		this.playerCountValue = playerCount;
		if (this.playerCountRenderer) {
			this.playerCountRenderer.updateData(playerCount);
		}
	}

	update(): void {
		if (!this.haveFitRenderer && this.group.game.width != 0) {
			this.renderer.fitToBounds(this.group.game.width, this.group.game.height);
			this.haveFitRenderer = true;
		}
		if (this.initialZoomIn) {
			this.initialZoomIn();
		}

		if (this.scoreRenderer) {
			this.scoreRenderer.updateData()
		}
		if (this.gameOverOverlay) {
			this.gameOverOverlay.update();
		}
		this.playersOnSimulation.update();
	}

	preRender(): void {
		this.renderer.update(this.group.game.time.physicsElapsed);
	}

	createLevelNumberDisplay() {
		this.group.game.add.text(5, 5, "Level " + this.level.levelNumber, {
			fill: 'white',
			font: 'Chewy',
			fontSize: 30,
			strokeThickness: 8
		}, this.group)
	}

	createVictoryConditionDisplay(detector: Detector) {
		let group = new Phaser.Group(this.group.game, this.group);
		group.x = 5;
		group.y = 40;
		this.detectorDisplays.push(DetectorDisplayFactory.createDisplay(group, detector));
	}

	createFailureConditionDisplay(detector: Detector) {
		let group = new Phaser.Group(this.group.game, this.group);
		group.x = 5;
		group.y = 70;
		this.detectorDisplays.push(DetectorDisplayFactory.createDisplay(group, detector));
	}
}

export = SimulationScene;