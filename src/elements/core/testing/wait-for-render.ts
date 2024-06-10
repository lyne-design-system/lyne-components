import type { ReactiveElement } from 'lit';

import type { SbbHydrationMixinType } from '../mixins.js';

/**
 * Tests if an element is a Lit `ReactiveElement`.
 *
 * @param element the element to test.
 * @return true if the element is a `ReactiveElement`.
 */
export const isReactiveElement = (
  element: Element,
): element is ReactiveElement & Partial<SbbHydrationMixinType> => {
  return Boolean((element as ReactiveElement).updateComplete);
};

const promiseComplete = Promise.resolve();

/**
 * Waits for all Lit `ReactiveElement` children of the given parent node to
 * finish rendering.
 *
 * @param root a parent node to wait for rendering on.
 */
export const waitForLitRender = async (root: ParentNode): Promise<void> => {
  const completables = [root as Element, ...root.querySelectorAll('*')]
    .filter(isReactiveElement)
    .map((e) => [
      e.updateComplete,
      e.hydrationComplete ?? promiseComplete,
      waitForLitRender(e.renderRoot),
    ])
    .flat(Infinity);
  await Promise.all(completables);
};
