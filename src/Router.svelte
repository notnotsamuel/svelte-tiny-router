<script>
	// Import Svelte’s context API.
	import { setContext } from 'svelte';

	// Instead of using "export let url", use $props() to extract properties.
	let { url = "" } = $props();

	// Create a reactive state for the current path.
	let routerState = $state({
		// If a URL was passed as a prop, use it; otherwise use window.location.pathname.
		// (On the server, window is undefined so fall back to "/" as a default.)
		path: url || (typeof window !== 'undefined' ? window.location.pathname : '/')
	});

	// Imperative navigation: update both browser history and reactive state.
	function navigate(to, { replace = false } = {}) {
		if (typeof window !== 'undefined') {
			if (replace) {
				window.history.replaceState({}, "", to);
			} else {
				window.history.pushState({}, "", to);
			}
			// Update our reactive state.
			routerState.path = to;
		}
	}

	// Listen for browser back/forward events to keep our state in sync.
	if (typeof window !== 'undefined') {
		window.addEventListener('popstate', () => {
			routerState.path = window.location.pathname;
		});
	}

	// Expose the navigate function on our state (if needed by children).
	routerState.navigate = navigate;

	// Make our router state available to child components via context.
	setContext('router', routerState);
</script>

<!-- Render any children (typically <Route> components) -->
<slot />
