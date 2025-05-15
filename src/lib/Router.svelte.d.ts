import type { SvelteComponent } from 'svelte';

export interface RouterProps {
  url?: string;
}

export default class Router extends SvelteComponent<RouterProps> {}
