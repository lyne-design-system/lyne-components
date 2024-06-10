import { isServer } from 'lit';

/**
 * Looks for the closest element matching the given selector starting from the given element.
 * Returns null, if none of the ancestor match.
 *
 * @param selector The selector to match ancestor against.
 * @param element The base element from which to start the search.
 * @returns The closest element matching the selector or null if none is found.
 */
export function hostContext(selector: string, element: Element): Element | null {
  if (isServer) {
    return null;
  }
  // Start with parent element in order to avoid finding element itself
  element = element.parentElement ?? (element.getRootNode() as ShadowRoot).host;
  while (element && (element as any) !== document && (element as any) !== window) {
    const match = element.closest(selector);
    if (match) {
      return match;
    }

    element = (element.getRootNode() as ShadowRoot).host;
  }

  return null;
}

// A list of elements that should not allow another anchor or button element inside them.
// Needs to be extended if additional elements fall into this category.
export const ACTION_ELEMENTS = 'a,button,sbb-teaser-hero,sbb-teaser';
