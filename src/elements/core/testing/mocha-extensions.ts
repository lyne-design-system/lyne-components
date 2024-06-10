import type { Func, Suite, Test } from 'mocha';

/**
 * Skip the `describe` if the condition is not met
 */
export const describeIf = (
  condition: boolean,
  title: string,
  fn: (this: Suite) => void,
): Suite | void => {
  if (condition) {
    return Mocha.describe(title, fn);
  }
};

/**
 * Skip the `test` if the condition is not met
 */
export const testIf = (condition: boolean, title: string, fn?: Func): Test | void => {
  if (condition) {
    return Mocha.test(title, fn);
  }
};
