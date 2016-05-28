import HtmlOverlayManager = require('../manager');

declare function require(filename: string): (() => string);
var template = require('./newVersion.handlebars');
require('./newVersion.css');

class NewVersion {
	static show(manager: HtmlOverlayManager) {
		manager.showOverlay({
			className: 'new-version',
			closeOnBackgroundClick: false,
			content: template()
		})
		setTimeout(() => {
			window.location.reload(true);
		}, 20 * 1000)
	}
}

export = NewVersion;