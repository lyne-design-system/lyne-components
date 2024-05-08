import { join } from 'path';

import { defineConfig, mergeConfig, type UserConfig } from 'vite';

import {
  copyAssets,
  copySass,
  customElementsManifest,
  distDir,
  dts,
  resolveEntryPoints,
  isProdBuild,
  packageJsonTemplate,
  typography,
  verifyEntryPoints,
} from '../../tools/vite/index.js';
import rootConfig from '../../vite.config.js';

const packageRoot = new URL('.', import.meta.url);
// Include all directories containing an index.ts
const entryPoints = resolveEntryPoints(packageRoot, ['core', 'core/styles/**/']);
const barrelExports = Object.keys(entryPoints)
  .map((e) => join(packageRoot.pathname, e))
  .sort()
  .filter((v, _i, a) => a.some((e) => e.startsWith(`${v}/`)))
  .map((e) => `${e}.ts`);

const buildStyleExports = (fileNames: string[]): Record<string, { style: string }> =>
  fileNames.reduce(
    (obj, fileName) => ({ ...obj, [`./${fileName}`]: { style: `./${fileName}` } }),
    {},
  );

export default defineConfig((config) =>
  mergeConfig(rootConfig, <UserConfig>{
    root: packageRoot.pathname,
    plugins: [
      ...(config.command === 'build' ? [dts()] : []),
      ...(isProdBuild(config)
        ? [
            customElementsManifest(),
            packageJsonTemplate({
              exports: {
                '.': { sass: './_index.scss' },
                ...buildStyleExports([
                  'a11y.css',
                  'animation.css',
                  'badge.css',
                  'core.css',
                  'font-characters-extension.css',
                  'standard-theme.css',
                  'layout.css',
                  'lists.css',
                  'normalize.css',
                  'typography.css',
                ]),
              },
            }),
            copyAssets(['_index.scss', '../../README.md']),
            copySass('core/styles'),
            typography(),
            verifyEntryPoints(),
          ]
        : []),
    ],
    build: {
      cssMinify: isProdBuild(config),
      lib: {
        entry: entryPoints,
        formats: ['es'],
      },
      minify: isProdBuild(config),
      outDir: new URL(`./components/${isProdBuild(config) ? '' : 'development/'}`, distDir)
        .pathname,
      emptyOutDir: true,
      sourcemap: isProdBuild(config) ? false : 'inline',
      rollupOptions: {
        external: (source: string, importer: string | undefined) => {
          if (
            source.match(/(^lit$|^lit\/|^@lit\/|^@lit-labs\/)/) ||
            (!!importer && source.startsWith('../') && !importer.includes('/node_modules/')) ||
            (!!importer && barrelExports.includes(importer) && source.match(/\.\/[a-z-]+/))
          ) {
            if (source.includes('.scss')) {
              throw Error(`Do not import scss from another directory.
               Re export sass via barrel export (index.ts). See button/common.ts.
               Source: ${source}.
               Importer: ${importer}.`);
            }

            return true;
          }
        },
      },
    },
    assetsInclude: ['_index.scss', 'core/styles/**/*.scss', 'README.md'],
  }),
);
