# Svelte tiny Router

A simple and efficient declarative routing library for Svelte 5 built with runes.

## Install
```
npm i svelte-tiny-router
```

## Use

Here's a basic example demonstrating simple routes:

```svelte
<!-- App.svelte -->
<script>
  import { Router, Route } from 'svelte-tiny-router';
  import Home from './Home.svelte';
  import About from './About.svelte';
  import User from './User.svelte';
</script>

<Router>
  <!-- Exact match for home page -->
  <Route path="/" component={Home} />

  <!-- Static route -->
  <Route path="/about" component={About} />

  <!-- Dynamic route: "/user/123" will match and pass { id: "123" } as a prop -->
  <Route path="/user/:id" component={User} />

  <!-- Fallback route: no "path" prop means it always matches (e.g. for a 404 page) -->
  <Route>
    <p>Page not found.</p>
  </Route>
</Router>
```

### route
```svelte
<!-- App.svelte -->
<script>
  import { Router, Route } from 'svelte-tiny-router';
  import Home from './Home.svelte';
  import About from './About.svelte';
  import User from './User.svelte';
</script>

<Router>
  <!-- Exact match for home page -->
  <Route path="/" component={Home} />

  <!-- Static route -->
  <Route path="/about" component={About} />

  <!-- Dynamic route: "/user/123" will match and pass { id: "123" } as a prop -->
  <Route path="/user/:id" component={User} />

  <!-- Fallback route: no "path" prop means it always matches (e.g. for a 404 page) -->
  <Route>
    <p>Page not found.</p>
  </Route>
</Router>
```

### navigate
```svelte
<!-- SomeComponent.svelte -->
<script>
  import { useTinyRouter } from 'svelte-tiny-router';
  const router = useTinyRouter();

  function goToAbout() {
    router.navigate('/about'); // Use router.navigate
  }

  function goToUser(id) {
    router.navigate(`/user/${id}`);
  }

  function replaceWithHome() {
    router.navigate('/', { replace: true }); // Replace current history entry
  }

  function navigateWithQuery() {
    router.navigate('/search?q=svelte&category=router'); // Navigate with query string
  }
</script>

<button on:click={goToAbout}>Go to About Page</button>
<button on:click={() => goToUser(123)}>Go to User 123</button>
<button on:click={replaceWithHome}>Replace with Home</button>
<button on:click={navigateWithQuery}>Search</button>
```

### get query strings
```svelte
<!-- SomeComponent.svelte -->
<script>
  import { useTinyRouter } from 'svelte-tiny-router';
  const router = useTinyRouter();

  // Access the entire query object
  console.log("Current query:", router.query);

  // Check if the "foo" query parameter exists (i.e /myroute?foo=bar) and log it
  if (router.hasQueryParam('foo')) {
    console.log("Value of foo:", router.getQueryParam('foo'));
  }

  // Get a specific query parameter
  const searchTerm = router.getQueryParam('q');
  console.log("Search term:", searchTerm);
</script>
```

## Navigation Guards (`beforeEach`)

You can define navigation guards using the `beforeEach` prop on the `<Router>` component. These guards are functions that are executed before each navigation. They can be used to cancel navigation, redirect to a different route, or perform asynchronous tasks like authentication checks.

```svelte
<!-- App.svelte (with navigation guards) -->
<script>
  import { Router, Route } from 'svelte-tiny-router';
  import Home from './Home.svelte';
  import AdminDashboard from './AdminDashboard.svelte';
  import Login from './Login.svelte';

  // Example authentication check function
  function isAuthenticated() {
    // Replace with your actual auth logic (e.g., check token in localStorage)
    return localStorage.getItem('authToken') !== null;
  }

  // Define navigation guards
  const authGuard = async ({ to, from, next }) => {
    console.log('[authGuard] Navigating from:', from?.path, 'to:', to.path, 'Query:', to.query);
    if (to.path.startsWith('/admin') && !isAuthenticated()) {
      console.log('Authentication required for admin route, redirecting to login.');
      // Redirect to login page, replacing the current history entry
      next({ path: '/login', replace: true });
    } else {
      // Continue navigation
      next();
    }
  };

  const loggingGuard = ({ to, from, next }) => {
    console.log('[LOG] Navigation attempt:', from?.path || 'N/A', '->', to.path, 'Query:', to.query);
    next(); // Always call next() to proceed
  };

  const myGuards = [loggingGuard, authGuard]; // Guards are executed in order
</script>

<Router beforeEach={myGuards}>
  <Route path="/" component={Home} />
  <Route path="/admin" component={AdminDashboard} />
  <Route path="/login" component={Login} />
  <Route>
    <p>Page not found.</p>
  </Route>
</Router>
```

A navigation guard function receives an object with the following properties:
-   `to`: An object representing the target route (`{ path: string, params: Record<string, string>, query: Record<string, string> }`).
-   `from`: An object representing the current route, or `null` if this is the initial navigation (`{ path: string, params: Record<string, string>, query: Record<string, string> } | null`).
-   `next`: A function that must be called to resolve the hook.
    -   `next()`: Proceed to the next hook in the pipeline, or to the navigation if no more hooks are left.
    -   `next(false)`: Cancel the current navigation.
    -   `next('/path')` or `next({ path: '/path', replace: true })`: Redirect to a different location. The current navigation is cancelled, and a new one is initiated.

## Nested Routing

The library supports nested routing, particularly useful with wildcard routes (`/*`). When a wildcard route matches, it automatically sets up a `NestedRouterProvider` context for its children `<Route>` components. These children routes then match paths relative to the parent wildcard's matched segment.

For example, with a structure like:
```svelte
<Router>
  <Route path="/app/*">
    <Route path="/" component={AppHome} /> {/* Matches /app */}
    <Route path="/settings" component={AppSettings} /> {/* Matches /app/settings */}
  </Route>
</Router>
```
Navigating to `/app/settings` will first match the `/app/*` route. The `NestedRouterProvider` within `/app/*` then makes `/settings` match relative to `/app`.

Alternatively, you can render a separate component that contains its own `<Router>` instance for nested routes. This component will receive the matched parameters from the parent route.

```svelte
<!-- App.svelte -->
<script>
  import { Router, Route } from 'svelte-tiny-router';
  import Home from './Home.svelte';
  import About from './About.svelte';
  import User from './User.svelte';
  import DashboardRouter from './DashboardRouter.svelte'; // Component containing nested routes
</script>

<Router>
  <Route path="/" component={Home} />
  <Route path="/about" component={About} />
  <Route path="/user/:id" component={User} />

  <!-- Wildcard route rendering a component that contains a nested router -->
  <Route path="/dashboard/*" component={DashboardRouter} />

  <Route>
    <p>Page not found.</p>
  </Route>
</Router>
```

```svelte
<!-- DashboardRouter.svelte -->
<script>
  import { Router, Route } from 'svelte-tiny-router';
  import DashboardHome from './DashboardHome.svelte';
  import Profile from './Profile.svelte';
  import Settings from './Settings.svelte';

  // This component receives params from the parent route if any were captured
  // let { paramFromParent } = $props(); // Example if /dashboard/:param/* was used
</script>

<!-- This Router instance handles routes relative to the parent's matched path (/dashboard) -->
<Router>
  <Route path="/" component={DashboardHome} /> {/* Matches /dashboard */}
  <Route path="/profile" component={Profile} /> {/* Matches /dashboard/profile */}
  <Route path="/settings" component={Settings} /> {/* Matches /dashboard/settings */}
  <!-- Nested fallback for /dashboard/* -->
  <Route>
    <p>Dashboard page not found.</p>
  </Route>
</Router>
```

## Type Definitions

This library now includes comprehensive TypeScript definitions, providing improved type checking and autocompletion for users of TypeScript or JavaScript with JSDoc. Key types include `RouterContext`, `RouteInfo`, `NavigationGuard`, and `NextFunction`.
