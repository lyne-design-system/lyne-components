import { isServer } from 'lit';

/**
 *  Check whether it's a string or an HTMLElement, if it's a string queries the element with the
 *  corresponding id.
 *  @param reference either the wanted id or the HTMLElement
 */
export function findReferencedElement<T extends HTMLElement = HTMLElement>(
  reference: string | HTMLElement,
): T | null {
  if (isServer) {
    return null;
  } else if (typeof reference === 'string') {
    return document.getElementById(reference) as T;
  } else if (reference instanceof window.Element) {
    return reference as T;
  }
  return null;
}
