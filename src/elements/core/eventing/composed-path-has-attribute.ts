/**
 * Check if there is an element in the composed path that has 'attribute'
 *
 * @param event The event object
 * @param attribute The attribute to look for.
 * @param endElement The boundary where the path will be cut, endElement excluded. If null or not present, the whole path will be used.
 * @returns The element that has 'attribute', undefined otherwise.
 */
export function composedPathHasAttribute(
  event: Event,
  attribute: string,
  endElement: Element | null = null,
): HTMLElement | undefined {
  const composedPath = event.composedPath();
  let endElementIndex: number | undefined = composedPath.findIndex((elem) => elem === endElement);

  if (endElementIndex === -1) {
    endElementIndex = undefined;
  }

  return composedPath
    .slice(0, endElementIndex)
    .find((e) => e instanceof window.HTMLElement && e.hasAttribute(attribute)) as HTMLElement;
}
