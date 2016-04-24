/// <reference path="../../../typings/dateformat/dateformat.d.ts" />
import dateformat = require('dateformat');
import HtmlOverlayManager = require('../../HtmlOverlay/manager')

declare function require(filename: string): (data: {}) => string;
var template = <(data: {}) => string>require('./unavailableOverlay.handlebars');
require('./unavailableOverlay.css');

class UnavailableOverlay {
	hasPlayed = false;
	private visible = false;

	constructor(private overlayManager: HtmlOverlayManager) {
	}

	show(dateString?: string): void {
		this.visible = true;
		this.overlayManager.showOverlay('frame unavailable-overlay', template({
			hasNext: !!dateString,
			next: dateformat(new Date(dateString), 'dddd dS mmmm h:MM TT'),
			gameRecently: this.hasPlayed
		}), { closeOnBackgroundClick: false });
	}

	hide(): void {
		if (this.visible) {
			this.overlayManager.hideOverlay();
			this.visible = false;
		}
	}
}

export = UnavailableOverlay;