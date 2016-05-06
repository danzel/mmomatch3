/**
 * expected hue range: [0, 360), expected saturation range: [0, 1], expected lightness range: [0, 1] 
 */
function hslToRgb(hue: number, saturation: number, lightness: number): number {
	// From https://github.com/kayellpeee/hsl_rgb_converter
	// based on algorithm from http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
	var chroma = (1 - Math.abs((2 * lightness) - 1)) * saturation;
	var huePrime = hue / 60;
	var secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));

	huePrime = Math.floor(huePrime);
	var red: number;
	var green: number;
	var blue: number;

	if (huePrime === 0) {
		red = chroma;
		green = secondComponent;
		blue = 0;
	} else if (huePrime === 1) {
		red = secondComponent;
		green = chroma;
		blue = 0;
	} else if (huePrime === 2) {
		red = 0;
		green = chroma;
		blue = secondComponent;
	} else if (huePrime === 3) {
		red = 0;
		green = secondComponent;
		blue = chroma;
	} else if (huePrime === 4) {
		red = secondComponent;
		green = 0;
		blue = chroma;
	} else if (huePrime === 5) {
		red = chroma;
		green = 0;
		blue = secondComponent;
	}

	var lightnessAdjustment = lightness - (chroma / 2);
	red += lightnessAdjustment;
	green += lightnessAdjustment;
	blue += lightnessAdjustment;

	return Math.round(red * 255) << 16 | Math.round(green * 255) << 8 | Math.round(blue * 255);
}

export = hslToRgb;
