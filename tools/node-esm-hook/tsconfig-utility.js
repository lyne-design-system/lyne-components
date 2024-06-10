/**
 * This file contains utility function for tsconfig.json.
 */

import { readFileSync } from 'node:fs';

export const root = new URL('../../', import.meta.url).href;
export const tsconfigRaw = readFileSync(new URL('./tsconfig.json', root), 'utf8');

// We need to resolve the TypeScript alias paths, in order to allow imports to local packages.
const tsPaths = Object.entries(
  JSON.parse(
    tsconfigRaw.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => (g ? '' : m)),
  ).compilerOptions.paths,
);

/**
 * Creates a resolver function, which allows resolving alias import paths.
 * The resolver function returns an url as string, if the import path was an alias, null if not.
 * @param {string | undefined} base An optional base for resolving the paths.
 * @return {(specifier: string) => string | null}
 */
export const createAliasResolver = (/** @type {'src' | 'dist'} */ mode = 'src') => {
  const aliasPaths = tsPaths.map(([alias, paths]) => {
    let path = mode === 'dist' ? paths[0].replace('src/', `dist/`) : paths[0];
    path = new URL(path.startsWith('.') ? path : `./${path}`, root).href;
    if (alias.endsWith('*')) {
      alias = alias.replace(/\*$/, '');
      path = path.replace(/\*$/, '');
      return {
        match: (/** @type {string} */ specifier) => specifier.startsWith(alias),
        resolve: (/** @type {string} */ specifier) => specifier.replace(alias, path),
      };
    } else {
      return {
        match: (/** @type {string} */ specifier) => specifier === alias,
        resolve: (/** @type {string} */ _specifier) => path,
      };
    }
  });
  const aliasPrefixes = tsPaths
    .map(([p]) => p.split('/')[0])
    .filter((v, i, a) => a.indexOf(v) === i);

  return (/** @type {string} */ specifier) =>
    aliasPrefixes.some((p) => specifier.startsWith(p))
      ? aliasPaths.find((a) => a.match(specifier))?.resolve(specifier) ?? null
      : null;
};
