import MagicNumbers = require('../Simulation/magicNumbers');
import OwnedMatch = require('../Simulation/Scoring/ownedMatch');
import MatchableRenderer = require('./matchableRenderer');
import Simulation = require('../Simulation/simulation');

class SimulationParticleRenderer {
	emitter: Phaser.Particles.Arcade.Emitter;
	constructor(parentGroup: Phaser.Group) {
		this.emitter = parentGroup.game.add.emitter(0, 0, 500);
		parentGroup.add(this.emitter);

		this.emitter.makeParticles('atlas', [
			'match-particles/1.png',
			'match-particles/2.png',
			'match-particles/3.png',
			'match-particles/4.png',
			'match-particles/5.png',
			'match-particles/6.png',
			'match-particles/7.png'
		]);
		this.emitter.gravity = 1000;
		this.emitter.setAlpha(1, 0, 6000, Phaser.Easing.Cubic.Out);
		this.emitter.setXSpeed(-300, 300);
		this.emitter.setYSpeed(-700, -100);
		this.emitter.setRotation(-60, 60);
		this.emitter.setSize(100, 100);
	}

	simulationChanged(simulation: Simulation, playerId: number) {
		simulation.comboOwnership.ownedMatchPerformed.on(m => {
			if (m.players.indexOf(playerId) >= 0) {
				this.ownedMatchPerformed(m)
			}
		});
	}

	private ownedMatchPerformed(match: OwnedMatch): void {
		match.match.matchables.forEach(m => {
			this.emitter.x = (m.x + 0.5) * MatchableRenderer.PositionScalar;
			this.emitter.y = -(m.y / MagicNumbers.matchableYScale + 0.5) * MatchableRenderer.PositionScalar;

			this.emitter.start(true, 2000, null, 10);
		})
	}


}
export = SimulationParticleRenderer;