function loadImage(file) {
	return new Promise((res, rej) => {
		const fileReader = new FileReader();
		fileReader.onerror = rej;
		fileReader.onloadend = () => {
			const img = document.createElement("img");
			img.onload = () => res(img);
			img.src = fileReader.result;
		};
		fileReader.readAsDataURL(file);
	});
}

const iconCache = new Map();
async function getIcon(name) {
	if (!iconCache.has(name)) {
		const res = await fetch(`img/icons/${name}.png`);
		iconCache.set(name, await loadImage(await res.blob()));
	}

	return iconCache.get(name);
}

async function drawInsetShadow(ctx, blur, c, x, y, w, h) {
	const current = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	const fillStyle = ctx.fillStyle;

	ctx.globalCompositeOperation = "xor";
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	ctx.fillStyle = "white";
	ctx.filter = "invert(100%)";
	ctx.shadowBlur = blur * 2;
	ctx.shadowColor = c;
	ctx.fillRect(x, y, w, h);

	ctx.filter = "none";
	ctx.globalCompositeOperation = "destination-in";
	ctx.fillRect(x, y, w, h);

	ctx.globalCompositeOperation = "destination-over";
	ctx.shadowColor = "transparent";
	ctx.drawImage(await createImageBitmap(current), 0, 0);

	ctx.fillStyle = fillStyle;
	ctx.globalCompositeOperation = "source-over";
}

function wrapText(ctx, text, width) {
	const words = text.split(/\s/);
	const lines = [];
	let line = "";

	for (const word of words) {
		const space = line.length == 0 ? "" : " ";
		if (ctx.measureText(line + space + word).width <= width) {
			line += space + word;
		} else {
			lines.push(line);
			line = word;
		}
	}

	lines.push(line);
	return lines;
}

function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r,     y);
	ctx.lineTo(x + w - r, y);
	ctx.arcTo( x + w,     y,     x + w,     y + r, r);
	ctx.lineTo(x + w,     y + h - r);
	ctx.arcTo( x + w,     y + h, x + w - r, y + h, r);
	ctx.lineTo(x + r,     y + h);
	ctx.arcTo( x,         y + h, x,         h - r, r);
	ctx.lineTo(x,         y + r);
	ctx.arcTo( x,         y,     x + r,     y,     r);
}
