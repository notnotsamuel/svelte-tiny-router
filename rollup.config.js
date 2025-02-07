import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
	input: 'src/index.js',
	output: [
		{
			file: 'dist/index.mjs',
			format: 'esm',
			sourcemap: true
		},
		{
			file: 'dist/index.js',
			format: 'cjs',
			sourcemap: true,
			exports: 'named'
		}
	],
	plugins: [
		svelte({
			compilerOptions: {
				// For library builds, you typically don’t want CSS injected in the head.
				css: css => {
					css.write('dist/index.css');
				},
				// Enable run-time checks when not in production
				dev: process.env.NODE_ENV !== 'production'
			}
		}),
		resolve(),
		commonjs()
	],
	external: ['svelte']
};
