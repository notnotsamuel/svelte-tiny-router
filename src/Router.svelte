<script>
	// Import Svelte’s context API
	import { setContext } from 'svelte';

	// A user may pass a starting URL (for example in SSR)
	export let url = "";

	// We “wrap” our current URL inside a reactive object.
	// (Using $state makes it reactive in our component.)
	let routerState = $state({
		// Use the passed-in url or fall back to window.location.pathname.
		// (On the server, window is undefined so we use "/" as default.)
		path: url || (typeof window !== 'undefined' ? window.location.pathname : '/')
	});

	// Define our imperative navigation function.
	// This both manipulates browser history _and_ updates our reactive state.
	function navigate(to, { replace = false } = {}) {
		if (typeof window !== 'undefined') {
			if (replace) {
				window.history.replaceState({}, "", to);
			} else {
				window.history.pushState({}, "", to);
			}
			// Update the router’s state – this triggers reactive updates in any Route.
			routerState.path = to;
		}
	}

	// Listen for browser back/forward events and update our state accordingly.
	if (typeof window !== 'undefined') {
		window.addEventListener('popstate', () => {
			routerState.path = window.location.pathname;
		});
	}

	// Expose navigate on the router state so that any descendant could (if needed) call it.
	routerState.navigate = navigate;

	// Make our reactive router state available to children via context.
	setContext('router', routerState);
</script>

<!-- Render any children (typically Route components) -->
<slot />
