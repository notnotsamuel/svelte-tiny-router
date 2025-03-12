import { getContext } from 'svelte';

export { default as Router } from './Router.svelte';
export { default as Route } from './Route.svelte';
export { navigate } from './navigate.js';

// retrieve the router context
export function useTinyRouter() {
  return getContext('router');
}
