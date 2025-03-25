function getElementPath(element: Node & Element) {
	if (!element || element.nodeType !== Node.ELEMENT_NODE) return '';

	let path = [];

	while (element.parentElement) {
		let selector = element.tagName.toLowerCase();

		if (element.id) {
			selector += `#${element.id}`;
			path.unshift(selector);
			break;
		}

		if (element.classList.length > 0)
			selector += "." + Array.from(element.classList).join(".");

		if (element.hasAttribute("name"))
			selector += `[name="${element.getAttribute("name")}"]`;

		const siblings = Array.from(element.parentElement.children).filter(
			(sibling) => sibling.tagName === element.tagName
		);

		if (siblings.length > 1)
			selector += `:nth-child(${siblings.indexOf(element) + 1})`;

		path.unshift(selector);

		element = element.parentElement;
	}

	return path.join(" > "); // CSS selector path
}

export default getElementPath;
