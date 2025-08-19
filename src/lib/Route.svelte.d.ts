import type { Component, Snippet } from 'svelte';

export interface RouteProps {
  path?: string;
  component?: Component;
  children?: Snippet<[{ params: Record<string, string> }]>;
}

declare const Route: Component<RouteProps>;
export default Route;
