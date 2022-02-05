export function outclick(node) {
	const handleClick =e=> {
		if (!node.contains(event.target)) {
			node.dispatchEvent(new CustomEvent("outclick"))
		}
	}

	document.addEventListener("click", handleClick, true)

	return {
		destroy() {
			document.removeEventListener("click", handleClick, true)
		}
	}
}
