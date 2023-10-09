// import { plugin, type BunPlugin } from "bun";
// import { transformFile, Options as SWCOptions } from '@swc/core';
// import deepmerge from 'deepmerge';
// import Bun from 'bun';
// import {manifestBunPlugin} from './manifestBunPlugin';
import * as fs from 'fs';
import * as path from 'path';

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

// CAUTION: These must be realtive to process.cwd() and not starting with dot!
const outdir = 'build/resources/main/static';
const root = 'src/main/resources/static';

const build = await Bun.build({
	entrypoints: ['./src/main/resources/static/App.tsx'],
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
	naming: {
		// entry: '[dir]/[name].[ext]',
		entry: '[dir]/[name]-[hash].[ext]',
		chunk: '[name]-[hash].[ext]',
		asset: '[name]-[hash].[ext]'
	},

	outdir,
	plugins: [
		// manifestBunPlugin() // Nope build.onEnd is not implemented in bun yet :(
	],
	root,
	splitting: false, // default: false

	// sourcemap: "none", // default: "none" | "external" | "inline"
	sourcemap: "external",

	target: 'browser',
});
// console.log('build:%s', JSON.stringify(build, null, 4));

// const resolvedOutdir = path.resolve(outdir);
// console.log('resolvedOutdir:%s', resolvedOutdir);

// const resolvedRoot = path.resolve(root);
// console.log('resolvedRoot:%s', resolvedRoot);

// console.log('__dirname:%s', __dirname); // That's relative to this file :(
// console.log('cwd:%s', process.cwd());

const manifest = {};
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
	if (['entry-point','asset'].includes(output.kind)) {
		const rel = output.path
			.replace(process.cwd(), '')
			.replace(outdir, '')
			.replace(/^\/*/, '');
		// console.log('rel:%s', rel);
		const parts = rel.split('.');
		const ext = parts.pop();
		// console.log('ext:%s', ext);
		const dashParts = parts.pop().split('-');
		// const hash =
		dashParts.pop();
		// console.log('hash:%s', hash);
		// console.log('dashParts:%s', dashParts);
		const filename = `${dashParts.join('-')}.${ext}`;
		manifest[filename] = rel;
	}
}
// console.log('manifest:%s', JSON.stringify(manifest, null, 4));
fs.writeFileSync(path.join(outdir, 'manifest.json'), JSON.stringify(manifest, null, 4));

export {} // To make it a module
