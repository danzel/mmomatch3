import Matchable = require('../Simulation/matchable');
import MatchableNode = require('./matchableNode');

interface XY {
	x: number;
	y: number;
}

class Animation {
	lifeTime = 0;
	
	constructor(public matchable: Matchable, public matchableNode: MatchableNode, public direction: XY) {
	}
}

const totalAnimationTime = 0.3;

class FailedToSwapAnimator {
	animations = new Array<Animation>();
	
	private shouldShowAnimation(matchable: Matchable) {
		//Any of these mean there is something more important happening than showing this animation
		return !matchable.isDisappearing && !matchable.beingSwapped && matchable.yMomentum == 0;
	}

	failedToSwap(matchable: Matchable, matchableNode: MatchableNode, direction: XY) {
		if (!this.shouldShowAnimation(matchable)) {
			return;
		}
		
		this.animations.push(new Animation(matchable, matchableNode, direction));
		
		matchableNode.sprite.bringToTop();
		if (matchableNode.overlay) {
			matchableNode.overlay.bringToTop();
		}
	}
	
	private static easingFunction(p: number): number {
		return Math.sin(p * Math.PI * 2) * (1 - p * p);
	}

	update(dt: number) {
		
		for (let i = this.animations.length - 1; i >= 0; i--) {
			let a = this.animations[i];
			a.lifeTime += dt;

			if (!this.shouldShowAnimation(a.matchable) || a.lifeTime >= totalAnimationTime) {
				this.animations.splice(i, 1);
				continue;
			}
			
			let p = a.lifeTime / totalAnimationTime;
			let ease = FailedToSwapAnimator.easingFunction(p);
			a.matchableNode.sprite.position.x += a.direction.x * 0.5 * MatchableNode.PositionScalar * ease;
			a.matchableNode.sprite.position.y -= a.direction.y * 0.5 * MatchableNode.PositionScalar * ease;
		}
	}
}

export = FailedToSwapAnimator;