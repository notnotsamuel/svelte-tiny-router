<script>
  import { setContext } from 'svelte';

  let { parentCtx, matchedPath } = $props();

  const matchedBaseSegments = matchedPath.slice(0, -2).split('/').filter(Boolean); // e.g., ['dashboard'] from '/dashboard/*'
  
  // Calculate the new base path for children of the wildcard route.
  // It combines the parent's base with the static part of the matched wildcard path.
  let newBaseForChildren = parentCtx.base.replace(/\/$/, ''); // Ensure no trailing slash from parent base
  if (matchedBaseSegments.length > 0) {
    newBaseForChildren += '/' + matchedBaseSegments.join('/');
  }
  
  // Normalize newBaseForChildren: ensure it starts with '/', does NOT end with '/', unless it's the root '/'
  if (newBaseForChildren !== '/') {
	newBaseForChildren = ('/' + newBaseForChildren.replace(/^\/+|\/+$/g, '')).replace(/\/\//g, '/');
	if (newBaseForChildren === '') newBaseForChildren = '/'; // Handle case where it might become empty
  }


  // Calculate the path for the children's context. This is the remaining part of the parent's *relative* path
  // after the part matched by the wildcard's static segments.
  const parentRelativePathSegments = parentCtx.path.split('/').filter(Boolean);
  const remainingChildPath = '/' + parentRelativePathSegments.slice(matchedBaseSegments.length).join('/');

  const contextForSlot = {
    ...parentCtx, // Inherit most properties (navigate, query utils, fullPath, etc.)
    path: remainingChildPath, // Path relative to the newBaseForChildren
    base: newBaseForChildren, // The new base path for this nested scope
    routes: [], // Nested router instances get their own routes array
    
    // These are signals for a nested Router to know it's under a wildcard
    isWildcardChildContext: true, 
    // fromPath will be inherited or updated by the nested Router itself.
  };

  setContext('router', contextForSlot);
</script>

<slot />
