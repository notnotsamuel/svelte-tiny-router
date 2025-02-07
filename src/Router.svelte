<script>
	import { setContext } from 'svelte';

	let { url = "" } = $props();

	let routerState = $state({
		path: url || (typeof window !== 'undefined' ? window.location.pathname : '/')
	});

	// update both browser history and reactive state.
	function navigate(to, { replace = false } = {}) {
		if (typeof window !== 'undefined') {
			if (replace) {
				window.history.replaceState({}, "", to);
			} else {
				window.history.pushState({}, "", to);
			}
			routerState.path = to;
		}
	}

	if (typeof window !== 'undefined') {
		window.addEventListener('popstate', () => {
			routerState.path = window.location.pathname;
		});
	}

	routerState.navigate = navigate;

	setContext('router', routerState);
</script>

<!-- Render any children (typically <Route> components) -->
<slot />
