<script module>
	let routeCounter = 0;
</script>
  
  <script>
	import { getContext } from 'svelte';
	import NestedRouterProvider from './NestedRouterProvider.svelte'; // Import the new provider

	let { path, component, children } = $props(); // children for snippet-based slot
	const router = getContext('router');
  
	if (path) {
	  // Ensure routes are registered on the correct router instance,
	  // especially in nested scenarios.
	  if (!router.routes.includes(path)) {
		router.routes.push(path);
	  }
	}

	// Renamed and enhanced matching function
	function _matchRoute(currentPath, routePattern) {
	  const currentSegments = currentPath.split('/').filter(Boolean);
	  let routeSegments = routePattern.split('/').filter(Boolean);
	  let params = {};
	  const isWildcard = routePattern.endsWith('/*');

	  if (isWildcard) {
		routeSegments = routePattern.slice(0, -2).split('/').filter(Boolean); // Remove '/*' for matching base
		if (currentSegments.length < routeSegments.length) return null; // Current path must be at least as long as wildcard base
	  } else {
		if (currentSegments.length !== routeSegments.length) return null;
	  }

	  for (let i = 0; i < routeSegments.length; i++) {
		const rSeg = routeSegments[i];
		const cSeg = currentSegments[i];
		if (rSeg.startsWith(':')) {
		  params[rSeg.slice(1)] = cSeg;
		} else if (rSeg !== cSeg) {
		  return null;
		}
	  }
	  return params; // Returns params for matched part, even for wildcard
	}
  
	let matchResult = $derived.by(() => {
	  if (path) {
		return _matchRoute(router.path, path);
	  } else {
		return null; // Fallback route handled separately
	  }
	});

	const isWildcardRoute = $derived(path && path.endsWith('/*'));
  
	let fallbackMatch = $derived.by(() => {
	  if (!path) { // This is the fallback route
		// Check against all registered routes in the current router context
		for (let routePattern of router.routes) {
		  if (_matchRoute(router.path, routePattern) !== null) {
			return null; // A defined route matched—do not render fallback
		  }
		}
		return {}; // No defined route matched—fallback should render
	  } else {
		return null;
	  }
	});
  
	let shouldRender = $derived.by(() => {
	  return (path ? (matchResult !== null) : (fallbackMatch !== null));
	});
  
	let paramsToPass = $derived.by(() => {
	  return matchResult || fallbackMatch || {}; // Fallback has empty params
	});

  </script>
  
  {#if shouldRender}
	{#if isWildcardRoute && matchResult}
	  <NestedRouterProvider parentCtx={router} matchedPath={path}>
		{#if component}
		  {@const Component = component}
		  <Component {...paramsToPass} /> 
		{:else if children}
		  {@render children({ params: paramsToPass })}
		{:else}
		  <!-- This case implies a wildcard route without a component and without default slot content passed as children snippet.
			   It might be an unusual setup, but NestedRouterProvider will still set the context.
			   A <slot> here would refer to NestedRouterProvider's slot, not Route's.
			   If Route's slot content is expected, it must be passed via `children` prop for wildcards.
		  -->
		{/if}
	  </NestedRouterProvider>
	{:else if component}
	  {@const Component = component}
	  <Component {...paramsToPass} />
	{:else if children}
	  {@render children({ params: paramsToPass })}
	<!-- If no component and no children snippet, render nothing for this route -->
	{/if}
  {/if}
