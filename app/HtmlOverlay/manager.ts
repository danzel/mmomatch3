import BannerAdManager = require('./bannerAdManager');
import Language = require('../Language');

declare function require(filename: string): string | ((data: {}) => string);
require('./template.css');
require('file-loader?name=favicon.ico!../../img/favicon.ico');
require('../../img/favicon.png');
require('file-loader?name=privacy_policy.txt!../../img/staticfiles/privacy_policy.txt');
require('file-loader?name=terms_of_service.txt!../../img/staticfiles/terms_of_service.txt');

var template = <(data: UIState) => string>require('./template.handlebars');
var feedbackTemplate = <(data: UIState) => string>require('./feedback.handlebars');
var closeSvg = require('../../img/ui/close.svg');
var matchable1 = require('../../img/game/skin-emojione-animals/balls/6.png');
var colorClear = require('../../img/game/skin-emojione-animals/balls/colorclear.png');
var vertical = require('../../img/game/skin-emojione-animals/balloverlays/vertical.png');
var areaclear = require('../../img/game/skin-emojione-animals/balloverlays/areaclear.png');

interface OverlayOptions {
	className: string;
	content: string;
	closeOnBackgroundClick: boolean;
	closedCallback?: () => void;
	postRenderCallback?: (element: HTMLElement) => void;
	showBannerAd?: boolean
}

class UIState {
	get overlayVisible() {
		return this.helpVisible || this.customOverlay;
	}
	menuVisible = false;
	helpVisible = false;
	feedbackVisible = false;
	connectionErrorVisible = false;
	bottomAdVisible = false;

	customOverlay: OverlayOptions;

	closeSrc = closeSvg;
	matchable1Src = matchable1;
	colorClearSrc = colorClear;
	verticalSrc = vertical;
	areaclearSrc = areaclear;

	_controls = Language.t('controls');
	_helpline1 = Language.t('helpline1');
	_helpline2 = Language.t('helpline2');
	_helpline3 = Language.t('helpline3');
	_helpline4 = Language.t('helpline4');
	_helpline5 = Language.t('helpline5');
	_helpline6 = Language.t('helpline6');
	_specialmatches = Language.t('special matches');
	_clearsinaline = Language.t('clears in a line');
	_clearsarea = Language.t('clears area');
	_clearsanimal = Language.t('clears animal');
	_connecting = Language.t('connecting');
	_connectingrefresh = Language.t('connecting refresh');
}

class Manager {
	element: HTMLElement;
	feedbackElement: HTMLElement;
	uiState = new UIState();

	private feedbackVisible = false;

	constructor(private game: Phaser.Game, private bannerAdManager: BannerAdManager) {
		this.game.scale.fullScreenTarget = document.documentElement;
		this.element = document.getElementById('overlay');
		this.feedbackElement = document.getElementById('feedback-overlay');

		this.render();

		this.init();
	}

	private init() {
		let btns = document.getElementById('bottom-corner-buttons');
		btns.style.display = 'block';

		document.getElementById("help").addEventListener('click', (ev) => {
			ev.preventDefault();
			this.uiState.helpVisible = !this.uiState.helpVisible;
			this.render();
			this.hideMenu();
		});
		document.getElementById("feedback").addEventListener('click', (ev) => {
			ev.preventDefault();
			this.uiState.feedbackVisible = true;
			this.render();
			this.hideMenu();
		});
		let fsb = document.getElementById("fullscreen");
		fsb.addEventListener('click', (ev) => {
			ev.preventDefault();
			if (this.game.scale.isFullScreen) {
				this.game.scale.stopFullScreen();
			} else {
				this.game.scale.startFullScreen(false);
			}
			this.hideMenu();
		});
		if (!(<any>this.game.device).fullscreen) {
			fsb.parentNode.removeChild(fsb);
		}

		document.getElementById('menu-button').addEventListener('click', (ev) => {
			ev.preventDefault();
			this.uiState.menuVisible = !this.uiState.menuVisible;
			document.getElementById('bcb-content').style.display = this.uiState.menuVisible ? 'block' : 'none';
		})


		let toRemove = document.getElementById('beta-bg');
		toRemove.parentElement.removeChild(toRemove);

		toRemove = document.getElementById('beta');
		toRemove.parentElement.removeChild(toRemove);
	}

	hideMenu() {
		this.uiState.menuVisible = false;
		document.getElementById('bcb-content').style.display = 'none';
	}

	showOverlay(overlayOptions: OverlayOptions) {
		this.uiState.customOverlay = overlayOptions;

		this.render();
	}

	hideOverlay() {
		this.uiState.customOverlay = null;
		this.render();
	}

	setConnectionError(showError: boolean) {
		this.uiState.connectionErrorVisible = showError;
		this.render();
	}

	render() {
		this.element.innerHTML = template(this.uiState);

		if (this.feedbackVisible != this.uiState.feedbackVisible) {
			this.feedbackVisible = this.uiState.feedbackVisible;
			this.feedbackElement.innerHTML = feedbackTemplate(this.uiState);

			this.addEventHandlers(this.feedbackElement, false);
		}
		if (this.uiState.bottomAdVisible != (this.uiState.customOverlay && this.uiState.customOverlay.showBannerAd || false)) {
			this.uiState.bottomAdVisible = (this.uiState.customOverlay && this.uiState.customOverlay.showBannerAd || false);
			if (this.uiState.bottomAdVisible) {
				this.bannerAdManager.show();
			} else {
				this.bannerAdManager.hide()
			}
		}
		if (this.uiState.customOverlay && this.uiState.customOverlay.postRenderCallback) {
			this.uiState.customOverlay.postRenderCallback(document.getElementById('overlay'));
		}
		this.addEventHandlers(this.element, this.uiState.helpVisible || (this.uiState.customOverlay && this.uiState.customOverlay.closeOnBackgroundClick));
	}

	private addEventHandlers(element: HTMLElement, closeOnBackgroundClick: boolean) {

		if (closeOnBackgroundClick) {
			let overlay = element.getElementsByClassName("overlay-background")[0];
			overlay.addEventListener('click', () => this.closeOverlays());
		}
		let closeButton = element.getElementsByClassName("close-button")[0];
		if (closeButton) {
			closeButton.addEventListener('click', () => this.closeOverlays());
		}

	}

	private closeOverlays() {
		if (this.uiState.feedbackVisible) {
			this.uiState.feedbackVisible = false;
		} else if (this.uiState.helpVisible) {
			this.uiState.helpVisible = false;
		} else if (this.uiState.customOverlay) {
			let closedCallback = this.uiState.customOverlay.closedCallback;
			this.uiState.customOverlay = null;
			if (closedCallback) {
				closedCallback();
			}
		}
		this.render();
	}
}

export = Manager;