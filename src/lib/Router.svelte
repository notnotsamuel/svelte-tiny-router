<script>
	let { url = "" } = $props();
  
	let router = $state({
	  path: url || (typeof window !== 'undefined' ? window.location.pathname : '/'),
	  routes: [],
	  query: {}
	});
  
	// Update both path and query parameters.
	function updateRouter() {
	  if (typeof window !== 'undefined') {
		router.path = window.location.pathname;
		const search = window.location.search;
		const params = new URLSearchParams(search);
		let queryObj = {};
		for (const [key, value] of params.entries()) {
		  queryObj[key] = value;
		}
		router.query = queryObj;
	  }
	}
  
	// Imperative navigation function.
	function navigate(to, { replace = false } = {}) {
	  if (typeof window !== 'undefined') {
		if (replace) {
		  window.history.replaceState({}, "", to);
		} else {
		  window.history.pushState({}, "", to);
		}
		updateRouter();
	  }
	}

	function removeQueryParams(keys) {
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			keys.forEach(key => url.searchParams.delete(key));
			window.history.replaceState({}, "", url.toString());
			updateRouter();
		}
	}
  
	if (typeof window !== 'undefined') {
	  updateRouter();
	  window.addEventListener('popstate', updateRouter);
	}
  
	router.navigate = navigate;
  
	// Improved query helper function names.
	router.getQueryParam = (key) => router.query[key];
	router.hasQueryParam = (key) => Object.prototype.hasOwnProperty.call(router.query, key);
	router.removeQueryParams = removeQueryParams;

	import { setContext } from 'svelte';
	setContext('router', router);
  </script>
  
  <!-- Render children (the Route components) via the default slot -->
  <slot />
  