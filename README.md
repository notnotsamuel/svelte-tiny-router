# Svelte tiny Router

A simple and efficient declarative routing library for Svelte 5 built with runes.

## Install
```
npm i svelte-tiny-router
```

## Use
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
  import { navigate } from 'svelte-tiny-router';

  function goToAbout() {
    navigate('/about');
  }
</script>

<button on:click={goToAbout}>Go to About Page</button>
```

### get query strings
```svelte
<!-- SomeComponent.svelte -->
<script>
  import { useTinyRouter } from 'svelte-tiny-router';
  const router = useTinyRouter();

  // Check if the "foo" query parameter exists (i.e /myroute?foo=bar) and log it
  if (router.hasQueryParam('foo')) {
    console.log("Value of foo:", router.getQueryParam('foo'));
  }
</script>
```

## Type Definitions

This library now includes TypeScript definitions, providing improved type checking and autocompletion for users of TypeScript or JavaScript with JSDoc.
