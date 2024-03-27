import { Worker } from 'worker_threads';
import { defaultReporter, dotReporter, summaryReporter } from '@web/test-runner';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { puppeteerLauncher } from '@web/test-runner-puppeteer';
import { a11ySnapshotPlugin } from '@web/test-runner-commands/plugins';
import { existsSync } from 'fs';
import * as sass from 'sass';
import { createServer } from 'vite';
import { cpus } from 'node:os';

const isCIEnvironment = !!process.env.CI || process.argv.includes('--ci');
const isDebugMode = process.argv.includes('--debug');
const firefox = process.argv.includes('--firefox');
const webkit = process.argv.includes('--webkit');
const concurrency = process.argv.includes('--parallel') ? {} : { concurrency: 1 };

const globalCss = sass.compile('./src/components/core/styles/global.scss', {
  loadPaths: ['.', './node_modules/'],
});

const browsers = isCIEnvironment
  ? [
      // Parallelism has problems, we need force concurrency to 1
      playwrightLauncher({ product: 'chromium', ...concurrency }),
      playwrightLauncher({ product: 'firefox', ...concurrency }),
      playwrightLauncher({ product: 'webkit', ...concurrency }),
    ]
  : firefox
    ? [playwrightLauncher({ product: 'firefox' })]
    : webkit
      ? [playwrightLauncher({ product: 'webkit' })]
      : isDebugMode
        ? [
            puppeteerLauncher({
              launchOptions: { headless: false, devtools: true },
              ...concurrency,
            }),
          ]
        : [playwrightLauncher({ product: 'chromium' })];

const groupNameOverride = process.argv.includes('--ssr-hydrated')
  ? 'e2e-ssr-hydrated'
  : process.argv.includes('--ssr-non-hydrated')
    ? 'e2e-ssr-non-hydrated'
    : null;

const testRunnerHtml = (testFramework, _config, group) => `
<!DOCTYPE html>
<html>
  <head>
    <meta name="testEnvironment" ${isDebugMode ? 'debug' : ''}>
    <meta name="testGroup" content="${groupNameOverride ?? group?.name ?? 'default'}">
    <style type="text/css">${globalCss.css}</style>
  </head>
  <body class="sbb-disable-animation">
    <script type="module" src="/src/components/core/testing/test-setup.ts"></script>
    <script type="module" src="${testFramework}"></script>
  </body>
</html>
`;

// Slow down fast cpus to not run into too much fetches
function resolveConcurrency() {
  const localCpus = cpus();
  const factor = localCpus.some((el) => el.model.includes('Apple M')) ? 4 : 2;
  return Math.floor(localCpus.length / factor);
}

/** @type {import('@web/test-runner').TestRunnerConfig} */
export default {
  files: ['src/**/*.{e2e,spec}.ts'],
  groups: [
    // Disable ssr tests until stabilized.
    // { name: 'e2e-ssr-hydrated', files: 'src/**/*.e2e.ts', testRunnerHtml },
    // { name: 'e2e-ssr-non-hydrated', files: 'src/**/*.e2e.ts', testRunnerHtml },
  ],
  nodeResolve: true,
  concurrency: resolveConcurrency(),
  reporters:
    isDebugMode || !isCIEnvironment
      ? [defaultReporter(), patchedSummaryReporter()]
      : [minimalReporter()],
  browsers: browsers,
  plugins: [vitePlugin(), a11ySnapshotPlugin()],
  testFramework: {
    config: {
      timeout: '10000',
      slow: '1000',
      failZero: true,
    },
  },
  coverageConfig: {
    exclude: ['**/node_modules/**/*', '**/assets/*.svg', '**/*.scss'],
  },
  filterBrowserLogs: (log) =>
    log.args[0] !==
    'Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.',
  testRunnerHtml,
};

/** @type {import('@web/test-runner-core').Reporter} */
function minimalReporter() {
  const base = dotReporter();
  const log = (result) =>
    process.stdout.write(result.passed ? '.' : result.skipped ? '~' : '\x1b[31mx\x1b[0m');
  function logResults(results) {
    results?.tests?.forEach(log);
    results?.suites?.forEach(logResults);
  }
  const collectorBase = { suites: 0, tests: 0, passed: 0, failed: 0, skipped: 0 };
  /** @param {import('@web/test-runner-core').TestSession[]} sessions */
  function aggregateSessions(sessions) {
    const browserResults = new Map();
    for (const session of sessions) {
      if (!browserResults.has(session.browser.name)) {
        browserResults.set(session.browser.name, { ...collectorBase });
      }
      aggregateSuites(session.testResults, browserResults.get(session.browser.name));
    }
    return Array.from(browserResults).sort((a, b) => a[0].localeCompare(b[0]));
  }
  /** @param {import('@web/test-runner-core').TestSuiteResult} results */
  function aggregateSuites(results, collector = { ...collectorBase }) {
    collector.suites += 1;
    results?.tests?.forEach((result) => {
      collector.tests += 1;
      if (result.passed) {
        collector.passed += 1;
      } else if (result.skipped) {
        collector.skipped += 1;
      } else {
        collector.failed += 1;
      }
    });
    results?.suites?.forEach((s) => aggregateSuites(s, collector));
    return collector;
  }
  const p = (v) => v.toString().padStart(6, ' ');

  return {
    ...base,
    reportTestFileResults({ sessionsForTestFile: sessions }) {
      for (const session of sessions) {
        logResults(session.testResults);
      }
    },
    /** @param {import('@web/test-runner-core').TestRunFinishedArgs} args */
    onTestRunFinished(args) {
      const browserResults = aggregateSessions(args.sessions);
      console.log('');
      console.group('Test Summary:');
      for (const [browser, collector] of browserResults) {
        console.group(browser);
        console.log(`Suites:  ${p(collector.suites)}`);
        console.log(`Tests:   ${p(collector.tests)}`);
        console.log(`Passed:  ${p(collector.passed)}`);
        console.log(`Failed:  ${p(collector.failed)}`);
        console.log(`Skipped: ${p(collector.skipped)}`);
        console.groupEnd();
      }
      console.groupEnd();
      base.onTestRunFinished(args);
    },
  };
}

// See https://github.com/modernweb-dev/web/issues/2325
/** @type {import('@web/test-runner-core').Reporter} */
function patchedSummaryReporter() {
  // https://github.com/modernweb-dev/web/blob/master/packages/test-runner/src/logger/TestRunnerLogger.ts
  class TestRunnerLogger {
    loggedSyntaxErrors = new Map();
    debugLogging = false;

    log = (...messages) => console.log(...messages);
    debug = (...messages) => this.debugLogging && console.debug(...messages);
    error = (...messages) => console.error(...messages);
    warn = (...messages) => console.warn(...messages);
    group = () => console.group();
    groupEnd = () => console.groupEnd();
    logSyntaxError(error) {
      const { message, code, filePath, column, line } = error;
      let errors = this.loggedSyntaxErrors.get(filePath);
      if (!errors) {
        errors = [];
        this.loggedSyntaxErrors.set(filePath, errors);
      } else if (
        errors.find(
          (e) => e.code === code && e.message === message && e.column === column && e.line === line,
        )
      ) {
        // dedupe syntax errors we already logged
        return;
      }
      errors.push(error);
    }
    clearLoggedSyntaxErrors = () => (this.loggedSyntaxErrors = new Map());
  }
  const base = summaryReporter();
  const logger = new TestRunnerLogger();
  return {
    ...base,
    reportTestFileResults(args) {
      base.reportTestFileResults({ ...args, logger });
    },
  };
}

// Reference: https://github.com/remcovaes/web-test-runner-vite-plugin
function vitePlugin() {
  let viteServer;
  const litSsrPluginCommand = 'lit-ssr-render';

  return {
    name: 'vite-plugin',

    async serverStart({ app, fileWatcher }) {
      const externals = [
        // @web/test-runner-commands needs to establish a web-socket
        // connection. It expects a file to be served from the
        // @web/dev-server. So it should be ignored by Vite.
        '/__web-dev-server__web-socket.js',
      ];

      viteServer = await createServer({
        clearScreen: false,
        plugins: [
          {
            name: 'file-name',
            transform(_src, id) {
              const file = id.split('?')[0];
              if (!file.startsWith('\0') && existsSync(file)) {
                fileWatcher.add(id);
              }
            },
          },
          {
            name: 'mark-external',
            resolveId: (id) => (externals.includes(id) ? { id, external: true } : undefined),
          },
        ],
        // Disable hmr in favor of the @web/test-runner to take care of restarts.
        server: { hmr: false },
        // This configuration is necessary, as vite will otherwise detect dependencies
        // that can be optimized. This will cause vite to reload, which leads to
        // 'Could not import your test module.' errors, that happen randomly.
        // Excluding the dependencies, prevents this from happening at the cost of slightly
        // increased test times.
        optimizeDeps: {
          noDiscovery: true,
        },
      });
      await viteServer.listen();

      const vitePort = viteServer.config.server.port;
      const viteProtocol = viteServer.config.server.https ? 'https' : 'http';

      app.use(async (ctx) => {
        const response = await fetch(`${viteProtocol}://localhost:${vitePort}${ctx.originalUrl}`);
        ctx.set(Object.fromEntries(response.headers));
        ctx.body = await response.text();
        ctx.status = response.status;
      });
    },
    async serverStop() {
      return await viteServer.close();
    },
    // Reference: https://github.com/lit/lit/blob/main/packages/labs/testing/src/lib/lit-ssr-plugin.ts
    // This is necessary until https://github.com/privatenumber/tsx/issues/354 is fixed
    async executeCommand({ command, payload }) {
      if (command !== litSsrPluginCommand) {
        return undefined;
      } else if (!payload) {
        throw new Error(`Missing payload for ${litSsrPluginCommand} command`);
      }

      const { template, modules } = payload;
      const resolvedModules = modules.map((m) => new URL(`.${m}`, import.meta.url).pathname);
      return new Promise((resolve, reject) => {
        const worker = new Worker(new URL('./config/lit-ssr-worker.js', import.meta.url), {
          workerData: { template, modules: resolvedModules },
        });
        worker.on('error', reject);
        worker.on('message', resolve);
      });
    },
  };
}
