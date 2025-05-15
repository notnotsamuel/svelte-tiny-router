import type { SvelteComponent } from 'svelte';

export interface RouteProps {
  path?: string;
  component?: typeof SvelteComponent;
}

export default class Route extends SvelteComponent<RouteProps> {}
