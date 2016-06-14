import CirclePingRenderer = require('./circlePingRenderer');
import RequireMatchInCellTracker = require('../Simulation/requireMatchIncellTracker');

class RequireMatchHighlighter {
	constructor(private requireTracker: RequireMatchInCellTracker, private circlePingRenderer: CirclePingRenderer) {

	}

	render() {
		if (this.requireTracker.requirements.length > 5) {
			return;
		}

		this.requireTracker.requirements.forEach(r => {
			this.circlePingRenderer.show(r.x, r.y);
		})
	}
}

export = RequireMatchHighlighter;