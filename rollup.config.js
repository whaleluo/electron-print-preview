import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2'
import glob from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
export default {
	input: Object.fromEntries(
		glob.sync('src/**/*.ts').map(file => [
			// This remove `src/` as well as the file extension from each
			// file, so e.g. src/nested/foo.js becomes nested/foo
			path.relative(
				'src',
				file.slice(0, file.length - path.extname(file).length)
			),
			// This ewxpands the relative paths to absolute paths, so e.g.
			// src/nested/foo becomes /project/src/nested/foo.js
			fileURLToPath(new URL(file, import.meta.url))
		])
	),
	output: {
		format: 'cjs',
		dir: 'dist'
	},
	external: ['electron'],
	plugins: [
		// Compile TypeScript files
		typescript({ useTsconfigDeclarationDir: true ,allowSyntheticDefaultImports:true}),
		resolve(), // so Rollup can find `ms`
		babel({ babelHelpers: 'bundled' }),
		commonjs() // so Rollup can convert `ms` to an ES module
	]
};
// export default [
// 	// browser-friendly UMD build
// 	{
// 		input: Object.fromEntries(
// 			glob.sync('src/**/*.js').map(file => [
// 				// This remove `src/` as well as the file extension from each
// 				// file, so e.g. src/nested/foo.js becomes nested/foo
// 				path.relative(
// 					'src',
// 					file.slice(0, file.length - path.extname(file).length)
// 				),
// 				// This expands the relative paths to absolute paths, so e.g.
// 				// src/nested/foo becomes /project/src/nested/foo.js
// 				fileURLToPath(new URL(file, import.meta.url))
// 			])
// 		),
// 		output: {
// 			format: 'cjs',
// 			dir: 'dist'
// 		},
// 		// output: {
// 		// 	file: pkg.main,
// 		// 	name: libraryName,
// 		// 	format: 'cjs',
// 		// 	sourcemap: true,
// 		// },
// 		external: ['electron'],
// 		plugins: [
// 			// Compile TypeScript files
// 			typescript({ useTsconfigDeclarationDir: true }),
// 			resolve(), // so Rollup can find `ms`
// 			babel({ babelHelpers: 'bundled' }),
// 			commonjs() // so Rollup can convert `ms` to an ES module
// 		]
// 	},
//
// 	// CommonJS (for Node) and ES module (for bundlers) build.
// 	// (We could have three entries in the configuration array
// 	// instead of two, but it's quicker to generate multiple
// 	// builds from a single configuration where possible, using
// 	// an array for the `output` option, where we can specify
// 	// `file` and `format` for each target)
// 	// {
// 	// 	input: 'src/main.js',
// 	// 	external: ['ms'],
// 	// 	output: [
// 	// 		{ file: pkg.main, format: 'cjs' },
// 	// 		{ file: pkg.module, format: 'es' }
// 	// 	]
// 	// }
// ];
