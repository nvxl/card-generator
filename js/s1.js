async function draw1(ctx, props) {
	const { width, height } = ctx.canvas;

	const ctColor = {
		comm: "#7e7e7e",
		uncomm: "#00aa4c",
		rare: "#008ec1",
		urare: "#ac00e6",
		epic: "#db9e1c",
		legend: "#ffd700",
	}[props.category];

	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = ctColor + "1a";
	ctx.fillRect(0, 0, width, height);

	// flag

	if (props.flag) {
		const flImage = await loadImage(props.flag);
		const [flWidth, flHeight] = [flImage.naturalWidth, flImage.naturalHeight];
		const [flDispWidth, flDispHeight] = [width, 240];

		const flScale = flWidth / flHeight > flDispWidth / flDispHeight
			? flDispHeight / flHeight
			: flDispWidth / flWidth;
		const flScaleWidth = flDispWidth / flScale;
		const flScaleHeight = flDispHeight / flScale;

		ctx.drawImage(
			flImage,
			(flWidth - flScaleWidth) / 2, (flHeight - flScaleHeight) / 2,
			flScaleWidth, flScaleHeight,
			0, 0, flDispWidth, flDispHeight,
		);

		flImage.remove();
	}

	// category

	const ctAngle = Math.tan(32 / width);
	const ctHalfDiag = Math.sqrt(0.25 * width * width + 256);
	const ctHalfDist = Math.sin(2 * ctAngle) * ctHalfDiag;

	const ctOffVt = Math.sin(Math.PI / 2 - ctAngle) * ctHalfDist;
	const ctOffHz = Math.cos(Math.PI / 2 - ctAngle) * ctHalfDist;

	const ctGradient = ctx.createLinearGradient(
		width / 2 - ctOffHz, 256 + ctOffVt,
		width / 2 + ctOffHz, 256 - ctOffVt,
	);

	ctGradient.addColorStop(0, "white");
	ctGradient.addColorStop(1, ctColor);

	ctx.fillStyle = ctGradient;
	ctx.fillRect(0, 240, width, 32);

	const ctText = {
		comm: "COMMON",
		uncomm: "UNCOMMON",
		rare: "RARE",
		urare: "ULTRA RARE",
		epic: "EPIC",
		legend: "LEGENDARY",
	}[props.category];

	ctx.fillStyle = "white";
	ctx.font = "italic 700 24px sans-serif";

	let ctRightMargin = width - 10;
	for (let i = ctText.length - 1; i >= 0; i--) {
		const ctCharWidth = ctx.measureText(ctText[i]).width;
		ctx.fillText(ctText[i], ctRightMargin - ctCharWidth, 264);

		ctRightMargin -= ctCharWidth + 6;
	}

	// title

	ctx.fillStyle = "#0c0";
	ctx.font = "400 23px sans-serif";

	const tiPrefixWidth = ctx.measureText(props.prefix).width;
	ctx.fillText(props.prefix, (width - tiPrefixWidth) / 2, 308);

	ctx.font = "700 29px sans-serif";

	const tiNameWidth = ctx.measureText(props.name).width;
	ctx.fillText(props.name, (width - tiNameWidth) / 2, 344);

	// lower

	ctx.lineWidth = 2;
	ctx.strokeStyle = "#ccc";

	ctx.strokeRect(-1, 364, width + 2, 38);

	ctx.fillStyle = "#aaa";
	ctx.font = "400 20px sans-serif";

	const loTypeText = props.type.toUpperCase();
	const loTypeWidth = ctx.measureText(loTypeText).width;
	ctx.fillText(loTypeText, (width - loTypeWidth) / 2, 390);

	ctx.fillStyle = "#666";
	ctx.font = "italic 400 22px Georgia, serif";

	let loMottoBaseline = 440;
	for (const line of wrapText(ctx, '"' + props.motto + '"', width - 24)) {
		const loMottoWidth = ctx.measureText(line).width;
		ctx.fillText(line, (width - loMottoWidth) / 2, loMottoBaseline);

		loMottoBaseline += 22;
	}

	// badges

	// TODO

	// description

	ctx.font = "400 22px sans-serif";
	const dsLines = wrapText(ctx, props.desc || "Description", width - 88);

	roundRect(ctx, 22, 464, width - 44, dsLines.length * 22 + 44, 4);

	ctx.fillStyle = "#fff";
	ctx.fill();

	ctx.fillStyle = "#666";

	let dsBaseline = 506;
	for (const line of dsLines) {
		ctx.fillText(line, 44, dsBaseline);

		dsBaseline += 22;
	}

	// region footer

	props.region = props.region || "The Rejected Realms";

	ctx.fillStyle = ctColor;
	ctx.fillRect(0, height - 32, width, 32);

	ctx.fillStyle = "#fff";
	ctx.font = "400 20px sans-serif";

	ctx.fillText("SEASON ONE", 5, height - 8);

	ctx.font = "700 20px sans-serif";

	const rfRegionWidth = ctx.measureText(props.region).width;
	ctx.fillText(props.region, width - rfRegionWidth - 5, height - 8);

	// rounded corners

	roundRect(ctx, 0, 0, width, height, 6);

	ctx.globalCompositeOperation = "destination-in";
	ctx.fill();

	ctx.globalCompositeOperation = "source-over";
}
