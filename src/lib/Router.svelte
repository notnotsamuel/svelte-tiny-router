<script>
	import { setContext, getContext, onMount, onDestroy } from 'svelte';

	let { url = undefined, beforeEach = [] } = $props();
	
	const parentRouterContext = getContext('router'); // Might be undefined if this is the root router

	let initialQuery = {};
	let initialFullPath = '/';

	if (typeof window !== 'undefined') { // Client-side
		initialFullPath = window.location.pathname;
		initialQuery = _parseQuery(window.location.search);
	} else if (url !== undefined) { // SSR or specific initial URL
		const parts = url.split('?');
		initialFullPath = parts[0];
		if (parts.length > 1) {
			initialQuery = _parseQuery('?' + parts[1]);
		}
	}
	
	let initialBase = '/';
	let initialRelativePath = initialFullPath;

	if (parentRouterContext && parentRouterContext.isWildcardChildContext) {
		initialBase = parentRouterContext.base; 
		initialRelativePath = parentRouterContext.path;
	} else { // Root router (client or SSR with specific URL)
		initialBase = '/'; // Base is always '/' for the root router itself
		initialRelativePath = initialFullPath; // Relative path is the full path for the root
	}
	
	// Normalize initialBase: ensure it starts with '/', does NOT end with '/', unless it's the root '/'
	if (initialBase !== '/') {
		initialBase = ('/' + initialBase.replace(/^\/+|\/+$/g, '')).replace(/\/\//g, '/');
		if (initialBase === '') initialBase = '/'; // Handle case where it might become empty
	}
	// initialRelativePath should also be clean, starting with /
	if (!initialRelativePath.startsWith('/')) initialRelativePath = '/' + initialRelativePath;
	initialRelativePath = initialRelativePath.replace(/\/\//g, '/') || '/';


	let router = $state({
	  base: initialBase, // Should be like '/' or '/dashboard'
	  fullPath: initialFullPath, // Full path from window.location
	path: initialRelativePath, // Path relative to this router's base
	fromPath: null, // Previous fullPath
	routes: [],
	query: initialQuery, // Use pre-parsed initial query
	beforeEach: beforeEach || [],
	isWildcardChildContext: false, // This router itself is not a wildcard context provider by default
	});

	function _parseQuery(searchString) {
		if (!searchString || searchString === '?') return {}; // Handle empty or '?' only search string
		const params = new URLSearchParams(searchString);
		let queryObj = {};
		for (const [key, value] of params.entries()) {
			queryObj[key] = value;
		}
		return queryObj;
	}

	function _resolvePath(to) {
		let newFullPath;
		if (to.startsWith('/')) { // Path starts with a slash
			if (router.base !== '/' && (to === router.base || to.startsWith(router.base + '/'))) {
				// 'to' is an absolute path that already includes the base of this nested router
				newFullPath = to;
			} else {
				// 'to' is absolute relative to this router's base, or this is the root router
				newFullPath = (router.base.replace(/\/$/, '') + to).replace(/\/\//g, '/');
			}
		} else { // Relative to current path within the base
			const currentDir = router.path.substring(0, router.path.lastIndexOf('/') + 1);
			newFullPath = (router.base.replace(/\/$/, '') + '/' + currentDir + to).replace(/\/\//g, '/');
			// Basic normalization for ".." and "."
			const segments = newFullPath.split('/');
			const resolvedSegments = [];
			for (const segment of segments) {
				if (segment === '..') {
					resolvedSegments.pop();
				} else if (segment !== '.' && segment !== '') {
					resolvedSegments.push(segment);
				}
			}
			newFullPath = '/' + resolvedSegments.join('/');
		}
		return newFullPath.replace(/\/\//g, '/') || '/';
	}
	
	async function _runGuards(toFullPath, fromFullPath, toQueryForGuards, navigationAction) { // Added toQueryForGuards
		if (router.beforeEach.length === 0) {
			navigationAction();
			return;
		}

		// const toQuery = typeof window !== 'undefined' ? _parseQuery(window.location.search) : {}; // OLD
		const fromQuery = router.fromPath ? _parseQuery(new URL(router.fromPath, window.location.origin).search) : {};
		
		// Extract params - this is tricky without knowing the matching route yet.
		// For guards, `params` might be less critical or require a preliminary match.
		// For now, passing empty params. A more advanced version could pre-match.
		const toRouteInfo = { path: toFullPath, params: {}, query: toQueryForGuards }; // Use passed toQueryForGuards
		const fromRouteInfo = router.fromPath ? { path: fromFullPath, params: {}, query: fromQuery } : null;

		let i = 0;
		async function next(nextArg) {
			if (nextArg === false) return; // Cancel navigation
			if (typeof nextArg === 'string' || typeof nextArg === 'object') { // Redirect
				navigate(typeof nextArg === 'string' ? nextArg : nextArg.path, { replace: true }); // Or handle object with path, params, query
				return;
			}
			if (i < router.beforeEach.length) {
				const guard = router.beforeEach[i++];
				// Pass a fresh `next` to each guard
				await guard({ to: toRouteInfo, from: fromRouteInfo, next: (arg) => next(arg) });
			} else {
				navigationAction(); // All guards passed
			}
		}
		await next();
	}

	function _updateRouterState(newFullPath) {
		router.fromPath = router.fullPath;
		router.fullPath = newFullPath;
		
		let relPath;
		// Check if fullPath starts with base. Base is like '/dashboard', fullPath like '/dashboard' or '/dashboard/foo'
		if (newFullPath.startsWith(router.base)) {
			relPath = newFullPath.substring(router.base.length); // If base='/dashboard', full='/dashboard', relPath=''
															  // If base='/dashboard', full='/dashboard/foo', relPath='/foo'
			if (!relPath.startsWith('/')) {
				relPath = '/' + relPath; // Ensure it starts with a slash, e.g. '' -> '/' or 'foo' -> '/foo'
			}
		} else {
			// This router is not authoritative for this path (e.g., navigated completely outside its base)
			// The relative path in this context is effectively the full path from the perspective of this router's scope.
			relPath = newFullPath;
		}
		router.path = relPath.replace(/\/\//g, '/') || '/'; // Clean up double slashes and ensure at least '/'
		
		if (typeof window !== 'undefined') {
			router.query = _parseQuery(window.location.search);
		} else {
			// On SSR, query is set initially and doesn't change.
			// If url prop was used, initialQuery has it. Otherwise, it's {}.
		}
	}
  
	function removeQueryParams(keysToRemove) {
		if (typeof window !== 'undefined') {
			const currentSearch = window.location.search; // Get current query from actual URL
			const params = new URLSearchParams(currentSearch);
			
			keysToRemove.forEach(key => {
				params.delete(key);
			});
			
			const newSearchString = params.toString();
			const newQueryPart = newSearchString ? `?${newSearchString}` : '';

			// Use the router's own navigate method.
			// router.path is the path relative to this router's base.
			// We pass the current relative path along with the new query string.
			// This ensures guards are run and state is updated consistently.
			// Using replace: true is often better for query-only changes.
			router.navigate(router.path + newQueryPart, { replace: true }); 
		}
	}
	
	// This function is called by popstate or after successful guards in navigate
	function _performUpdate(fullPathToNavigate) {
		_updateRouterState(fullPathToNavigate);
		// $state handles reactivity for path and query changes.
	}

	// Bound to popstate event
	async function handlePopState() {
		if (typeof window !== 'undefined') {
			const targetFullPath = window.location.pathname; // This includes path only
			const currentQuery = _parseQuery(window.location.search); // Parse query at the time of popstate
			// Query will be re-parsed from window.location.search in _updateRouterState
			await _runGuards(targetFullPath, router.fullPath, currentQuery, () => { // Pass currentQuery
				_performUpdate(targetFullPath);
			});
		}
	}
	
	async function navigate(to, { replace = false } = {}) {
		if (typeof window !== 'undefined') {
			let pathInput = to;
			let searchInput = ''; // e.g., "?foo=bar" or ""
			const queryIndex = to.indexOf('?');
			if (queryIndex !== -1) {
				pathInput = to.substring(0, queryIndex);
				searchInput = to.substring(queryIndex);
			}

			const targetFullPath = _resolvePath(pathInput); // pathInput is now path-only
			const targetSearch = searchInput; // searchInput is query from 'to', or empty

			const toQueryForGuards = _parseQuery(targetSearch); // Parse the query we intend to navigate to

			await _runGuards(targetFullPath, router.fullPath, toQueryForGuards, () => {
				router.fromPath = router.fullPath; // Set fromPath before history change
				if (replace) {
					window.history.replaceState({}, "", targetFullPath + targetSearch);
				} else {
					window.history.pushState({}, "", targetFullPath + targetSearch);
				}
				// _performUpdate will use targetFullPath and then re-read window.location.search
				// which is fine as history API has just updated it.
				_performUpdate(targetFullPath);
			});
		}
	}
  
	onMount(() => {
		if (typeof window !== 'undefined') {
			// Router state (fullPath, path, query) is already initialized.
			// This onMount ensures that if the URL changed between script execution and mount
			// (e.g. due to an immediate redirect not caught by initial parsing, though rare for query),
			// or to robustly sync with the exact state at mount.
			// It also correctly sets up the popstate listener.
			_performUpdate(window.location.pathname); // Ensures path and query are synced from current window.location

			window.addEventListener('popstate', handlePopState);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('popstate', handlePopState);
		}
	});
  
	router.navigate = navigate;
	router.getQueryParam = (key) => router.query[key];
	router.hasQueryParam = (key) => Object.prototype.hasOwnProperty.call(router.query, key);
	router.removeQueryParams = removeQueryParams;
	setContext('router', router);
  </script>
  
  <slot />
