import GetThingToBottomDetector = require('../../../Simulation/Levels/Detectors/getThingToBottomDetector');
import DetectorDisplay = require('../detectorDisplay');

class MatchesDisplay extends DetectorDisplay {
	constructor(private group: Phaser.Group, private detector: GetThingToBottomDetector) {
		super();
		let text = new Phaser.Text(group.game, 0, 0, "Get the thing to the bottom", {
			fill: 'white'
		});
		this.group.add(text);
	}
}

export = MatchesDisplay;