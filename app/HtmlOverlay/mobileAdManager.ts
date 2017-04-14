import AdManager = require('./adManager');

class MobileAdManager implements AdManager {
	admobid: { banner: string, interstitial: string };
	isTesting = true;

	adsShown = 0;

	shouldBeShown = false;
	bannerReady = false;
	interstitialReady = false;

	constructor() {
		if (/(android)/i.test(navigator.userAgent)) {  // for android & amazon-fireos
			this.admobid = {
				banner: 'ca-app-pub-4749031612968477/7711457540',
				interstitial: 'ca-app-pub-4749031612968477/9188190742'
			}
		} else /*if (/(ipod|iphone|ipad)/i.test(navigator.userAgent))*/ {  // for ios
			this.admobid = {
				banner: 'ca-app-pub-4749031612968477/5316394349',
				interstitial: 'ca-app-pub-4749031612968477/4757991140'
			}
		}

		document.addEventListener('admob.banner.events.LOAD', (event) => {
			console.log(event.type);
			this.bannerReady = true;
			if (this.shouldBeShown) {
				(<any>window).admob.banner.show();
			}
		});
		document.addEventListener('admob.interstitial.events.LOAD', (event) => {
			console.log(event.type);
			this.interstitialReady = true;
		});

		this.initAdmob();
	}

	private initAdmob() {
		let admob = (<any>window).admob;

		admob.banner.config({
			id: this.admobid.banner,
			isTesting: this.isTesting,
			overlap: true,
			autoShow: false
		})
		admob.banner.prepare()

		admob.interstitial.config({
			id: this.admobid.interstitial,
			isTesting: this.isTesting,
			autoShow: false
		})
		admob.interstitial.prepare()
	}

	show() {
		//Show an interstitial every third ad
		if (this.adsShown >= 2 && this.interstitialReady) {
			//TODO: When does this appear? Is it instead of the game over screen? urgh :/
			(<any>window).admob.interstitial.show();
			this.adsShown = 0;
		} else if (this.bannerReady) {
			(<any>window).admob.banner.show();
		}

		this.adsShown++;
		this.shouldBeShown = true;
	}

	hide() {
		if ((<any>window).admob) {
			(<any>window).admob.banner.hide();
		}
		this.shouldBeShown = false;
	}
};

export = MobileAdManager;