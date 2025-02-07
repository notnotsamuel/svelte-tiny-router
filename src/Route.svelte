<script>
	import { getContext } from 'svelte';
	let { path, component } = $props();

	const router = getContext('router');

	function matchPath(current, route) {
		const currentSegments = current.split('/').filter(Boolean);
		const routeSegments = route.split('/').filter(Boolean);
		if (currentSegments.length !== routeSegments.length) return null;

		let params = {};
		for (let i = 0; i < routeSegments.length; i++) {
			const rseg = routeSegments[i];
			const cseg = currentSegments[i];
			if (rseg.startsWith(':')) {
				const paramName = rseg.slice(1);
				params[paramName] = cseg;
			} else if (rseg !== cseg) {
				return null;
			}
		}
		return params;
	}

	let matchResult = $derived(() => {
		if (path) {
			return matchPath(router.path, path);
		} else {
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
