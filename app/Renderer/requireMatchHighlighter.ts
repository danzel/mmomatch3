import CirclePingRenderer = require('./circlePingRenderer');
import RequireMatchInCellTracker = require('../Simulation/requireMatchIncellTracker');

class RequireMatchHighlighter {
	constructor(private circlePingRenderer: CirclePingRenderer) {

	}

	render(requireTracker: RequireMatchInCellTracker) {
		if (requireTracker.requirements.length > 5) {
			return;
		}

		requireTracker.requirements.forEach(r => {
			this.circlePingRenderer.show(r.x, r.y);
		})
	}
}

export = RequireMatchHighlighter;