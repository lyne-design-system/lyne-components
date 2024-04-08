import { dirname, join } from 'path';

import { defineConfig, mergeConfig, type UserConfig } from 'vite';

import {
  copyAssets,
  copySass,
  customElementsManifest,
  distDir,
  dts,
  globIndexMap,
  isProdBuild,
  packageJsonTemplate,
  typography,
} from '../../tools/vite';
import rootConfig from '../../vite.config';

const packageRoot = new URL('.', import.meta.url);
// Include all directories containing an index.ts
const entryPoints = globIndexMap(packageRoot);
const barrelExports = Object.keys(entryPoints)
  .map((e) => join(packageRoot.pathname, dirname(e)))
  .sort()
  .filter((v, _i, a) => a.some((e) => e.startsWith(`${v}/`)))
  .map((e) => `${e}/index.ts`);

/* eslint-disable @typescript-eslint/no-use-before-define */
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
                './typography.css': {
                  style: './typography.css',
                },
              },
            }),
            copyAssets(['_index.scss', '../../README.md']),
            copySass('core/styles'),
            typography(),
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
      rollupOptions: {
        external: (source: string, importer: string | undefined) => {
          if (
            source.match(/(^lit$|^lit\/|^@lit\/|^@lit-labs\/)/) ||
            (!!importer && source.startsWith('../') && !importer.includes('/node_modules/')) ||
            (!!importer && barrelExports.includes(importer) && source.match(/\.\/[a-z-]+/))
          ) {
            if (source.includes('.scss')) {
              throw Error(`Do not import scss from another directory.
               Re export sass via barrel export (index.ts). See button/common/index.ts.
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
