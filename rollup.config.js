import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import replace from '@rollup/plugin-replace'
import vinfo from './lib/mkversion.js'

const production = !process.env.ROLLUP_WATCH;


function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'app', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'assets/build/cpb.js'
	},
	plugins: [
		replace({
			__CPB_NAME: JSON.stringify('Commonplace Book'),
			__CPB_SHORT: JSON.stringify('CPB'),
      __CPB_ENV: JSON.stringify(production ? 'production' : 'development'),
      __CPB_DATE: () => JSON.stringify(new Date()),
      __CPB_VERSION: JSON.stringify(vinfo.version),
      __CPB_RELEASE: JSON.stringify(vinfo.release),
			__CPB_HASH: JSON.stringify(vinfo.hash),
      __CPB_SERIES: JSON.stringify(vinfo.series),
      __CPB_REMAINDER: JSON.stringify(vinfo.remainder),
      __CPB_MAJOR: JSON.stringify(vinfo.major),
      __CPB_MINOR: JSON.stringify(vinfo.minor),
      __CPB_PATCH: JSON.stringify(vinfo.patch),
    }),
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'cpb.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		json(),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),
		!production && livereload('assets/data/css'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
