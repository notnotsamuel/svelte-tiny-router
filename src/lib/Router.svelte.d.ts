import type { Component } from 'svelte';

export interface RouteInfo {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

export type NextFunction = (nextArg?: boolean | string | { path: string; params?: Record<string, string>; query?: Record<string, string> }) => void;

export type NavigationGuard = (context: {
  to: RouteInfo;
  from: RouteInfo | null;
  next: NextFunction;
}) => void | Promise<void>;

export interface RouterProps {
  url?: string;
  beforeEach?: NavigationGuard[];
}

declare const Router: Component<RouterProps>;
export default Router;
