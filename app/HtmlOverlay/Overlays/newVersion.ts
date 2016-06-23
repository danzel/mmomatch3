import HtmlOverlayManager = require('../manager');
import Language = require('../../Language');

declare function require(filename: string): ((params: any) => string);
var template = require('./newVersion.handlebars');
require('./newVersion.css');

class NewVersion {
	static show(manager: HtmlOverlayManager) {
		manager.showOverlay({
			className: 'new-version',
			closeOnBackgroundClick: false,
			content: template({
				'_heading': Language.t('newversion'),
				'_line1': Language.t('newversion1'),
				'_line2': Language.t('newversion2'),
				'_line3': Language.t('newversion3'),
			})
		})
		setTimeout(() => {
			window.location.reload(true);
		}, 20 * 1000)
	}
}

export = NewVersion;