async function draw2(ctx, props) {
	const { width, height } = ctx.canvas;
	ctx.clearRect(0, 0, width, height);

	// background

	const bg = {
		comm: ["#b1b1b1", "#9b9b9b"],
		uncomm: ["#81be8b", "#6ca877"],
		rare: ["#83b1c1", "#6996a6"],
		urare: ["#b58bc9", "#8a629d"],
		epic: ["#d6b97a", "#a98e52"],
		legend: ["#e5bd45", "#aa8800"],
	}[props.category];

	const bgLineGrad = Math.tan(Math.PI * -22 / 180);
	const bgPerpGrad = Math.tan(Math.PI * 68 / 180);
	const bgGradDiff = bgLineGrad - bgPerpGrad;

	const bgIsectX = -0.5 * (height + bgPerpGrad * width) / bgGradDiff;
	const bgIsectY = bgLineGrad * bgIsectX;

	const bgGradient = ctx.createLinearGradient(
		width / 2 - bgIsectX, height / 2 + bgIsectY,
		width / 2 + bgIsectX, height / 2 - bgIsectY,
	);

	bgGradient.addColorStop(0, bg[0]);
	bgGradient.addColorStop(1, bg[1]);

	roundRect(ctx, 0, 0, width, height, 6);

	ctx.fillStyle = bgGradient;
	ctx.fill();

	// category header

	const chText = {
		comm: "COMMON",
		uncomm: "UNCOMMON",
		rare: "RARE",
		urare: "ULTRA RARE",
		epic: "EPIC",
		legend: "LEGENDARY",
	}[props.category];

	ctx.fillStyle = "white";
	ctx.font = "700 20px sans-serif";

	const chTextWidth = ctx.measureText(chText).width;
	const chSpacedWidth = chTextWidth + (chText.length - 1) * 24;

	let chMargin = (width - chSpacedWidth) / 2;
	for (let i = 0; i < chText.length; i++) {
		ctx.fillText(chText[i], chMargin, 23);

		const chCharWidth = ctx.measureText(chText[i]).width;
		chMargin += chCharWidth + 24;
	}

	// region footer

	props.region = props.region || "The Rejected Realms";

	ctx.font = "400 20px sans-serif";
	const rfTitleWidth = ctx.measureText("SEASON TWO").width;

	ctx.font = "700 20px sans-serif";
	const rfRegionWidth = ctx.measureText(props.region).width;

	const rfMargin = 0.02 * width;
	const rfBase = height - 15;
	const rfContainerWidth = 0.96 * width;
	const rfSpacing = (rfContainerWidth - rfTitleWidth - rfRegionWidth) / 3;

	ctx.font = "400 20px sans-serif";
	ctx.fillText("SEASON TWO", rfMargin + rfSpacing, rfBase);

	ctx.font = "700 20px sans-serif";
	ctx.fillText(props.region, rfMargin + rfTitleWidth + rfSpacing * 2, rfBase);

	// flag

	if (props.flag) {
		const flImage = await loadImage(props.flag);
		const [flWidth, flHeight] = [flImage.naturalWidth, flImage.naturalHeight];
		const [flDispWidth, flDispHeight] = [532, 496];

		const flScale = flWidth / flHeight > flDispWidth / flDispHeight
			? flDispHeight / flHeight
			: flDispWidth / flWidth;
		const flScaleWidth = flDispWidth / flScale;
		const flScaleHeight = flDispHeight / flScale;

		ctx.drawImage(
			flImage,
			(flWidth - flScaleWidth) / 2, (flHeight - flScaleHeight) / 2,
			flScaleWidth, flScaleHeight,
			14, 34, flDispWidth, flDispHeight,
		);

		flImage.remove();

		await drawInsetShadow(ctx, 72, "black", 14, 34, flDispWidth, flDispHeight);
	}

	// title

	const [tiX, tiY] = [0.05 * width, 0.08 * height];
	const [tiWidth, tiHeight] = [0.89 * width, 104];

	const tiGradient = ctx.createRadialGradient(
		tiX + tiWidth / 2, tiY + tiHeight / 2, 0,
		tiX + tiWidth / 2, tiY + tiHeight / 2, tiWidth / 2,
	);

	tiGradient.addColorStop(0, "rgba(0, 0, 0, 0.75)");
	tiGradient.addColorStop(1, "rgba(0, 0, 0, 0.35)");

	ctx.fillStyle = tiGradient;
	ctx.fillRect(tiX, tiY, tiWidth, tiHeight);

	ctx.fillStyle = "black";
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
	ctx.strokeRect(tiX, tiY, tiWidth, tiHeight);

	ctx.fillStyle = "white";
	ctx.font = "400 20px sans-serif";

	const tiPrefixWidth = ctx.measureText(props.prefix).width;
	ctx.fillText(props.prefix, (width - tiPrefixWidth) / 2, tiY + 32);

	ctx.font = "700 35px sans-serif";

	const tiNameWidth = ctx.measureText(props.name).width;
	ctx.fillText(props.name, (width - tiNameWidth) / 2, tiY + tiHeight - 25);

	// tiles

	const padding = 4;
	const imageSize = 22;

	const [tlX, tlY] = [0.055 * width, 0.655 * height - imageSize - padding * 3];
	const [tlWidth, tlHeight] = [0.89 * width, imageSize + padding * 2];

	ctx.font = "400 22px sans-serif";

	const tlGdpWidth = ctx.measureText(props.gdp).width;
	const tlPopWidth = ctx.measureText(props.pop).width;

	ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
	ctx.fillRect(
		tlX, tlY,
		tlGdpWidth + imageSize + padding * 3, tlHeight,
	);
	ctx.fillRect(
		tlX + tlWidth - tlPopWidth - imageSize - padding * 3, tlY,
		tlPopWidth + imageSize + padding * 3, tlHeight,
	);

	ctx.fillStyle = "white";
	ctx.fillText(
		props.gdp,
		tlX + padding,
		tlY + padding + 19,
	);
	ctx.fillText(
		props.pop,
		tlX + tlWidth - tlPopWidth - imageSize - padding * 2,
		tlY + padding + 19,
	);

	ctx.drawImage(
		await getIcon("factory"),
		tlX + tlGdpWidth + padding * 2, tlY + padding,
		imageSize, imageSize,
	);
	ctx.drawImage(
		await getIcon("male"),
		tlX + tlWidth - imageSize - padding, tlY + padding,
		imageSize, imageSize,
	);

	console.dir({tlX, tlY, tlWidth, tlHeight, tlGdpWidth, tlPopWidth});

	// lower

	const [loX, loY] = [14, 530];
	const [loWidth, loHeight] = [532, 0.285 * height];

	ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
	ctx.fillRect(loX, loY, loWidth, loHeight);

	await drawInsetShadow(ctx, 27, "black", loX, loY, loWidth, loHeight);

	ctx.fillStyle = "#ccc";
	ctx.font = "400 20px sans-serif";

	const loTypeText = props.type.toUpperCase();
	const loTypeWidth = ctx.measureText(loTypeText).width;
	ctx.fillText(loTypeText, (width - loTypeWidth) / 2, loY + 24);

	ctx.fillStyle = "#fff";
	ctx.font = "italic 400 22px Georgia, serif";

	let loMottoBaseline = loY + 66;
	for (const line of wrapText(ctx, '"' + props.motto + '"', loWidth - 24)) {
		const loMottoWidth = ctx.measureText(line).width;
		ctx.fillText(line, (width - loMottoWidth) / 2, loMottoBaseline);

		loMottoBaseline += 22;
	}

	// badges

	// TODO
}
