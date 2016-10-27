class BannerAdManager {
	private element: HTMLElement;

	constructor() {
		this.element = document.getElementById('bottom-ad');
	}

	show() {
		if (this.element) { //May be totally adblocked off the screen
			if (this.element.innerHTML == '') {
				if (window.innerWidth < 728) {
					this.element.innerHTML = '<ins class="adsbygoogle" style="display:inline-block;width:320px;height:100px" data-ad-client="ca-pub-4749031612968477" data-ad-slot="7034687548"></ins>';
				} else {
					this.element.innerHTML = '<ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-4749031612968477" data-ad-slot="9178345940"></ins>';
				}
				((<any>window).adsbygoogle || []).push({});
			}
		}
	}

	hide() {
		if (this.element) { //May be totally adblocked off the screen
			this.element.innerHTML = '';
		}
	}
};

export = BannerAdManager;