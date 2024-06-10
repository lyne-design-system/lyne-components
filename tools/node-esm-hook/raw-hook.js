// @ts-check

/**
 * The raw hook will read any imports containing `?raw` to a string
 */

import { readFileSync } from 'fs';

const root = new URL('../../', import.meta.url).href;

/**
 * @param {string} url - The URL of the resource to load as a string.
 * @param {object} context - The context in which the load function is called.
 * @param {function} nextLoad - The function to call if this loader does nothing.
 * @returns {Promise} - A Promise that resolves with an object containing the format, shortCircuit flag, and source of the resource,
 * or rejects with an error.
 */
export function load(url, context, nextLoad) {
  if (url.startsWith(root) && url.includes('?raw')) {
    const content = readFileSync(new URL(url).pathname, 'utf8');
    return Promise.resolve({
      format: 'module',
      shortCircuit: true,
      source: `export default \`${content.replace(/`/g, '\\`')}\`;`,
    });
  }
  return nextLoad(url, context);
}
