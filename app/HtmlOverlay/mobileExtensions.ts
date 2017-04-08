class MobileExtensions {
	static apply(): void {
		document.getElementById('news').addEventListener('click', () => {
			MobileExtensions.show(document.getElementById('news-container'));
		});
		document.getElementById('help').addEventListener('click', () => {
			MobileExtensions.show(document.getElementById('help-container'));
		});

		document.getElementById('news-close').addEventListener('click', () => {
			MobileExtensions.hide(document.getElementById('news-container'));
		});
		document.getElementById('help-close').addEventListener('click', () => {
			MobileExtensions.hide(document.getElementById('help-container'));
		});
	}

	private static show(ele: HTMLElement) {
		ele.style.display = 'initial';
		setTimeout(() => {
			ele.style.opacity = '1';
			ele.style.top = '10px';
		}, 0);
	}

	private static hide(ele: HTMLElement) {
		ele.style.opacity = '0';
		ele.style.top = '40px';
		setTimeout(() => {
			ele.style.display = 'none';
		}, 400);
	}
}

export = MobileExtensions;