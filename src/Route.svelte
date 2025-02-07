<script>
	import { getContext } from 'svelte';

	// Use $props() to extract route properties.
	let { path, component } = $props();

	// Get the router state from context.
	const router = getContext('router');

	// A simple matching function that supports dynamic segments like "/register/:code".
	function matchPath(current, route) {
		// Split both the current URL and the route pattern into segments.
		const currentSegments = current.split('/').filter(Boolean);
		const routeSegments = route.split('/').filter(Boolean);

		// If the number of segments differs, it's not a match.
		if (currentSegments.length !== routeSegments.length) return null;

		let params = {};
		for (let i = 0; i < routeSegments.length; i++) {
			const rseg = routeSegments[i];
			const cseg = currentSegments[i];
			// If the route segment is dynamic (starts with ":"), capture the parameter.
			if (rseg.startsWith(':')) {
				const paramName = rseg.slice(1);
				params[paramName] = cseg;
			} else if (rseg !== cseg) {
				// If a static segment doesn't match, return null.
				return null;
			}
		}
		return params;
	}

	// Create a derived reactive value that recomputes whenever the router’s path changes.
	let matchResult = $derived(() => {
		// If a "path" prop was provided, attempt to match it.
		if (path) {
			return matchPath(router.path, path);
		} else {
			// If no path is provided, then always "match" (useful for fallback routes).
			return {};
		}
	});
</script>

{#if matchResult !== null}
	{#if component}
		<!-- Render the specified component and spread any route parameters as props. -->
		<svelte:component this={component} {...matchResult} />
	{:else}
		<!-- Otherwise, render any slot content and expose the route parameters via "let:params". -->
		<slot params={matchResult} />
	{/if}
{/if}
