// import { plugin, type BunPlugin } from "bun";
// import { transformFile, Options as SWCOptions } from '@swc/core';
// import deepmerge from 'deepmerge';
// import Bun from 'bun';
import {es5BunPlugin} from './es5BunPlugin';

// const result = await Bun.build({
// 	entrypoints: ['./src/main/resources/**/*.ts'],
// 	outdir: './build/resources/main',
// 	root: './src/main/resources'
// });

// for (const result of result.outputs) {
// 	// Can be consumed as blobs
// 	await result.text();

// 	// Bun will set Content-Type and Etag headers
// 	new Response(result);

// 	// Can be written manually, but you should use `outdir` in this case.
// 	Bun.write(path.join("out", result.path), result);
// }

const build = await Bun.build({
	// entrypoints: ['./src/main/resources/site/**/*.ts'],
	// outdir: './build/resources/main/site',
	// root: './src/main/resources/site'

	entrypoints: ['./src/main/resources/site/pages/samplePage/samplePage.ts'],
	external: [],
	// define: {},

	// format: 'cjs', // Not yet supported
	format: 'esm',

	loader: {
		// ".ts": "swc",
	},

	// minify: true, // default false
	// minify: {
	// 	identifiers: true,
	// 	whitespace: true,
	// 	syntax: true
	// }

	// naming: "[dir]/[name].[ext]", // [hash]
	// naming: {
	// 	entry: '[dir]/[name].[ext]',
	// 	chunk: '[name]-[hash].[ext]',
	// 	asset: '[name]-[hash].[ext]'
	// },

	outdir: './build/resources/main',
	plugins: [
		es5BunPlugin()
	],
	root: './src/main/resources',
	splitting: false, // default: false
	sourcemap: "none", // default: "none" | "external" | "inline"
	target: 'node',
});
// console.log('build:%s', JSON.stringify(build, null, 4));

for (const output of build.outputs) {
	await output.arrayBuffer(); // => ArrayBuffer
	await output.text(); // string
}

export {} // To make it a module
