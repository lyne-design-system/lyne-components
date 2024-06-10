/**
 * Set the attribute only if value is not 'false', otherwise remove attribute.
 * @param element The element that will have the attribute
 * @param attribute The attribute name
 * @param value The attribute value
 */
export function setOrRemoveAttribute(element: HTMLElement, attribute: string, value?: any): void {
  if (!value) {
    element.removeAttribute(attribute);
  } else {
    element.setAttribute(attribute, value);
  }
}
