<script module>
	let routeCounter = 0;
</script>
  
  <script>
	import { getContext } from 'svelte';
	let { path, component } = $props();
	const router = getContext('router');
  
	if (path) {
	  router.routes.push(path);
	}
	function matchPath(current, route) {
	  const currentSegments = current.split('/').filter(Boolean);
	  const routeSegments = route.split('/').filter(Boolean);
	  if (currentSegments.length !== routeSegments.length) return null;
	  let params = {};
	  for (let i = 0; i < routeSegments.length; i++) {
		const rseg = routeSegments[i];
		const cseg = currentSegments[i];
		if (rseg.startsWith(':')) {
		  // Dynamic segment—store the parameter.
		  params[rseg.slice(1)] = cseg;
		} else if (rseg !== cseg) {
		  return null;
		}
	  }
	  return params;
	}
  
	let matchResult = $derived.by(() => {
	  if (path) {
		return matchPath(router.path, path);
	  } else {
		return null; // fallback route handled separately
	  }
	});
  
	let fallbackMatch = $derived.by(() => {
	  if (!path) { // this is the fallback route
		for (let pattern of router.routes) {
		  if (matchPath(router.path, pattern) !== null) {
			return null; // a defined route matched—do not render fallback
		  }
		}
		return {}; // no defined route matched—fallback should render
	  } else {
		return null;
	  }
	});
  
	let shouldRender = $derived.by(() => {
	  return (path ? (matchResult !== null) : (fallbackMatch !== null));
	});
  
	let paramsToPass = $derived.by(() => {
	  return matchResult || fallbackMatch || {};
	});
  </script>
  
  {#if shouldRender}
	{#if component}
	  {@const Component = component}
	  <Component {...(paramsToPass)} />
	{:else}
	  <slot let:params={paramsToPass} />
	{/if}
  {/if}
  