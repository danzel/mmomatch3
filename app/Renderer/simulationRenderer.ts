import CirclePingRenderer = require('./circlePingRenderer');
import FailedToSwapState = require('./failedToSwapState');
import GameEndDetector = require('../Simulation/Levels/gameEndDetector');
import GetToBottomHighlighter = require('./getToBottomHighlighter');
import InputApplier = require('../Simulation/inputApplier');
import Simulation = require('../Simulation/simulation');
import Matchable = require('../Simulation/matchable');
import MatchableRenderer = require('./matchableRenderer');
import RequireMatchHighlighter = require('./requireMatchHighlighter');
import SimulationParticleRenderer = require('./simulationParticleRenderer');
import SkinDef = require('./skinDef');
import Type = require('../Simulation/type');

interface XY {
	x: number;
	y: number;
}

class SimulationRenderer {
	private getToBottomHighlighter: GetToBottomHighlighter;
	private requireMatchHighlighter: RequireMatchHighlighter;
	private failedToSwapState = new FailedToSwapState();

	private matchableRenderer: MatchableRenderer;
	private simulationParticleRenderer: SimulationParticleRenderer;
	private circlePingRenderer: CirclePingRenderer;

	private outline: Phaser.Graphics;

	constructor(private simulation: Simulation, private gameEndDetector: GameEndDetector, public group: Phaser.Group, playerId: number, private skin: SkinDef) {
		this.group.game.stage.setBackgroundColor(skin.backgroundColor);

		let getToBottomUnder = group.game.add.group(group);

		let matchablesGroup = group.game.add.spriteBatch(this.group);
		let matchablesOverlay = group.game.add.group(this.group);
		this.matchableRenderer = new MatchableRenderer(matchablesGroup, matchablesOverlay, this.failedToSwapState, skin.skinName);

		this.simulationParticleRenderer = new SimulationParticleRenderer(group);
		this.simulationParticleRenderer.simulationChanged(simulation, playerId, skin.skinName);

		this.circlePingRenderer = new CirclePingRenderer(group.game.add.group(group), skin.skinName);
		this.getToBottomHighlighter = new GetToBottomHighlighter(getToBottomUnder, this.circlePingRenderer, skin.skinName);
		this.requireMatchHighlighter = new RequireMatchHighlighter(this.circlePingRenderer);

		this.scale = 0.2;
		this.group.y = 400;

		group.game.scale.onFullScreenChange.add(() => {
			//Game is quit while in full screen
			if (this.group.game) {
				this.keepOnScreen();
			}
		});

		this.updateOutline();
	}

	fitToBounds(width: number, height: number) {
		this.scale = this.scaleClamp(Math.min(width / this.simulation.grid.width, height / this.simulation.grid.height) / MatchableRenderer.PositionScalar);

		let scaledWidth = this.scale * this.simulation.grid.width * MatchableRenderer.PositionScalar;
		let scaledHeight = this.scale * this.simulation.grid.height * MatchableRenderer.PositionScalar;

		this.group.x = (width - scaledWidth) / 2;
		this.group.y = height - (height - scaledHeight) / 2;
	}

	failedToSwap(matchable: Matchable, direction: XY) {
		if (matchable) {
			this.failedToSwapState.failedToSwap(matchable, direction, this.group.game.time.now);
		}
	}

	translate(x: number, y: number) {
		this.group.x += x;
		this.group.y += y;

		this.keepOnScreen();
	}

	//x and y are in screen pixels
	zoomAt(x: number, y: number, scaleMultiplier: number) {
		let ourScale = this.scale;
		let newScale = this.scaleClamp(ourScale * scaleMultiplier);

		//translate y in to be relative to our position
		x -= this.group.x;
		y -= this.group.y;

		//flip because maths
		x = -x;
		y = -y;

		//Work our the magic amount to move ourselves so the place where the mouse is stays where it is
		let diffX = x / ourScale * (newScale - ourScale);
		let diffY = y / ourScale * (newScale - ourScale);

		//Move by that amount
		this.group.x += diffX;
		this.group.y += diffY;

		//Update scale
		this.scale = newScale;

		this.keepOnScreen();
	}

	private scaleClamp(scale: number): number {
		return Math.min(1.45, Math.max(0.2, scale));
	}

	private keepOnScreen() {
		let maxOffscreenX = this.group.game.width - 2 * MatchableRenderer.PositionScalar;
		let maxOffscreenY = this.group.game.height - 2 * MatchableRenderer.PositionScalar;

		let leftX = this.group.game.width - maxOffscreenX;
		let rightX = -this.simulation.grid.width * MatchableRenderer.PositionScalar * this.scale + maxOffscreenX;
		//Simulation won't fit, just center it
		if (rightX > leftX) {
			this.group.x = (this.group.game.width - this.simulation.grid.width * MatchableRenderer.PositionScalar * this.scale) / 2;
		} else {
			this.group.x = Math.min(leftX, this.group.x);
			this.group.x = Math.max(this.group.x, rightX);
		}

		let topY = this.group.game.height + this.simulation.grid.height * MatchableRenderer.PositionScalar * this.scale - maxOffscreenY
		let bottomY = maxOffscreenY;
		//Simulation won't fit, just center it
		if (topY < bottomY) {
			this.group.y = (this.group.game.height + this.simulation.grid.height * MatchableRenderer.PositionScalar * this.scale) / 2;
		} else {
			this.group.y = Math.min(topY, this.group.y);
			this.group.y = Math.max(maxOffscreenY, this.group.y);
		}
	}

	getPosition(): XY {
		return this.group;
	}

	getScale(): number {
		return this.group.scale.x;
	}

	private get scale(): number {
		return this.group.scale.x;
	}

	private set scale(scale: number) {
		this.group.scale = new Phaser.Point(scale, scale);
	}

	private updateOutline() {
		if (!this.outline) {
			this.outline = this.group.game.add.graphics(0, 0, this.group);
		} else {
			this.outline.clear();
		}
		this.outline.lineStyle(3, 0xFFFFFF, 0.7);
		this.outline.drawRect(0, 0, this.simulation.grid.width * MatchableRenderer.PositionScalar, -this.simulation.grid.height * MatchableRenderer.PositionScalar);
	}

	private left = [Phaser.Keyboard.LEFT, Phaser.Keyboard.A];
	private right = [Phaser.Keyboard.RIGHT, Phaser.Keyboard.D];
	private up = [Phaser.Keyboard.UP, Phaser.Keyboard.W];
	private down = [Phaser.Keyboard.DOWN, Phaser.Keyboard.S];

	private updateKeyboard(dt: number) {
		let keyboard = this.group.game.input.keyboard;
		let moveAmount = 1000 * dt;
		let anyKeyDown = false;

		if (this.left.some(k => keyboard.isDown(k))) {
			this.group.x += moveAmount;
			anyKeyDown = true;
		}
		if (this.right.some(k => keyboard.isDown(k))) {
			this.group.x -= moveAmount;
			anyKeyDown = true;
		}
		if (this.up.some(k => keyboard.isDown(k))) {
			this.group.y += moveAmount;
			anyKeyDown = true;
		}
		if (this.down.some(k => keyboard.isDown(k))) {
			this.group.y -= moveAmount;
			anyKeyDown = true;
		}

		if (anyKeyDown) {
			this.keepOnScreen();
		}
	}

	simulationChanged(simulation: Simulation, gameEndDetector: GameEndDetector, playerId: number, skin: SkinDef): void {
		this.simulation = simulation;
		this.gameEndDetector = gameEndDetector;

		this.simulationParticleRenderer.simulationChanged(simulation, playerId, skin.skinName);
		this.updateOutline();

		if (this.skin.skinName != skin.skinName) {
			this.matchableRenderer.changeSkin(skin.skinName);
			this.getToBottomHighlighter.changeSkin(skin.skinName);
		}
		if (this.skin.backgroundColor != this.group.game.stage.backgroundColor) {
			this.group.game.stage.setBackgroundColor(skin.backgroundColor);
		}
		this.skin = skin;
	}

	update(dt: number) {

		this.updateKeyboard(dt);


		this.circlePingRenderer.begin();
		this.matchableRenderer.begin(this.simulation.grid.width);
		this.getToBottomHighlighter.begin(this.gameEndDetector);

		this.requireMatchHighlighter.render(this.simulation.requireMatchInCellTracker);

		var swaps = this.simulation.swapHandler.swaps;

		let cells = this.simulation.grid.cells;
		for (let x = 0; x < cells.length; x++) {
			let col = cells[x];
			for (let y = 0; y < col.length; y++) {
				let m = col[y];
				if (!m.beingSwapped) {
					this.matchableRenderer.render(m, null);
				} else {
					for (let s = 0; s < swaps.length; s++) {
						let swap = swaps[s];
						if (swap.left == m || swap.right == m) {
							this.matchableRenderer.render(m, swap);
							break;
						}
					}
				}
				this.getToBottomHighlighter.render(m);
			}
		}

		this.matchableRenderer.end();
		this.getToBottomHighlighter.end();
		this.circlePingRenderer.end();

		this.failedToSwapState.update(dt);

		//Workaround for phaser #2826 
		this.group.updateTransform();
	}

}

export = SimulationRenderer;