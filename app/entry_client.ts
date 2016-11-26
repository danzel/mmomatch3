import Raven = require('raven-js');

import BannerAdManager = require('./HtmlOverlay/bannerAdManager');
import CircleCursor = require('./Scenes/circleCursor');
import Client = require('./Client/client');
import ClientSimulationHandler = require('./Client/clientSimulationHandler');
import DebugLogger = require('./debugLogger');
import GameEndDetector = require('./Simulation/Levels/gameEndDetector');
import GoodBrowser = require('./goodBrowser');
import GraphicsLoader = require('./Renderer/graphicsLoader');
import HtmlOverlayManager = require('./HtmlOverlay/manager')
import HtmlTranslator = require('./Language/htmlTranslator');
import Language = require('./Language');
import LevelDef = require('./Simulation/Levels/levelDef');
import NewVersion = require('./HtmlOverlay/Overlays/newVersion');
import Serializer = require('./Serializer/simple');
import Simulation = require('./Simulation/simulation');
import SimulationScene = require('./Scenes/simulationScene');
import SocketClient = require('./Client/socketClient');
import TickData = require('./DataPackets/tickData');
import WelcomeScreen = require('./Scenes/WelcomeScreen/welcomeScreen');

let runningOnLive = (window.location.host == window.location.hostname); //Checks we are on standard port (no :8080)
let release = '';
let lastUpdateFailed = false;

class AppEntry {
	bannerAdManager: BannerAdManager;
	htmlOverlayManager: HtmlOverlayManager;
	client: Client;
	game: Phaser.Game;
	playerId: number;
	simulationHandler: ClientSimulationHandler;

	scene: SimulationScene;
	sceneGroup: Phaser.Group;

	hideNames: boolean;
	playerNames: { [id: number]: string } = {};

	constructor() {
		this.game = new Phaser.Game({
			width: <any>'100%',
			height: <any>'100%',
			state: <any>this,
			resolution: window.devicePixelRatio || 1
		});
	}

	preload() {
		console.log("preload");
		this.game.stage.disableVisibilityChange = true;
		this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
		//This method doesn't shrink height when window shrinks, so replace it
		this.game.scale.getParentBounds = function (target?: Phaser.Rectangle) {
			target = target || new Phaser.Rectangle(0, 0, 0, 0);

			target.setTo(0, 0, document.body.clientWidth, document.body.clientHeight);
			return target;
		}
		//On retina displays when using RESIZE resetCanvas isn't called, and it needs to be, so cludge that in too
		let ud = (<any>this.game.scale).updateDimensions.bind(this.game.scale);
		(<any>this.game.scale).updateDimensions = function(width: number, height: number, resize: boolean) {
			ud(width, height, resize);
			if (resize) {
				(<any>this.game.scale).resetCanvas();
			}
		}

		this.game.stage.backgroundColor = 0x273348;

		GraphicsLoader.load(this.game);
	}

	create() {
		this.bannerAdManager = new BannerAdManager();
		this.bannerAdManager.show();

		let welcome = new WelcomeScreen();
		let created = false;
		welcome.onLogin = (nickname, hideNames) => {
			if (!created) {
				created = true;
				this.hideNames = hideNames;
				this.connect(nickname);
			}
		};
		welcome.show();
	}

	connect(nickname: string) {
		console.log('create');
		this.htmlOverlayManager = new HtmlOverlayManager(this.game, this.bannerAdManager);

		let socket: SocketClient;
		if (runningOnLive) { //Standard port
			socket = new SocketClient(window.location.origin, new Serializer());
		} else { //Non-standard port, assume dev and hack for it
			socket = new SocketClient('http://' + window.location.hostname + ':8091', new Serializer());
		}
		this.client = new Client(socket, release, nickname);
		this.client.connectionRejected.on(rejectData => {
			//One day... rejectData.reason
			NewVersion.show(this.htmlOverlayManager);
		})
		this.client.initReceived.on(data => {
			this.playerId = data.playerId;
			this.playerNames = {};
			if (nickname) {
				this.playerNames[data.playerId] = nickname;
			}
			CircleCursor.setCursorSafe(this.game, data.playerId);
		})
		this.client.newNamesReceived.on(names => {
			if (names && !this.hideNames) {
				for (var key in names) {
					this.playerNames[key] = names[key];
				}
			}
		});
		this.client.simulationReceived.on(data => this.simulationReceived(data));
		this.client.tickReceived.on(tick => this.tickReceived(tick));


		this.htmlOverlayManager.setConnectionError(true);
		socket.connected.on(() => this.htmlOverlayManager.setConnectionError(false));
		socket.disconnected.on(() => this.htmlOverlayManager.setConnectionError(true));
	}

	simulationReceived(data: { level: LevelDef, simulation: Simulation, gameEndDetector: GameEndDetector }) {
		if (this.sceneGroup) {
			this.scene.removeFromSimulationRenderer();
			this.sceneGroup.destroy();
		}
		this.simulationHandler = new ClientSimulationHandler(data.level, data.simulation, data.gameEndDetector, this.client, 1 / 60);

		this.sceneGroup = this.game.add.group();
		this.scene = new SimulationScene(this.sceneGroup, this.htmlOverlayManager, data.level, this.simulationHandler.simulation, this.simulationHandler.inputApplier, this.simulationHandler.gameEndDetector, { gameOverCountdown: 8 }, this.playerId, this.playerNames);
		//new DebugLogger(data.simulation);
	}

	tickReceived(tickData: TickData) {
		this.simulationHandler.tickReceived(tickData);

		if (tickData.playerCount) {
			this.scene.playerCount = tickData.playerCount;
		}
	}

	update() {
		if (!this.simulationHandler || lastUpdateFailed) {
			return;
		}

		//Cludgy poor mans try catch without a try catch
		lastUpdateFailed = true;
		{
			if (this.simulationHandler.update()) {
				this.scene.update();
			}
		}
		lastUpdateFailed = false;
	}

	preRender() {
		if (this.scene) {
			this.scene.preRender();
		}
	}
}

//Find our release
let scripts = document.getElementsByTagName("script");
for (var i = 0; i < scripts.length; i++) {
	let index = scripts[i].src.indexOf('bundle.js?');
	if (index >= 0) {
		release = scripts[i].src.substr(index + 10);
	}
}
let willShowErrorMessage: boolean;
if (runningOnLive) {
	Raven.config('https://85f0d002c2ab4b5f811e6dfae46fa0b0@app.getsentry.com/76603', {
		release,
		whitelistUrls: [
			/massivematch\.io/,
			/cdnjs\.cloudflare\.com/,
		],
		ignoreErrors: [
			"adsbygoogle.push() error: All ins elements in the DOM with class=adsbygoogle already have ads in them.",
			"WeixinJSBridge is not defined",

			//Error when in an iframe and we are closed
			"Can't execute code from a freed script",
			"Impossible d'exécuter le code à partir d'un script libéré",
			"Code eines freigegebenen Skripts kann nicht ausgeführt werden",
			"解放されたスクリプトからコードを実行できません。",
			"No se puede ejecutar código de un script liberado",
			"Не удается выполнить программу из освобожденного сценария",
			"Kan programmacode niet uitvoeren vanuit een vrijgegeven script",
			"Não é possível executar o código a partir de um script liberado"
		],
		//Refresh the page after a simulation breaking error occurs
		dataCallback: function (data) {
			if (lastUpdateFailed && !willShowErrorMessage) {
				willShowErrorMessage = true;
				setTimeout(function () {
					alert('Sorry, something broke. An error has been reported.\nRefreshing the page');
					setTimeout(function () {
						window.location.reload(true);
					}, 1000);
				}, 4000)
			}

			return data;
		},
	}).install();
}
function start() {
	if (document.readyState == 'complete') {
		if (!(<any>window).Phaser) {
			alert('Failed to load Phaser, refreshing the page to fix it');
			window.location.reload(true);
			return;
		}

		//Wait till we are visible (firefox iframe) https://bugzilla.mozilla.org/show_bug.cgi?id=548397
		if (window.getComputedStyle(document.documentElement) == null) {
			setTimeout(start, 100);
			return;
		}

		Language.init();
		HtmlTranslator.apply();
		new AppEntry();

		[
			'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.6',
			'https://platform.twitter.com/widgets.js',
			'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
		].forEach(url => {
			let ele = document.createElement('script');
			ele.async = true;
			ele.src = url;
			document.body.appendChild(ele);
		})
	} else {
		document.onreadystatechange = start;
	}
}
if (GoodBrowser) {
	if ((<any>window).WebFont) {
		WebFont.load({
			custom: {
				families: ['Chewy']
			},
			classes: false,

			active: start,
			inactive: start
		});
	} else {
		console.warn('Couldnt load WebFont, this might go badly');
		start();
	}
} else {
	alert('Your browser is too old to play this game. Please download Google Chrome or Mozilla Firefox.');
	HtmlTranslator.showStartButton();
	document.getElementById('play-button').addEventListener('click', function() {
		window.location.replace('http://outdatedbrowser.com/');
	});
}