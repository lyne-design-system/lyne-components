import { createHash } from 'crypto';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { relative } from 'path';

import {
  defineConfig,
  mergeConfig,
  type PluginOption,
  type ResolvedConfig,
  type UserConfig,
} from 'vite';

import { distDir } from '../../tools/vite/index.js';
import rootConfig from '../../vite.config.js';

import type { ScreenshotFiles } from './src/interfaces.js';

const packageRoot = new URL('.', import.meta.url);
const screenshotsDir = new URL(`./screenshots/`, distDir);
const assetsScreenshotsDir = 'assets/screenshots/';

const extractHierarchicalMap = (
  screenshots: Omit<ScreenshotFiles, 'viewport'>[],
): Map<string, Map<string, Map<string, ScreenshotFiles[]>>> => {
  const map = new Map<string, Map<string, Map<string, ScreenshotFiles[]>>>();

  screenshots.forEach((screenshotFiles) => {
    const component = screenshotFiles.name.match(/^(.*?)_/)![1];
    const name = screenshotFiles.name.match(/_viewport=.*?_(.*?).png$/)![1];
    const viewport = screenshotFiles.name.match(/viewport=(.*?)_/)![1];

    if (!map.has(component)) {
      map.set(component, new Map());
    }

    const componentsMap = map.get(component)!;

    if (!componentsMap.has(name)) {
      componentsMap.set(name, new Map());
    }

    const testCaseMap = componentsMap.get(name)!;

    if (!testCaseMap.has(viewport)) {
      testCaseMap.set(viewport, []);
    }

    testCaseMap.set(
      viewport,
      testCaseMap.get(viewport)!.concat({ ...screenshotFiles, viewport } satisfies ScreenshotFiles),
    );
  });

  return map;
};

function prepareScreenshots(): PluginOption {
  let viteConfig: ResolvedConfig;
  const virtualModuleId = 'virtual:screenshots';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'prepare screenshot',
    configResolved(config) {
      viteConfig = config;
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        if (!existsSync(screenshotsDir)) {
          return `export const screenshotsRaw = []`;
        }

        const browserNames = readdirSync(screenshotsDir, { withFileTypes: true }).map(
          (d) => d.name,
        );
        const failedScreenshotsHash = createHash('sha256');

        let screenshots = browserNames
          .filter((browserName) => existsSync(new URL(`./${browserName}/failed/`, screenshotsDir)))
          .flatMap((browserName) => {
            const failedDir = new URL(`./${browserName}/failed/`, screenshotsDir);

            return readdirSync(failedDir, {
              withFileTypes: true,
            })
              .filter((d) => !d.name.endsWith('-diff.png'))
              .map((d) => {
                const failedFilePath = new URL(`./${d.name}`, failedDir);
                const diffFilePath = new URL(
                  `./${d.name.replace(/.png$/, '-diff.png')}`,
                  failedDir,
                );
                const baselineFilePath = new URL(
                  `./${browserName}/baseline/${d.name}`,
                  screenshotsDir,
                );

                const isNew = !existsSync(diffFilePath);

                const failedRelativeFileName =
                  assetsScreenshotsDir + relative(screenshotsDir.pathname, failedFilePath.pathname);
                const diffRelativeFileName =
                  assetsScreenshotsDir + relative(screenshotsDir.pathname, diffFilePath.pathname);
                const baselineRelativeFileName =
                  assetsScreenshotsDir +
                  relative(screenshotsDir.pathname, baselineFilePath.pathname);

                if (viteConfig.command !== 'serve') {
                  const failedFileContent = readFileSync(failedFilePath);
                  // We only add the failed screenshot hashes, as the baseline and comparison (*-diff.png)
                  // are not relevant to detect whether it is a new difference.
                  failedScreenshotsHash.update(failedFileContent);
                  this.emitFile({
                    type: 'asset',
                    fileName: failedRelativeFileName,
                    source: failedFileContent,
                  });

                  if (!isNew) {
                    this.emitFile({
                      type: 'asset',
                      fileName: diffRelativeFileName,
                      source: readFileSync(diffFilePath),
                    });

                    this.emitFile({
                      type: 'asset',
                      fileName: baselineRelativeFileName,
                      source: readFileSync(baselineFilePath),
                    });
                  }
                }

                return <ScreenshotFiles>{
                  browserName,
                  name: d.name,
                  failedFile: failedRelativeFileName,
                  diffFile: !isNew ? diffRelativeFileName : undefined,
                  baselineFile: !isNew ? baselineRelativeFileName : undefined,
                  isNew,
                };
              });
          });

        // No Failures, only baseline
        if (screenshots.length === 0) {
          screenshots = browserNames
            .filter((browserName) =>
              existsSync(new URL(`./${browserName}/baseline/`, screenshotsDir)),
            )
            .flatMap((browserName) => {
              const baselineDir = new URL(`./${browserName}/baseline/`, screenshotsDir);

              return readdirSync(baselineDir, {
                withFileTypes: true,
              })
                .filter((d) => d.name.endsWith('.png'))
                .map((d) => {
                  const baselineFilePath = new URL(
                    `./${browserName}/baseline/${d.name}`,
                    screenshotsDir,
                  );

                  const baselineRelativeFileName =
                    assetsScreenshotsDir +
                    relative(screenshotsDir.pathname, baselineFilePath.pathname);

                  if (viteConfig.command !== 'serve') {
                    this.emitFile({
                      type: 'asset',
                      fileName: baselineRelativeFileName,
                      source: readFileSync(baselineFilePath),
                    });
                  }

                  return <ScreenshotFiles>{
                    browserName,
                    name: d.name,
                    baselineFile: baselineRelativeFileName,
                    isNew: false,
                  };
                });
            });
        }

        if (viteConfig.command !== 'serve') {
          this.emitFile({
            type: 'asset',
            fileName: 'diff.json',
            source: JSON.stringify({
              changedAmount: screenshots.filter((f) => !f.isNew).length,
              newAmount: screenshots.filter((f) => f.isNew).length,
              hash: failedScreenshotsHash.digest('hex'),
            }),
          });
        }

        return `export const screenshotsRaw = ${JSON.stringify(
          extractHierarchicalMap(screenshots),
          (_key, value) => (value instanceof Map ? Object.fromEntries(Array.from(value)) : value),
        )}`;
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/assets/screenshots/')) {
          console.log(req.url);
          res.end(readFileSync(new URL(`.${req.url.substring(7)}`, distDir)));
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(() =>
  mergeConfig(rootConfig, <UserConfig>{
    root: packageRoot.pathname,
    plugins: [prepareScreenshots()],
    build: {
      outDir: new URL(`./visual-regression-app/`, distDir).pathname,
      emptyOutDir: true,
    },
  }),
);
