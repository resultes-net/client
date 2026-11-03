// Moves the node to the end of `document.body` ("portal"), so that its position and size don't
// depend on its ancestors in the markup. Used for Skeleton's `data-popup` elements: an absolutely
// positioned popup is sized by its nearest positioned ancestor, e.g. a `relative` wrapper around a
// tab panel, and gets squeezed.
export function portal(node: HTMLElement) {
	document.body.appendChild(node);

	return {
		destroy() {
			node.remove();
		}
	};
}
