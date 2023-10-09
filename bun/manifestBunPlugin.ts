import type {
	BunPlugin
} from "bun";
import {
	BuildResult,
	// Metafile,
	// Plugin,
	// PluginBuild
} from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
// import { plugin } from "bun";

interface ManifestBunPluginOptions {
	// hash?: boolean;
}

export function manifestBunPlugin(options: ManifestBunPluginOptions = {}): BunPlugin {
	// console.log('options:%s', JSON.stringify(options, null, 4));
	return {
		name: "manifest",
		setup(build) {
			// console.log('build:%s', JSON.stringify(build, null, 4));
			build.config.naming = '[dir]/[name]-[hash].[ext]';
			// build.config.naming = {
			// 	entry: '[dir]/[name]-[hash].[ext]',
			// 	chunk: '[name]-[hash].[ext]',
			// 	asset: '[name]-[hash].[ext]'
			// }

			const resolvedEntryPoints = build.initialOptions.entrypoints.map((relPath) => path.resolve(relPath));
			// console.log('resolvedEntryPoints:%s', JSON.stringify(resolvedEntryPoints, null, 4));

			const resolvedOutBase = path.resolve(build.initialOptions.outbase);
			console.log('resolvedOutBase:%s', resolvedOutBase);

			const resolvedOutDir = path.resolve(build.initialOptions.outdir);
			console.log('resolvedOutDir:%s', resolvedOutDir);

			const outdir = build.initialOptions.outdir || path.dirname(build.initialOptions.outfile!);
			// console.log('outdir:%s', JSON.stringify(outdir, null, 4));

			console.log('build:%s', JSON.stringify(build, null, 4));

			// build.module('myVirutalModuleName', () => {
			// 	// console.log('specifier:%s', JSON.stringify(specifier, null, 4));
			// 	// OnLoadResult | Promise<OnLoadResult>
			// 	// return {
			// 	// 	contents: "{}",
			// 	// 	loader: 'json'
			// 	// }
			// 	return {
			// 		exports: {
			// 			foo: "bar"
			// 		},
			// 		loader: "object"
			// 	}
			// });

			build.onLoad({ filter: /\.([tj]sx?|mjs)$/ }, args => {
				// console.log('args:%s', JSON.stringify(args, null, 4));
				// const isTs = args.path.endsWith('.ts') || args.path.endsWith('.tsx');
				// const isReact = args.path.endsWith('.jsx') || args.path.endsWith('.tsx');
				const {
					path,
					// namespace, // file
					loader
				} = args;

				if (resolvedEntryPoints.includes(path)) {
					const relativePath = path.replace(resolvedOutBase, '').replace(/^\//, ''); // TODO Windows?
					// const relativePath = path.relative(resolvedOutBase, path); // Bun haven't implemented this yet :(
					// console.log('relativePath:%s', relativePath);

					// const ext = path.extname(relativePath); // Bun haven't implemented this yet :(
					const ext = relativePath.split('.').pop();
					console.log('ext:%s', ext);

					const pathWithoutExt = relativePath.replace(`.${ext}`, '');
					console.log('pathWithoutExt:%s', pathWithoutExt);

					const relManifestFile = `${pathWithoutExt}.manifest.json`;
					console.log('relManifestFile:%s', relManifestFile);

					const fullManifestFile = `${resolvedOutDir}/${relManifestFile}`;
					console.log('fullManifestFile:%s', fullManifestFile);

					const obj = {
						[`${pathWithoutExt}.js`]: `${pathWithoutExt}-[hash].js`
					}
					const json = JSON.stringify(obj, null, 2);
					console.log('json:%s', json);

					// fs.writeFileSync(fullManifestFile, json);
				}

				return {
					contents: fs.readFileSync(path, "utf8"),
					loader
				};
			});

			// build.onResolve({ filter: /\.([tj]sx?|mjs)$/ }, args => {
			// 	console.log('args:%s', JSON.stringify(args, null, 4));
			// 	const {
			// 		path,
			// 		// importer,
			// 		// namespace,
			// 		// kind,
			// 	} = args;
			// 	return;
			// 	// return { path };
			// });

			// build.onEnd((result: BuildResult) => {
			// 	console.log('result:%s', JSON.stringify(result, null, 4));
			// 	// Only proceed if the build result does not have any errors.
			// 	if (result.errors.length > 0) {
			// 		return;
			// 	}
			// 	// if (build.initialOptions.write === false) {
			// 	// }
			// 	const outdir = build.initialOptions.outdir || path.dirname(build.initialOptions.outfile!);
			// 	const filename = 'manifest.json';
			// 	const fullPath = path.resolve(`${outdir}/${filename}`);
			// 	// const resultObj = options.generate ? options.generate(entries) : entries;
			// 	// const text = JSON.stringify(resultObj, null, 2);
			// 	return fs.promises.writeFile(fullPath, 'aaa');
			// 	// (OnEndResult | null | void | Promise<OnEndResult | null | void>)
			// });
		},
	}
}
