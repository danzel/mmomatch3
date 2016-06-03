import Matchable = require('../Simulation/matchable');
import MatchableRenderer = require('./matchableRenderer');

interface XY {
	x: number;
	y: number;
}

class Animation {
	lifeTime = 0;

	constructor(public matchableId: number, public direction: XY) {
	}
}

const totalAnimationTime = 0.3;

class FailedToSwapAnimator {
	animations = new Array<Animation>();

	private shouldShowAnimation(matchable: Matchable) {
		//Any of these mean there is something more important happening than showing this animation
		return !matchable.isDisappearing && !matchable.beingSwapped && matchable.yMomentum == 0;
	}

	failedToSwap(matchable: Matchable, direction: XY, now: number) {
		if (!this.shouldShowAnimation(matchable)) {
			return;
		}

		this.animations.push(new Animation(matchable.id, direction));
	}

	private static easingFunction(p: number): number {
		return Math.sin(p * Math.PI * 2) * (1 - p * p);
	}

	update(dt: number) {
		for (let i = this.animations.length - 1; i >= 0; i--) {
			let a = this.animations[i];
			a.lifeTime += dt;

			if (a.lifeTime >= totalAnimationTime) {
				this.animations.splice(i, 1);
				continue;
			}
		}
	}

	getFailTransform(matchable: Matchable): XY {
		for (let i = 0; i < this.animations.length; i++) {
			let a = this.animations[i];
			if (a.matchableId == matchable.id) {
				if (!this.shouldShowAnimation(matchable)) {
					this.animations.splice(i, 1);
					return null;
				}

				let p = a.lifeTime / totalAnimationTime;
				let ease = FailedToSwapAnimator.easingFunction(p);
				return {
					x: a.direction.x * 0.5 * MatchableRenderer.PositionScalar * ease,
					y: - a.direction.y * 0.5 * MatchableRenderer.PositionScalar * ease
				};
			}
		}

		return null;
	}
}

export = FailedToSwapAnimator;