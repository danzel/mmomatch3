import Detector = require('../Simulation/Levels/detector');
import DetectorDisplay = require('./SimParts/detectorDisplay');
import DetectorDisplayFactory = require('./SimParts/detectorDisplayFactory');
import EmoteInputDisplay = require('./SimParts/emoteInputDisplay');
import EmoteProxy = require('../Util/emoteProxy');
import EmoteRenderer = require('./SimParts/emoteRenderer');
import GameEndDetector = require('../Simulation/Levels/gameEndDetector');
import GameEndType = require('../Simulation/Levels/gameEndType');
import GameOverOverlay = require('./SimParts/gameOverOverlay');
import HtmlOverlayManager = require('../HtmlOverlay/manager')
import InitialZoomCalculator = require('./SimParts/initialZoomCalculator');
import InputApplier = require('../Simulation/inputApplier');
import InputHandler = require('../Input/inputHandler');
import InputRenderer = require('../Renderer/inputRenderer');
import Language = require('../Language');
import LevelDef = require('../Simulation/Levels/levelDef');
import LevelDetailsOverlay = require('./SimParts/levelDetailsOverlay');
import MatchableRenderer = require('../Renderer/matchableRenderer');
import PlayerCountRenderer = require('../Renderer/playerCountRenderer');
import PlayersOnSimulation = require('../Renderer/playersOnSimulation');
import PointsEarnedDisplay = require('./SimParts/pointsEarnedDisplay');
import RequireMatchRenderer = require('../Renderer/requireMatchRenderer');
import ScoreRenderer = require('../Renderer/scoreRenderer');
import Simulation = require('../Simulation/simulation');
import SimulationRenderer = require('../Renderer/simulationRenderer');
import SkinDef = require('../Renderer/skinDef');
import VictoryType = require('../Simulation/Levels/victoryType')

interface SimulationSceneConfiguration {
	/** If set game over screen counts down {?} -> 0, otherwise shows 'click to continue' */
	gameOverCountdown?: number;
}

class SimulationScene {
	private static renderer: SimulationRenderer;

	private playersOnSimulation: PlayersOnSimulation;
	private requireMatchRenderer: RequireMatchRenderer;
	private emoteRenderer: EmoteRenderer;

	private emoteInputDisplay: EmoteInputDisplay;
	private input: InputHandler;
	private inputRenderer: InputRenderer;

	private haveFitRenderer = false;
	private playerCountValue = 1;

	private initialZoomIn: () => void;

	scoreRenderer: ScoreRenderer;
	playerCountRenderer: PlayerCountRenderer;
	pointsEarnedDisplay: PointsEarnedDisplay;

	levelDetailsOverlay: LevelDetailsOverlay;
	gameOverOverlay: GameOverOverlay;

	detectorDisplays = new Array<DetectorDisplay>();


	constructor(private group: Phaser.Group, private htmlOverlayManager: HtmlOverlayManager, private level: LevelDef, private simulation: Simulation, inputApplier: InputApplier, gameEndDetector: GameEndDetector, emoteProxy: EmoteProxy, private config: SimulationSceneConfiguration, playerId: number, playerNames: { [id: number]: string }) {
		let skin = SkinDef.getForLevel(level);

		if (!SimulationScene.renderer) {
			SimulationScene.renderer = new SimulationRenderer(this.simulation, gameEndDetector, new Phaser.Group(group.game, group), playerId, skin);
		} else {
			SimulationScene.renderer.simulationChanged(simulation, gameEndDetector, playerId, skin);
			group.add(SimulationScene.renderer.group);
		}

		let simulationGroup = SimulationScene.renderer.group;

		this.playersOnSimulation = new PlayersOnSimulation(this.simulation, simulationGroup, playerId)
		this.emoteRenderer = new EmoteRenderer(simulationGroup);
		this.requireMatchRenderer = new RequireMatchRenderer(this.simulation, simulationGroup, skin.skinName);

		this.emoteInputDisplay = new EmoteInputDisplay(group, inputApplier, simulation.swapHandler, playerId);

		this.input = new InputHandler(group, SimulationScene.renderer, this.simulation, inputApplier);
		this.inputRenderer = new InputRenderer(group, this.input);

		this.levelDetailsOverlay = new LevelDetailsOverlay(htmlOverlayManager, level, gameEndDetector.victoryDetector, gameEndDetector.failureDetector);

		this.levelDetailsOverlay.becameClosed.on(() => {
			this.createVictoryConditionDisplay(gameEndDetector.victoryDetector);
			this.createFailureConditionDisplay(gameEndDetector.failureDetector);

			this.scoreRenderer = new ScoreRenderer(new Phaser.Group(group.game, group), this.simulation.scoreTracker, playerId, playerNames);
			this.playerCountRenderer = new PlayerCountRenderer(new Phaser.Group(group.game, group));
			this.playerCountRenderer.updateData(this.playerCountValue);

			this.pointsEarnedDisplay = new PointsEarnedDisplay(new Phaser.Group(group.game, group), simulation.scoreTracker, playerId);

			this.zoomToRandomLocation();
		});


		//Disable the displays (stop them updating) when the game ends
		gameEndDetector.gameEnded.on((gameEndType: GameEndType) => {
			for (let i = 0; i < this.detectorDisplays.length; i++) {
				this.detectorDisplays[i].disabled = true;
			}

			this.gameOverOverlay = new GameOverOverlay(htmlOverlayManager, this.group.game.time, gameEndType, config.gameOverCountdown, this.simulation.scoreTracker, playerId, this.playerCountValue, this.level);
		});

		emoteProxy.emoteTriggered.on((data) => {
			this.emoteRenderer.showEmote(data.emoteNumber, data.gridX, data.gridY);
		})
	}

	removeFromSimulationRenderer() {
		this.playersOnSimulation.removeFromSimulationRendererGroup();
		this.requireMatchRenderer.removeFromSimulationRendererGroup();
		this.emoteInputDisplay.destroy();
		SimulationScene.renderer.group.parent.removeChild(SimulationScene.renderer.group);
	}

	private zoomToRandomLocation() {
		let zoomPos = InitialZoomCalculator.getZoomInTarget(this.simulation, this.level);
		zoomPos.y = this.level.height - zoomPos.y;

		//Assume the SimulationRenderer just fit to screen (which it will have)
		//Calculate where the grid is
		let width = SimulationScene.renderer.getScale() * this.simulation.grid.width * MatchableRenderer.PositionScalar;
		let height = SimulationScene.renderer.getScale() * this.simulation.grid.height * MatchableRenderer.PositionScalar;

		let minX = (this.group.game.width - width) / 2;
		let minY = (this.group.game.height - height) / 2;

		zoomPos.x *= this.simulation.grid.width / (this.simulation.grid.width - 1);
		zoomPos.x -= this.simulation.grid.width / 2;
		zoomPos.x *= 1.1;
		zoomPos.x += this.simulation.grid.width / 2;

		zoomPos.y *= this.simulation.grid.height / (this.simulation.grid.height - 1);
		zoomPos.y -= this.simulation.grid.height / 2;
		zoomPos.y *= 1.1;
		zoomPos.y += this.simulation.grid.height / 2;

		let posX = minX + zoomPos.x * width / this.simulation.grid.width;
		let posY = minY + zoomPos.y * height / this.simulation.grid.height;
		console.log(minY, height, zoomPos.y * height / this.simulation.grid.height, posY);

		//Track if player changes the scale, cancel if they do
		let currentScale = SimulationScene.renderer.getScale();

		SimulationScene.renderer.zoomAt(posX, posY, 9);

		posY = 1200;
		let scaleAmount = 0.9988;
		setTimeout(() => {
			this.initialZoomIn = () => {
				//if (SimulationScene.renderer.getScale() > 0.4 || currentScale != SimulationScene.renderer.getScale()) {
				//	this.initialZoomIn = null;
				//	return;
				//}
				SimulationScene.renderer.zoomAt(posX, posY, scaleAmount);//Math.sqrt(Math.sqrt(Math.sqrt(Math.sqrt(0.405 / SimulationScene.renderer.getScale())))));
				scaleAmount *= 0.999998;
				currentScale = SimulationScene.renderer.getScale();
			};
		}, 3000)

		setTimeout(() => {
			let text = this.group.game.add.text(this.group.game.width / 2, 100, 'Massive Match', {
				font: 'Chewy',
				fontSize: 180,
				fill: 'white',
				strokeThickness: 16,

				boundsAlignH: 'center'
			}, this.group);
			text.setTextBounds(0, 0, 0, 0)

			text.alpha = 0;
			this.group.game.add.tween(text)
				.to({alpha: 1}, 1000, Phaser.Easing.Cubic.InOut)
				.start();
		}, 26*1000);
	}

	set playerCount(playerCount: number) {
		this.playerCountValue = playerCount;
		if (this.playerCountRenderer) {
			this.playerCountRenderer.updateData(playerCount);
		}
	}

	update(): void {
		if (!this.haveFitRenderer && this.group.game.width != 0) {
			SimulationScene.renderer.fitToBounds(this.group.game.width, this.group.game.height);
			this.haveFitRenderer = true;
		}
		if (this.initialZoomIn) {
			this.initialZoomIn();
		}

		if (this.scoreRenderer) {
			this.scoreRenderer.updateData()
		}
		if (this.pointsEarnedDisplay) {
			this.pointsEarnedDisplay.updatePosition();
		}
		if (this.gameOverOverlay) {
			this.gameOverOverlay.update();
		}
		this.playersOnSimulation.update();
		this.input.update();
		this.inputRenderer.update();
		this.emoteInputDisplay.update();
	}

	preRender(): void {
		SimulationScene.renderer.update(this.group.game.time.physicsElapsed);
	}
	
	createVictoryConditionDisplay(detector: Detector) {
		let group = new Phaser.Group(this.group.game, this.group);
		group.visible = false;
		group.x = 5;
		group.y = 22;
		this.detectorDisplays.push(DetectorDisplayFactory.createDisplay(group, detector));
	}

	createFailureConditionDisplay(detector: Detector) {
		let group = new Phaser.Group(this.group.game, this.group);
		group.visible = false;
		group.x = 5;
		group.y = 44;
		this.detectorDisplays.push(DetectorDisplayFactory.createDisplay(group, detector));
	}
}

export = SimulationScene;