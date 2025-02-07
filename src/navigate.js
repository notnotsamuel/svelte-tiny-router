/**
 * imperatively navigate to a new URL
 *
 * @param {string} to - new URL
 * @param {{ replace?: boolean }} [options] - if replace is true, replaces the current history entry.
 */
export function navigate(to, { replace = false } = {}) {
	if (typeof window !== 'undefined') {
		if (replace) {
			window.history.replaceState({}, "", to);
		} else {
			window.history.pushState({}, "", to);
		}
		// dispatch a popstate event so that the Router (if mounted) updates its state.
		window.dispatchEvent(new Event('popstate'));
	}
}
