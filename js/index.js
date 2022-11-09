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
