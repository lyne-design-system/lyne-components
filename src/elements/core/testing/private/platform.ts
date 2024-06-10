import { isServer } from 'lit';

/**
 * This is a custom implementation.
 * In the `web-test-runner.config` we add data attributes to the body with additional information.
 */
export const isTestEnvironment = !isServer && 'testEnv' in globalThis;

/**
 * This is a custom implementation.
 * True if the `testEnvironment` meta tag has the `debug` attribute
 */
export const isDebugEnvironment = !isServer && (globalThis as any).testEnv === 'debug';

/**
 * This is a custom implementation.
 * Returns true, if this is run in the SSR with hydration test group.
 */
export const isHydratedSsr = !isServer && (globalThis as any).testGroup === 'ssr-hydrated';

/**
 * This is a custom implementation.
 * Returns true, if this is run in the SSR without hydration test group.
 */
export const isNonHydratedSsr = !isServer && (globalThis as any).testGroup === 'ssr-non-hydrated';

/**
 * This is a custom implementation.
 * Returns true, if this is run in an SSR test group.
 */
export const isSsr = isHydratedSsr || isNonHydratedSsr;

/**
 * This is a custom implementation.
 * Returns true, if this is run in the visual regression test group.
 */
export const isVisualRegressionRun =
  !isServer && (globalThis as any).testGroup === 'visual-regression';
