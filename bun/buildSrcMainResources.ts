// import { plugin, type BunPlugin } from "bun";
// import { transformFile, Options as SWCOptions } from '@swc/core';
// import deepmerge from 'deepmerge';
// import Bun from 'bun';
import {es5BunPlugin} from './es5BunPlugin';
// import * as fs from 'fs';
// import * as path from 'path';
// const { runTransform } = require("esm-to-cjs");

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

	// All bundles generated with `target: "bun"` are marked with a special `// @bun` pragma, which
	// indicates to the Bun runtime that there's no need to re-transpile the file before execution.
	// target: 'bun',
	target: 'node',
});
// console.log('build:%s', JSON.stringify(build, null, 4));

// const definePolyfill = fs.readFileSync(path.join(__dirname, 'defineProperty.js'), 'utf8');
// const definePolyfill = fs.readFileSync(path.join(__dirname, 'prr.js'), 'utf8');
// const definePolyfill = fs.readFileSync('node_modules/define-properties/index.js', 'utf8');
// const definePolyfill = fs.readFileSync('node_modules/prr/prr.js', 'utf8');
// console.log('contents:%s', JSON.stringify(definePolyfill, null, 4));

for (const output of build.outputs) {
	// console.log('----------------------------------------');
	// console.log('path:%s', JSON.stringify(output.path, null, 4));
	// console.log('hash:%s', JSON.stringify(output.hash, null, 4));
	// console.log('loader:%s', JSON.stringify(output.loader, null, 4));
	// console.log('kind:%s', JSON.stringify(output.kind, null, 4));
	// console.log('type:%s', JSON.stringify(output.type, null, 4));
	// console.log('size:%s', JSON.stringify(output.size, null, 4));
	// await output.arrayBuffer(); // => ArrayBuffer
	// await output.text(); // string

	// const content = fs.readFileSync(output.path, 'utf8');
	// console.log('contents:%s', JSON.stringify(content, null, 4));
	// const cjs = `var globalThis = (1, eval)('this');`
	// 	+ definePolyfill
	// 	// + `Object.defineProperty = prr.prr;`
	// 	+ content.replace(/export default/, 'exports =');
	// // const cjs = runTransform(content, {});
	// console.log('cjs:%s', JSON.stringify(cjs, null, 4));
	// fs.writeFileSync(output.path, cjs, 'utf8');
}

export {} // To make it a module
