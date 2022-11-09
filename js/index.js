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
