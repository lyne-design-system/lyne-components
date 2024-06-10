/* eslint-disable  @typescript-eslint/consistent-type-imports */
/// <reference types="vite/client" />

declare module '*?lit&inline' {
  const src: import('lit').CSSResultGroup;
  export default src;
}

declare module '@custom-elements-manifest/analyzer/cli' {
  export const cli: (...args) => Promise<void>;
}

declare module 'virtual:screenshots' {
  export const screenshotsRaw: import('./visual-regression-app/src/interfaces').ScreenshotMap;
}
