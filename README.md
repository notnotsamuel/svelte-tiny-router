
# Svelte tiny Router

A simple and efficient declarative routing library for Svelte 5 built with runes.

```svelte
<!-- App.svelte -->
<script>
  import { Router, Route, navigate } from 'svelte-tiny-router';
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

```js
// SomeComponent.svelte
<script>
  import { navigate } from 'svelte-tiny-router';

  function goToAbout() {
    navigate('/about');
  }
</script>

<button on:click={goToAbout}>Go to About Page</button>
```
