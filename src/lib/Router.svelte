<script>
	let { url = "" } = $props();
  
	let router = $state({
	  path: url || (typeof window !== 'undefined' ? window.location.pathname : '/'),
	  routes: [] 
	});
  
	// Imperative navigation function.
	function navigate(to, { replace = false } = {}) {
	  if (typeof window !== 'undefined') {
		if (replace) {
		  window.history.replaceState({}, "", to);
		} else {
		  window.history.pushState({}, "", to);
		}
		router.path = to;
	  }
	}
  
	if (typeof window !== 'undefined') {
	  window.addEventListener('popstate', () => {
		router.path = window.location.pathname;
	  });
	}
  
	router.navigate = navigate;
	import { setContext } from 'svelte';
	setContext('router', router);
  </script>
  
  <!-- Render children (the Route components) via the default slot -->
  <slot />
  