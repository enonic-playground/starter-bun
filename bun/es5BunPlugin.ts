import { plugin, type BunPlugin } from "bun";
import {
	transformFile,
	transformFileSync,
	Options as SWCOptions
} from '@swc/core';
import deepmerge from 'deepmerge';

export function es5BunPlugin(): BunPlugin {
	return {
		name: "es5",
		setup(build) {
			// console.log('build:%s', JSON.stringify(build, null, 4));

			const buildOptions = build.initialOptions || {};
			// console.log('buildOptions:%s', JSON.stringify(buildOptions, null, 4));

			const sourceMaps = buildOptions.sourcemap === 'none'
				? false
				: buildOptions.sourcemap === 'inline'
					? 'inline'
					: buildOptions.sourcemap === 'external' ?
						true
						: false;
			// build.onLoad({ filter: options?.filter || /\.([tj]sx?|mjs)$/ }, args => {
			build.onLoad({ filter: /\.([tj]sx?|mjs)$/ }, args => {
				// console.log('args:%s', JSON.stringify(args, null, 4));

				const isTs = args.path.endsWith('.ts') || args.path.endsWith('.tsx');
				const isReact = args.path.endsWith('.jsx') || args.path.endsWith('.tsx');
				// console.log('isTs:%s, isReact:%s', isTs, isReact);

				let transformOptions: SWCOptions = {
					// env: {
					// 	// forceAllTransforms: true
					// },
					jsc: {
						/**
						 * Use external helpers to avoid duplicate helpers in the output.
						 * esbuild muse has alias `@swc/helpers`
						 */
						// externalHelpers: true,
						keepClassNames: true,
						parser: {
							// decorators: true,
							// decoratorsBeforeExport: true,
							syntax: isTs ? 'typescript' : 'ecmascript',
							tsx: isReact
						},
						target: 'es5',
						// transform: {
						// 	// "legacyDecorator": true // Legacy (stage 1) class decorators syntax and behavior.
						// }
					},
					module: {
						// ignoreDynamic: false, // If set to true, dynamic imports will be preserved.
						// importInterop: 'swc', // Defaults to none if noInterop is true, and swc otherwise.
						// lazy: false,

						// Defaults to false. By default, when using exports with swc a non-enumerable __esModule property is exported.
						// This property is then used to determine if the import is the default export or if it contains the default export.
						// In cases where the auto-unwrapping of default is not needed,
						// you can set the noInterop option to true to avoid the usage of the interopRequireDefault helper (shown in inline form above).
						// noInterop: false,

						// strict: false, // To prevent the __esModule property from being exported, you can set the strict option to true.
						// strictMode: true, // If true, swc emits 'use strict' directive.

						// type: 'amd'
						// type: 'commonjs' // Didn't help, still uses export rather than exports :(
						type: 'es6' // esm-to-cjs support this, not commonjs?
						// type: 'umd'
					},
					/**
					 * Generate inline source maps to enable esbuild to properly handle sourcemaps.
					 */
					sourceMaps,
					isModule: true,
				};

				if (buildOptions?.swc) {
					transformOptions = deepmerge(transformOptions, buildOptions?.swc);
				}
				// console.log('transformOptions:%s', JSON.stringify(transformOptions, null, 4));

				const output = transformFileSync(args.path, transformOptions);
				// console.log('output:%s', JSON.stringify(output, null, 4));
				const {
					code,
					map
				} = output;
				// console.log('code:%s', code);

				// const exports = new Promise</*OnLoadResult*/>(resolve => {
				// 	transformFile(args.path, transformOptions)
				// 		.then(({ code }) => {
				// 			resolve({ contents: code, loader: 'js' });
				// 		})
				// 		.catch(error => {
				// 			// resolve({ pluginName: 'es5', errors: [convertError(error)] });
				// 			resolve({ pluginName: 'es5', errors: [error] });
				// 		});
				// });

				return {
					contents: code,
					// exports: code,
					// loader: "object", // special loader for JS objects
					loader: "js"
					// loader: "ts"
				};
			});
		},
	}
}
/*
import swc from '@swc/core';
import { type BunPlugin } from 'bun';
import { merge } from 'lodash';

type SwcPluginOptions = {
  swc?: swc.Options;
};

const swcPlugin = (options?: SwcPluginOptions): BunPlugin => ({
  name: 'bun-plugin-swc',
  setup: (build) => {
    build.onLoad({ filter: /\.ts$/ }, async (args) => {
      const output = await swc.transformFile(
        args.path,
        merge(options?.swc, {
          jsc: {
            keepClassNames: true,
            parser: {
              decorators: true,
              dynamicImport: true,
              syntax: 'typescript'
            },
            preserveAllComments: true,
            target: 'esnext',
            transform: {
              decoratorMetadata: true,
              legacyDecorator: true
            }
          },
          module: {
            type: 'es6'
          }
        })
      );
      return {
        contents: output.code,
        loader: 'js'
      };
    });
  }
});

export default swcPlugin;
*/
