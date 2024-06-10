import {
  dotReporter,
  type Reporter,
  type TestResult,
  type TestSession,
  type TestSuiteResult,
} from '@web/test-runner';

export function minimalReporter(): Reporter {
  const base = dotReporter();
  const log = (result: TestResult): boolean =>
    process.stdout.write(result.passed ? '.' : result.skipped ? '~' : '\x1b[31mx\x1b[0m');
  function logResults(results: TestSuiteResult | undefined): void {
    results?.tests?.forEach(log);
    results?.suites?.forEach(logResults);
  }
  const collectorBase = { suites: 0, tests: 0, passed: 0, failed: 0, skipped: 0 };
  function aggregateSessions(sessions: TestSession[]): [string, typeof collectorBase][] {
    const browserResults = new Map<string, typeof collectorBase>();
    for (const session of sessions) {
      if (!browserResults.has(session.browser.name)) {
        browserResults.set(session.browser.name, { ...collectorBase });
      }
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      aggregateSuites(session.testResults, browserResults.get(session.browser.name));
    }
    return Array.from(browserResults).sort((a, b) => a[0].localeCompare(b[0]));
  }
  function aggregateSuites(
    results: TestSuiteResult | undefined,
    collector = { ...collectorBase },
  ): typeof collectorBase {
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
  const p = (v: number): string => v.toString().padStart(6, ' ');

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
      base.onTestRunFinished!(args);
    },
  };
}
