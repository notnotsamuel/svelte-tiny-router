import type { RouterContext } from './context';

export { default as Router, type RouterProps } from './Router.svelte';
export { default as Route, type RouteProps } from './Route.svelte';
export { navigate } from './navigate';

/**
 * retrieve the router context
 */
export function useTinyRouter(): RouterContext;

// Export the context type for users
export type { RouterContext };