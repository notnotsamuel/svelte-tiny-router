import type { SvelteComponent } from 'svelte';

export interface RouterContext {
  path: string;
  routes: string[];
  query: Record<string, string>;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  getQueryParam: (key: string) => string | undefined;
  hasQueryParam: (key: string) => boolean;
}

export function useTinyRouter(): RouterContext;
