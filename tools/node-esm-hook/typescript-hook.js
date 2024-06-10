// @ts-check

/**
 * The TypeScript hook checks for each import, if a corresponding .ts file exists in our repository
 * (and if the corresponding .js file is missing). If that is the case the import path is resolved
 * to the .ts file.
 * Once the load hook for this file is called, it will dynamically compile the file with esbuild.
 * Source maps will only work if Node.js is executed with --enable-source-maps.
 */

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { transform } from 'esbuild';

import { createAliasResolver, root, tsconfigRaw } from './tsconfig-utility.js';

const aliasResolver = createAliasResolver();
const assertTypeScriptFilePath = (/** @type {string?} */ url) => {
  const tsUrl = url?.replace(/.js$/, '.ts');
  return tsUrl && url && !existsSync(fileURLToPath(url)) && existsSync(fileURLToPath(tsUrl))
    ? tsUrl
    : null;
};

/**
 * @param {string} specifier - The specifier of the resource to resolve.
 * @param {object} context - The context in which the resolve function is called.
 * @param {function} nextResolve - The function to call if nothing is done.
 * @returns {Promise} - A Promise that resolves with an object containing the format, shortCircuit flag, and url of the resource,
 * or rejects with an error.
 */
export async function resolve(specifier, context, nextResolve) {
  let url = null;
  if (
    (specifier.startsWith('.') || specifier.startsWith(root)) &&
    !specifier.includes('/node_modules/') &&
    context.parentURL?.startsWith(root)
  ) {
    url = assertTypeScriptFilePath(new URL(specifier, context.parentURL).href);
  } else {
    url = assertTypeScriptFilePath(aliasResolver(specifier));
  }
  return url ? { format: 'module', shortCircuit: true, url } : nextResolve(specifier, context);
}

/**
 * @param {string} url - The URL of the resource to load as a string.
 * @param {object} context - The context in which the load function is called.
 * @param {function} nextLoad - The function to call if this loader does nothing.
 * @returns {Promise} - A Promise that resolves with an object containing the format, shortCircuit flag, and source of the resource,
 * or rejects with an error.
 */
export async function load(url, context, nextLoad) {
  if (url.startsWith(root) && !url.includes('/node_modules/') && url.endsWith('.ts')) {
    const sourcefile = fileURLToPath(url);
    const content = readFileSync(sourcefile, 'utf8');

    const result = await transform(content, {
      loader: 'ts',
      define: {
        'import.meta.env.DEV': 'true',
        'import.meta.env.PROD': 'false',
      },
      tsconfigRaw,
      sourcefile: fileURLToPath(url),
      sourcemap: 'inline',
      sourcesContent: false,
    });
    return { format: 'module', shortCircuit: true, source: result.code };
  }
  return nextLoad(url, context);
}
