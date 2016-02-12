class PlayerCountRenderer {
	textStyle: Phaser.PhaserTextStyle = {
		fill: 'white',
		fontSize: 16,
		boundsAlignH: 'right'
	};

	background: Phaser.Graphics;
	text: Phaser.Text;

	constructor(private group: Phaser.Group) {
		this.background = new Phaser.Graphics(this.group.game);
		this.background.beginFill(0x000000, 0.5);
		this.background.drawRect(0, 0, 1, 1);
		this.background.endFill();
		this.background.scale.y = 16 + 8;

		group.add(this.background);
		this.text = new Phaser.Text(this.group.game, -2, 2, "Players: ?", this.textStyle);
		this.text.setTextBounds(0, 0, 0, 0);
		this.group.add(this.text);
	}
	
	updateData(playerCount: number) {
		this.text.text = "Players: " + playerCount;
		
		this.background.scale.x = -this.text.width - 4;
		
		this.group.position.x = this.group.game.width;
	}
}

export = PlayerCountRenderer;