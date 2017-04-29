import MagicNumbers = require('../Simulation/magicNumbers');
import OwnedMatch = require('../Simulation/Scoring/ownedMatch');
import MatchableRenderer = require('./matchableRenderer');
import Simulation = require('../Simulation/simulation');

class SimulationParticleRenderer {
	emitter: Phaser.Particles.Arcade.Emitter;
	currentSkin = 'invalid';

	constructor(parentGroup: Phaser.Group) {
		this.emitter = parentGroup.game.add.emitter(0, 0, 5000);
		parentGroup.add(this.emitter);

		this.emitter.gravity = 1000;
		this.emitter.setAlpha(0.9, 0, 4000, Phaser.Easing.Cubic.In);
		this.emitter.setXSpeed(-400, 400);
		this.emitter.setYSpeed(-900, -100);
		this.emitter.setRotation(-60, 60);
		this.emitter.setSize(100, 100);
		this.emitter.setScale(1, 0, 1, 0, 4000, Phaser.Easing.Cubic.In);
	}

	simulationChanged(simulation: Simulation, playerId: number, currentSkin: string) {
		simulation.comboOwnership.ownedMatchPerformed.on(m => {
			this.ownedMatchPerformed(m, m.players.indexOf(playerId) >= 0);
		});

		if (this.currentSkin != currentSkin) {
			this.emitter.makeParticles('atlas', [
				currentSkin + '/match-particles/1.png',
				currentSkin + '/match-particles/2.png',
				currentSkin + '/match-particles/3.png',
				currentSkin + '/match-particles/4.png',
				currentSkin + '/match-particles/5.png',
				currentSkin + '/match-particles/6.png',
				currentSkin + '/match-particles/7.png'
			]);
			this.currentSkin = currentSkin;
		}
	}

	private ownedMatchPerformed(match: OwnedMatch, ourMatch: boolean): void {
		match.match.matchables.forEach(m => {
			this.emitter.x = (m.x + 0.5) * MatchableRenderer.PositionScalar;
			this.emitter.y = -(m.y / MagicNumbers.matchableYScale + 0.5) * MatchableRenderer.PositionScalar;

			this.emitter.start(true, 2000, null, ourMatch ? 8 : 3);
		})
	}


}
export = SimulationParticleRenderer;