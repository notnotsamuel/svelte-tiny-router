```markdown
# Svelte Simple Router

A simple and efficient declarative routing library for Svelte 5 built with runes.

Svelte Simple Router leverages Svelte 5’s new runes (e.g. `$state`, `$derived`, `$props`) to provide a lightweight, reactive routing solution. It allows you to define routes declaratively with `<Router>` and `<Route>` components, supports dynamic route segments, and includes an imperative `navigate` function for programmatic navigation.

## Features

- **Declarative Routing:** Define your routes using `<Router>` and `<Route>` components.
- **Dynamic Parameters:** Supports dynamic segments in paths (e.g. `/user/:id`).
- **Reactive Updates:** Built with Svelte 5 runes for efficient reactivity.
- **Imperative Navigation:** Use the `navigate` function to change routes programmatically.
- **SSR Support:** Optionally initialize the router with a starting URL.

## Installation

Install the router via npm (or yarn):

```bash
npm install svelte-simple-router
# or
yarn add svelte-simple-router
```

## Usage

### Basic Example

Wrap your route definitions in a `<Router>` component, and define individual routes with `<Route>`. For example:

```svelte
<!-- App.svelte -->
<script>
  import { Router, Route, navigate } from 'svelte-simple-router';
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

### Programmatic Navigation

To navigate imperatively (for example, in event handlers), import and use the `navigate` function:

```js
// SomeComponent.svelte
<script>
  import { navigate } from 'svelte-simple-router';

  function goToAbout() {
    navigate('/about');
  }
</script>

<button on:click={goToAbout}>Go to About Page</button>
```

## API Overview

### `<Router>`

The `<Router>` component establishes the routing context for its descendants. It creates a reactive state for the current URL path and listens for history changes. You can optionally pass a `url` prop (useful for server-side rendering):

```svelte
<Router url="/initial/path">
  <!-- Your routes go here -->
</Router>
```

### `<Route>`

The `<Route>` component compares its `path` prop against the current URL. It supports dynamic segments (e.g. `/user/:id`) and, when a match is found, either renders the specified `component` or its default slot. Matched parameters are passed as props.

```svelte
<!-- Using a component -->
<Route path="/user/:id" component={User} />

<!-- Using a slot with parameter exposure -->
<Route path="/profile">
  <p let:params>
    Profile Page. Params: {JSON.stringify(params)}
  </p>
</Route>
```

### `navigate(to, options)`

The `navigate` function allows you to programmatically change the route. It updates the browser history (using `pushState` or `replaceState`) and triggers a reactive update in the `<Router>`.

```js
import { navigate } from 'svelte-simple-router';

// Navigate to "/contact" using pushState
navigate('/contact');

// Navigate to "/login" and replace the current history entry
navigate('/login', { replace: true });
```

## Development

### Building the Lib

This project uses Rollup to bundle the library for both CommonJS and ES module formats.

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Build:**

   ```bash
   npm run build
   ```

   The build output will be generated in the `dist` folder.

3. **Watch for changes (development mode):**

   ```bash
   npm run dev
   ```

## Contributing

Contributions are welcome! Please fork the repository and open a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
