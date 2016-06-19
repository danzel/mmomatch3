import dateformat = require('dateformat');
import Language = require('../Language');

class PlayerCountRenderer {
	textStyle: Phaser.PhaserTextStyle = {
		font: 'Chewy',
		fontSize: 22,
		fill: 'white',
		strokeThickness: 4,

		boundsAlignH: 'right'
	};

	background: Phaser.Graphics;
	text: Phaser.Text;

	constructor(private group: Phaser.Group, endAvailabilityDate: Date) {
		let yOffset = 0;
		if (endAvailabilityDate) {
			let formatted = dateformat(endAvailabilityDate, 'h:MM TT');
			let text2 = new Phaser.Text(this.group.game, -4, 4, "Server Closes: " + formatted, this.textStyle);
			text2.setTextBounds(0, 0, 0, 0)
			this.group.add(text2);

			yOffset = 26;
		}

		this.text = new Phaser.Text(this.group.game, -64, 4 + yOffset, "Players: ?", this.textStyle);
		this.text.setTextBounds(0, 0, 0, 0);
		this.group.add(this.text);

	}

	updateData(playerCount: number) {
		this.text.text = Language.t('players x', { num: playerCount });

		this.group.position.x = this.group.game.width - 4;
	}
}

export = PlayerCountRenderer;