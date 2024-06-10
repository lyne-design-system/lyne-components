import {
  summaryReporter,
  type ErrorWithLocation,
  type Logger,
  type Reporter,
} from '@web/test-runner';

// See https://github.com/modernweb-dev/web/issues/2325
export function patchedSummaryReporter(): Reporter {
  // https://github.com/modernweb-dev/web/blob/master/packages/test-runner/src/logger/TestRunnerLogger.ts
  class TestRunnerLogger implements Logger {
    public loggedSyntaxErrors = new Map<string, ErrorWithLocation[]>();
    public debugLogging = false;

    public log = (...messages: unknown[]): void => console.log(...messages);
    public debug = (...messages: unknown[]): void =>
      (this.debugLogging && console.debug(...messages)) || undefined;
    public error = (...messages: unknown[]): void => console.error(...messages);
    public warn = (...messages: unknown[]): void => console.warn(...messages);
    public group = (): void => console.group();
    public groupEnd = (): void => console.groupEnd();
    public logSyntaxError(error: ErrorWithLocation): void {
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
    public clearLoggedSyntaxErrors(): void {
      this.loggedSyntaxErrors = new Map();
    }
  }
  const base = summaryReporter({});
  const logger = new TestRunnerLogger();
  return {
    ...base,
    reportTestFileResults(args) {
      base.reportTestFileResults!({ ...args, logger });
    },
  };
}
