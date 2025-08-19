import type { Component } from 'svelte';

export interface RouteProps {
  path?: string;
  component?: Component;
}

declare const Route: Component<RouteProps>;
export default Route;
