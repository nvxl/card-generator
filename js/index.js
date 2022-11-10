document.getElementById("toggle")
	.addEventListener("click", () => {
		document.getElementsByTagName("main")[0].classList.toggle("closed")
	});
document.getElementById("toggle-theme")
	.addEventListener("click", () => {
		const dark = (localStorage.getItem("dark") || "false") == "true";
		localStorage.setItem("dark", (!dark).toString());
		document.documentElement.classList[!dark ? "add" : "remove"]("dark");
	});
document.getElementById("download")
	.addEventListener("click", () => {
		const canvas = document.getElementById("canvas");

		const a = document.createElement("a");
		a.href = canvas.toDataURL();
		a.download = "card.png";
		document.body.appendChild(a);

		a.click();
		a.remove();
	});

if ((localStorage.getItem("dark") || "false") == "true")
	document.documentElement.classList.add("dark");

const updateBySeason = () => {
	const season = document.getElementById("i-season").value;

	const disable = season == "1" ? "only-s2" : "only-s1";
	const enable = season == "1" ? "only-s1" : "only-s2";

	for (const element of document.getElementsByClassName(disable))
		element.classList.add("disabled");
	for (const element of document.getElementsByClassName(enable))
		element.classList.remove("disabled");
};

document.getElementById("i-season")
	.addEventListener("input", updateBySeason);
updateBySeason();

let updateQueued = false;
let updateInProgress = false;

const doUpdate = async () => {
	updateQueued = false;
	updateInProgress = true;

	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");

	const props = Object.fromEntries(
		Array.from(document.getElementsByTagName("main")[0].children)
			.filter((element) => !!element.value) // am lazy
			.map((element) => [
				element.id.replace("i-", ""),
				element.getAttribute("type") == "file"
					? element.files[0]
					: element.value,
			])
	);

	await [draw1, draw2][props.season == "1" ? 0 : 1](ctx, props);

	updateInProgress = false;

	if (updateQueued) doUpdate();
};

const update = () => {
	if (updateInProgress) updateQueued = true;
	else doUpdate();
};

for (const element of document.getElementsByTagName("main")[0].children)
	if (["input", "select"].includes(element.tagName.toLowerCase()))
		element.addEventListener("input", () => update());
update();
