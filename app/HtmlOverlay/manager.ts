import BannerAdManager = require('./bannerAdManager');
import Language = require('../Language');

declare function require(filename: string): string | ((data: {}) => string);
var template = <(data: UIState) => string>require('./template.handlebars');
var feedbackTemplate = <(data: UIState) => string>require('./feedback.handlebars');
require('./template.css');
var closeSvg = require('file-loader?name=close.svg?[hash:6]!../../img/ui/close.svg');
var fullscreenSvg = require('file-loader?name=fullscreen.svg?[hash:6]!../../img/ui/fullscreen.svg');
var matchable1 = require('file-loader?name=pig.png?[hash:6]!../../img/skin/emojione-animals/balls/6.png');
var colorClear = require('file-loader?name=cc.png?[hash:6]!../../img/skin/emojione-animals/balls/colorclear.png');
var vertical = require('file-loader?name=oh.png?[hash:6]!../../img/skin/emojione-animals/balloverlays/vertical.png');
var areaclear = require('file-loader?name=ac.png?[hash:6]!../../img/skin/emojione-animals/balloverlays/areaclear.png');

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

		document.getElementById("help-button").addEventListener('click', () => {
			this.uiState.helpVisible = !this.uiState.helpVisible;
			this.render();
		});
		document.getElementById("feedback-button").addEventListener('click', () => {
			this.uiState.feedbackVisible = true;
			this.render();
		});
		let fsb = document.getElementById("fullscreen-button");
		fsb.addEventListener('click', () => {
			if (this.game.scale.isFullScreen) {
				this.game.scale.stopFullScreen();
			} else {
				this.game.scale.startFullScreen(false);
			}
		});
		if (!(<any>this.game.device).fullscreen) {
			fsb.parentNode.removeChild(fsb);
		}
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