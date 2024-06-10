import { parseArgs } from 'node:util';

import { litSsrPlugin } from '@lit-labs/testing/web-test-runner-ssr-plugin.js';
import {
  defaultReporter,
  type TestRunnerConfig,
  type TestRunnerCoreConfig,
  type TestRunnerGroupConfig,
} from '@web/test-runner';
import { a11ySnapshotPlugin } from '@web/test-runner-commands/plugins';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { puppeteerLauncher } from '@web/test-runner-puppeteer';
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import { initCompiler } from 'sass';

import {
  minimalReporter,
  patchedSummaryReporter,
  visualRegressionConfig,
  vitePlugin,
} from './tools/web-test-runner/index.js';

const { values: cliArgs } = parseArgs({
  strict: false,
  options: {
    ci: { type: 'boolean', default: !!process.env.CI },
    debug: { type: 'boolean' },
    'all-browsers': { type: 'boolean', short: 'a' },
    firefox: { type: 'boolean' },
    webkit: { type: 'boolean' },
    parallel: { type: 'boolean' },
    'update-visual-baseline': { type: 'boolean' },
    group: { type: 'string' },
    'ssr-hydrated': { type: 'boolean' },
    'ssr-non-hydrated': { type: 'boolean' },
  },
});

const concurrency = cliArgs.parallel ? {} : { concurrency: 1 };

const stylesCompiler = initCompiler();
const renderStyles = (): string =>
  stylesCompiler.compile('./src/elements/core/styles/standard-theme.scss', {
    loadPaths: ['.', './node_modules/'],
  }).css;

const browsers =
  cliArgs.ci || cliArgs['all-browsers']
    ? // Parallelism has problems, we need force concurrency to 1
      (['chromium', 'firefox', 'webkit'] as const).map((product) =>
        playwrightLauncher({ product, ...concurrency }),
      )
    : cliArgs.firefox
      ? [playwrightLauncher({ product: 'firefox' })]
      : cliArgs.webkit
        ? [playwrightLauncher({ product: 'webkit' })]
        : cliArgs.debug
          ? [
              puppeteerLauncher({
                launchOptions: { headless: false, devtools: true },
                ...concurrency,
              }),
            ]
          : [playwrightLauncher({ product: 'chromium' })];

const groupNameOverride = cliArgs['ssr-hydrated']
  ? 'ssr-hydrated'
  : cliArgs['ssr-non-hydrated']
    ? 'ssr-non-hydrated'
    : null;

const testRunnerHtml = (
  testFramework: string,
  _config: TestRunnerCoreConfig,
  group?: TestRunnerGroupConfig,
): string => `
<!DOCTYPE html>
<html lang='en'>
  <head>
    <link
      rel="preload"
      href="https://cdn.app.sbb.ch/fonts/v1_6_subset/SBBWeb-Roman.woff2"
      as="font"
      type="font/woff2"
      crossorigin="anonymous"
    />
    <link
      rel="preload"
      href="https://cdn.app.sbb.ch/fonts/v1_6_subset/SBBWeb-Bold.woff2"
      as="font"
      type="font/woff2"
      crossorigin="anonymous"
    />
    <link
      rel="preload"
      href="https://cdn.app.sbb.ch/fonts/v1_6_subset/SBBWeb-Light.woff2"
      as="font"
      type="font/woff2"
      crossorigin="anonymous"
    />
    <style type="text/css">${renderStyles()}</style>
    <script>
      globalThis.testEnv = '${cliArgs.debug ? 'debug' : ''}';
      globalThis.testGroup = '${groupNameOverride ?? group?.name ?? 'default'}';
    </script>
  </head>
  <body class="sbb-disable-animation">
    <script type="module" src="/src/elements/core/testing/test-setup.ts"></script>
    <script type="module" src="${testFramework}"></script>
  </body>
</html>
`;

// A list of log messages, that should not be printed to the test console.
const suppressedLogs = [
  'Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.',
  '[vite] connecting...',
];

const groups: TestRunnerGroupConfig[] = [
  // Disable ssr tests until stabilized.
  { name: 'ssr-hydrated', files: 'src/**/*.ssr.spec.ts', testRunnerHtml },
  // { name: 'ssr-non-hydrated', files: 'src/**/*.e2e.ts', testRunnerHtml },
];

// The visual regression test group is only added when explicitly set, as the tests are very expensive.
if (cliArgs.group === 'visual-regression') {
  groups.push({ name: 'visual-regression', files: 'src/**/*.visual.spec.ts', testRunnerHtml });
}

export default {
  files: ['src/**/*.spec.ts', '!**/*.{visual,ssr}.spec.ts'],
  groups,
  nodeResolve: true,
  reporters:
    cliArgs.debug || !cliArgs.ci
      ? [defaultReporter(), patchedSummaryReporter()]
      : [minimalReporter()],
  browsers: browsers,
  plugins: [
    a11ySnapshotPlugin(),
    litSsrPlugin(),
    vitePlugin(),
    visualRegressionPlugin({
      ...visualRegressionConfig,
      update: !!cliArgs['update-visual-baseline'],
    }),
  ],
  testFramework: {
    config: {
      timeout: '10000',
      slow: '1000',
      failZero: true,
    },
  },
  coverageConfig: {
    exclude: ['**/node_modules/**/*', '**/assets/*.svg', '**/assets/*.png', '**/*.scss'],
  },
  filterBrowserLogs: (log) => !suppressedLogs.includes(log.args[0]),
  testRunnerHtml,
} satisfies TestRunnerConfig;
