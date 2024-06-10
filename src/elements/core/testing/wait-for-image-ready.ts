import type { SbbImageElement } from '../../image.js';

export async function waitForImageReady(
  element: HTMLImageElement | SbbImageElement,
  timeoutInMilliseconds = 2 * 1000,
): Promise<void> {
  if (!element.complete) {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject('image loading timeout'), timeoutInMilliseconds);
      element.addEventListener('load', () => {
        clearTimeout(timeout);
        resolve();
      });
      element.addEventListener('error', () => {
        clearTimeout(timeout);
        reject('image error');
      });
    });
  }
}
