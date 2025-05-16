import type { SvelteComponent } from 'svelte';
import type { NavigationGuard } from './Router.svelte.d.ts'; // Import for beforeEach type

export interface RouterContext {
  base: string; // Base path of the current router instance
  fullPath: string; // Full URL path
  path: string; // Path relative to the current router's base
  fromPath: string | null; // Previous fullPath
  routes: string[];
  query: Record<string, string>;
  beforeEach?: NavigationGuard[]; // Optional array of navigation guards
  isWildcardChildContext?: boolean; // Internal flag for nested routers under wildcards
  navigate: (to: string, options?: { replace?: boolean }) => void;
  getQueryParam: (key: string) => string | undefined;
  hasQueryParam: (key: string) => boolean;
}

export function useTinyRouter(): RouterContext;
