import Color = require('../Simulation/color');
import FailedToSwapState = require('./failedToSwapState');
import MagicNumbers = require('../Simulation/magicNumbers');
import Matchable = require('../Simulation/matchable');
import MatchableRendererSprites = require('./matchableRendererSprites');
import Swap = require('../Simulation/swap');
import SwapHandler = require('../Simulation/swapHandler');
import Type = require('../Simulation/type');
import TypeHelpers = require('../Simulation/typeHelpers');

const positionScalar = 100;
const xOffset = positionScalar / 2;
const yOffset = positionScalar / 2;

class MatchableRenderer {
	public static PositionScalar = positionScalar;

	sprites: MatchableRendererSprites;

	gridWidth = 0;

	constructor(private group: Phaser.SpriteBatch, overlayGroup: Phaser.Group, private failedToSwapState: FailedToSwapState) {
		this.sprites = new MatchableRendererSprites(group, overlayGroup);
	}

	begin(gridWidth: number): void {
		this.gridWidth = gridWidth;
		this.sprites.begin();
	}

	end(): void {
		this.sprites.end();
	}


	private static typeHasOverlay(type: Type): boolean {
		return type == Type.VerticalClearWhenMatched || type == Type.HorizontalClearWhenMatched || type == Type.AreaClear3x3WhenMatched;
	}

	private calculateGrowPulseScale(matchable: Matchable) {
		let x = Math.abs(matchable.x - (0.5 * this.gridWidth));
		let y = matchable.y / MagicNumbers.matchableYScale;

		let dist = Math.sqrt(x * x + y * y);
		return 0.9 + 0.2 * Phaser.Easing.Sinusoidal.InOut(this.bounce(1500, -dist * 200));
	}

	render(matchable: Matchable, swap: Swap): void {
		let sprite = this.sprites.getSprite(matchable.color, matchable.type);

		sprite.x = matchable.x * MatchableRenderer.PositionScalar + xOffset;
		sprite.y = - (matchable.y / MagicNumbers.matchableYScale) * MatchableRenderer.PositionScalar - yOffset;
		if (swap) {
			this.updatePositionForSwap(matchable, sprite, swap);
		}
		//TODO: Would be nice if these appeared on top
		let failTransform = this.failedToSwapState.getFailTransform(matchable);
		if (failTransform) {
			sprite.x += failTransform.x;
			sprite.y += failTransform.y;
		}

		if (matchable.transformTo && MatchableRenderer.typeHasOverlay(matchable.transformTo)) {
			sprite.alpha = 1;
		} else {
			sprite.alpha = 1 - matchable.disappearingPercent;
		}


		if (TypeHelpers.isGetToBottom(matchable.type)) {
			sprite.scale.set(0.9 + 0.2 * Phaser.Easing.Sinusoidal.InOut(this.bounce(1500)));
		} else if (matchable.type == Type.GrowOverGrid) {
			sprite.scale.set(this.calculateGrowPulseScale(matchable));
		}

		if (MatchableRenderer.typeHasOverlay(matchable.type)) {
			this.renderOverlay(matchable, matchable.type, sprite, sprite.alpha);
		} else if (matchable.transformTo) {
			if (MatchableRenderer.typeHasOverlay(matchable.transformTo)) {
				this.renderOverlay(matchable, matchable.transformTo, sprite, matchable.disappearingPercent);
			} else {
				let overlay = this.sprites.getSprite(Color.None, matchable.transformTo);
				overlay.position.x = sprite.position.x;
				overlay.position.y = sprite.position.y;
				overlay.alpha = 1 - sprite.alpha;

				if (matchable.transformTo == Type.GrowOverGrid) {
					overlay.scale.set(this.calculateGrowPulseScale(matchable));
				}
			}
		}
	}

	private updatePositionForSwap(matchable: Matchable, sprite: Phaser.Image, swap: Swap) {
		let otherMatchable = swap.left == matchable ? swap.right : swap.left;

		var diffX = otherMatchable.x - matchable.x;
		var diffY = otherMatchable.y - matchable.y;
		diffY = diffY == 0 ? 0 : diffY / Math.abs(diffY);

		let percent = swap.ticks / SwapHandler.TicksToSwap;
		sprite.position.x += diffX * percent * MatchableRenderer.PositionScalar;
		sprite.position.y -= diffY * percent * MatchableRenderer.PositionScalar;
	}

	private renderOverlay(matchable: Matchable, type: Type, sprite: Phaser.Image, alpha: number) {
		let frame: string;
		switch (type) {
			case Type.VerticalClearWhenMatched:
				frame = 'balloverlays/vertical.png';
				break;
			case Type.HorizontalClearWhenMatched:
				frame = 'balloverlays/horizontal.png';
				break;
			case Type.AreaClear3x3WhenMatched:
				frame = 'balloverlays/areaclear.png';
				break;
			default:
				throw new Error("Don't know how to renderOverlay for type " + Type[type])
		}

		let overlay = this.sprites.getOverlaySprite();
		overlay.frameName = frame;
		overlay.position.x = sprite.position.x;
		overlay.position.y = sprite.position.y;
		overlay.alpha = alpha;

		overlay.scale.set(1 - 0.05 * this.bounce(2000));
	}

	private bounce(period: number, nowOffset?: number): number {
		let now = ((this.group.game.time.now + (nowOffset || 0)) / period) % 1;
		return Phaser.Easing.Sinusoidal.InOut(now > 0.5 ? (1 - (now - 0.5) * 2) : now * 2);
	}
}

export = MatchableRenderer;