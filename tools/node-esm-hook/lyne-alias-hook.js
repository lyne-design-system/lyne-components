// @ts-check

/**
 * This hook resolves import paths that start with `@sbb-esta/lyne-` to redirect to the dist
 * directory. This allows our entry point verification step in our vite builds to import
 * the code directly, even though the files contain imports to `@sbb-esta/lyne-` that would
 * not normally resolve and crash.
 */

import { createAliasResolver } from './tsconfig-utility.js';

const dist = new URL('../../dist/', import.meta.url).href;
const aliasResolver = createAliasResolver('dist');

/**
 * @param {string} specifier - The specifier of the resource to resolve.
 * @param {object} context - The context in which the resolve function is called.
 * @param {function} nextResolve - The function to call if nothing is done.
 * @returns {Promise} - A Promise that resolves with an object containing the format, shortCircuit flag, and url of the resource,
 * or rejects with an error.
 */
export async function resolve(specifier, context, nextResolve) {
  const url = context.parentURL?.startsWith(dist) ? aliasResolver(specifier) : null;
  return url ? { format: 'module', shortCircuit: true, url } : nextResolve(specifier, context);
}
