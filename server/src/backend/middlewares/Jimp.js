// @ts-nocheck
import Jimp from "jimp";

const cachedJpegDecoder = Jimp.decoders["image/jpeg"];
Jimp.decoders["image/jpeg"] = (data) => {
  const userOpts = { maxMemoryUsageInMB: 1024 };
  return cachedJpegDecoder(data, userOpts);
};

const defaultOptions = {
	ratio: 0.6,
	opacity: 0.6,
	dstPath: "./watermark.jpg",
	text: "jimp-watermark",
	textSize: 1,
};

const LocationEnum = Object.freeze({
	1: "top-left",
	2: "top-center",
	3: "top-right",
	4: "center-left",
	5: "center",
	6: "center-right",
	7: "bottom-left",
	8: "bottom-center",
	9: "bottom-right",
});

/**
 * 
 * @param {String} location 
 * @returns 
 */
const locationSet = (location) => {
	switch (location) {
		case LocationEnum[1]:
			return {
				x: Jimp.HORIZONTAL_ALIGN_LEFT,
				y: Jimp.VERTICAL_ALIGN_TOP,
			};
		case LocationEnum[2]:
			return {
				x: Jimp.HORIZONTAL_ALIGN_CENTER,
				y: Jimp.VERTICAL_ALIGN_TOP,
			};
		case LocationEnum[3]:
			return {
				x: Jimp.HORIZONTAL_ALIGN_RIGHT,
				y: Jimp.VERTICAL_ALIGN_TOP,
			};
		case LocationEnum[4]:
			return {
				x: Jimp.HORIZONTAL_ALIGN_LEFT,
				y: Jimp.VERTICAL_ALIGN_MIDDLE,
			};
		case LocationEnum[5]:
			return {
				x: Jimp.HORIZONTAL_ALIGN_CENTER,
				y: Jimp.VERTICAL_ALIGN_MIDDLE,
			};
		case LocationEnum[6]:
			return {
				x: Jimp.HORIZONTAL_ALIGN_RIGHT,
				y: Jimp.VERTICAL_ALIGN_MIDDLE,
			};
		case LocationEnum[7]:
			return {
				x: Jimp.HORIZONTAL_ALIGN_LEFT,
				y: Jimp.VERTICAL_ALIGN_BOTTOM,
			};
		case LocationEnum[8]:
			return {
				x: Jimp.HORIZONTAL_ALIGN_CENTER,
				y: Jimp.VERTICAL_ALIGN_BOTTOM,
			};
		case LocationEnum[9]:
			return {
				x: Jimp.HORIZONTAL_ALIGN_RIGHT,
				y: Jimp.VERTICAL_ALIGN_BOTTOM,
			};
		default:
			return {
				x: Jimp.HORIZONTAL_ALIGN_CENTER,
				y: Jimp.VERTICAL_ALIGN_MIDDLE,
			};
	}
};

const SizeEnum = Object.freeze({
	1: Jimp.FONT_SANS_8_BLACK,
	2: Jimp.FONT_SANS_10_BLACK,
	3: Jimp.FONT_SANS_12_BLACK,
	4: Jimp.FONT_SANS_14_BLACK,
	5: Jimp.FONT_SANS_16_BLACK,
	6: Jimp.FONT_SANS_32_BLACK,
	7: Jimp.FONT_SANS_64_BLACK,
	8: Jimp.FONT_SANS_128_BLACK,
});
const ErrorTextSize = new Error("Text size must range from 1 - 8");
const ErrorScaleRatio = new Error("Scale Ratio must be less than one!");
const ErrorOpacity = new Error("Opacity must be less than one!");

const getDimensions = (H, W, h, w, ratio) => {
	let hh, ww;
	if ((H / W) < (h / w)) {    //GREATER HEIGHT
		hh = ratio * H;
		ww = hh / h * w;
	} else {                //GREATER WIDTH
		ww = ratio * W;
		hh = ww / w * h;
	}
	return [hh, ww];
};

const checkOptions = (options) => {
	options = { ...defaultOptions, ...options };
	if (options.ratio > 1) {
		throw ErrorScaleRatio;
	}
	if (options.opacity > 1) {
		throw ErrorOpacity;
	}
	return options;
};


async function addTextWatermark(mainImage, options) {
	try {
		options = checkOptions(options);
		const main = await Jimp.read(mainImage);
		const maxHeight = main.getHeight();
		const maxWidth = main.getWidth();
		if (Object.keys(SizeEnum).includes(String(options.textSize))) {
			const font = await Jimp.loadFont(SizeEnum[options.textSize]);

			const X = 0,        //Always center aligned
				Y = 0;

			const location = locationSet(options.location);

			const finalImage = await main.print(font, X, Y, {
				text: options.text,
				alignmentX: location.x,
				alignmentY: location.y
			}, maxWidth, maxHeight);
			finalImage.quality(60).write(options.dstPath);
			return {
				destinationPath: options.dstPath,
				imageHeight: main.getHeight(),
				imageWidth: main.getWidth(),
			};
		} else {
			throw ErrorTextSize;
		}
	} catch (err) {
		console.error(err);
	}
}

async function addWatermark(mainImage, watermarkImage, options) {
	try {
		options = checkOptions(options);
		const main = await Jimp.read(mainImage);
		const watermark = await Jimp.read(watermarkImage);
		const [newHeight, newWidth] = getDimensions(main.getHeight(), main.getWidth(), watermark.getHeight(), watermark.getWidth(), options.ratio);
		watermark.resize(newWidth, newHeight);
		watermark.quality(60);

		// TO BE CHANGED
		const location = locationSet(options.location);
		const positionX = location.x === Jimp.HORIZONTAL_ALIGN_LEFT ? 0 : location.x === Jimp.HORIZONTAL_ALIGN_CENTER ? (main.getWidth() - newWidth) / 2 : main.getWidth() - newWidth;
		const positionY = location.y === Jimp.VERTICAL_ALIGN_TOP ? 0 : location.y === Jimp.VERTICAL_ALIGN_MIDDLE ? (main.getHeight() - newHeight) / 2 : main.getHeight() - newHeight;
		/* 
		const positionX = (main.getWidth() - newWidth) / 2;     //Centre aligned
		const positionY = (main.getHeight() - newHeight) / 2;   //Centre aligned
		*/
		watermark.opacity(options.opacity);
		main.composite(watermark,
			positionX,
			positionY,
			Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
		
		main.bitmap.exifBuffer = undefined;
		
		await main.quality(70).writeAsync(options.dstPath);
		return {
			destinationPath: options.dstPath,
			imageHeight: main.getHeight(),
			imageWidth: main.getWidth(),
		};
	} catch (err) {
		console.error(err);
		return null;
	}
}

const ExJimp = {
	addTextWatermark, addWatermark
};

export default ExJimp;
