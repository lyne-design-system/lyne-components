export type ElementRectangle = Pick<
  HTMLElement,
  'scrollHeight' | 'clientHeight' | 'offsetHeight' | 'scrollWidth' | 'clientWidth' | 'offsetWidth'
>;

export interface SbbAlignment {
  horizontal: 'start' | 'center' | 'end';
  vertical: 'above' | 'below';
}

export interface SbbElementPositionInfos {
  top: number;
  left: number;
  maxHeight: string;
  alignment: SbbAlignment;
}

/**
 * Gets height and width of an element even if it's hidden (`display: none`).
 */
export function getElementRectangle(el: HTMLElement): ElementRectangle {
  const elementStyle = window.getComputedStyle(el),
    elementDisplay = elementStyle.display,
    elementMaxHeight = parseInt(elementStyle.maxHeight, 10).toString();

  // If it is not hidden we just return normal height
  if (elementDisplay !== 'none' && elementMaxHeight !== '0') {
    return {
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      offsetHeight: el.offsetHeight,
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      offsetWidth: el.offsetWidth,
    };
  }

  // The element is hidden so:
  // make the el block in order to measure its height but still be hidden
  el.style.position = 'absolute';
  el.style.visibility = 'hidden';
  el.style.display = 'block';

  const scrollHeight = el.scrollHeight,
    clientHeight = el.clientHeight,
    offsetHeight = el.offsetHeight,
    scrollWidth = el.scrollWidth,
    clientWidth = el.clientWidth,
    offsetWidth = el.offsetWidth;

  // Reverting to the original values
  el.style.display = '';
  el.style.position = '';
  el.style.visibility = '';

  return { scrollHeight, clientHeight, offsetHeight, scrollWidth, clientWidth, offsetWidth };
}

/**
 * Determines whether an event is fired on a specific element.
 */
export function isEventOnElement(element: HTMLElement, event: MouseEvent | PointerEvent): boolean {
  if (!element || !event) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  return (
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width
  );
}

/**
 * Determines the position of an element relative to a trigger element by evaluating
 * the optimal position based on the available space.
 *
 * @param element The element of which to calculate the position.
 * @param trigger The element relative to which to calculate the position.
 * @param container The element which has the position:fixed applied.
 * @param properties Properties to take into account in calculations (optional).
 * @param properties.verticalOffset The distance to be added between the element and the trigger (optional).
 * @param properties.horizontalOffset The horizontal offset to be applied to the element (optional).
 * @param properties.centered Whether the element should be placed in the center by default (optional).
 * @param properties.responsiveHeight Whether the element calculates its height based on its content (optional).
 * @returns Returns an object containing the left position, the top position, the maximum height
 * of the element and the current alignment object.
 */
export function getElementPosition(
  element: HTMLElement,
  trigger: HTMLElement,
  container: HTMLElement,
  properties?: {
    verticalOffset?: number;
    horizontalOffset?: number;
    centered?: boolean;
    responsiveHeight?: boolean;
  },
): SbbElementPositionInfos {
  const maxWidthOffset = 16;
  const verticalOffset = properties?.verticalOffset || 0;
  const horizontalOffset = properties?.horizontalOffset || 0;
  const responsiveHeight = properties?.responsiveHeight || false;

  const triggerRec = trigger.getBoundingClientRect();
  const elementRec = getElementRectangle(element);

  const triggerLeft = triggerRec.left;
  const triggerTop = triggerRec.top;

  const availableSpaceRight =
    document.documentElement.clientWidth - (triggerLeft + triggerRec.width);
  const availableSpaceAbove = triggerTop - verticalOffset;
  const availableSpaceBelow =
    document.documentElement.clientHeight - (triggerTop + triggerRec.height + verticalOffset);

  // Default element alignment is "start/below"
  let elementXPosition = triggerLeft;
  let elementYPosition = triggerTop + triggerRec.height + verticalOffset;
  let elementXOverflow = elementRec.offsetWidth - triggerRec.width;
  const alignment: SbbAlignment = { horizontal: 'start', vertical: 'below' };

  // Calculate element max-height
  let elementMaxHeight = `${availableSpaceBelow - verticalOffset}px`;

  // Check if horizontal alignment needs to be changed to "center"
  if (
    properties?.centered &&
    triggerLeft - maxWidthOffset + triggerRec.width / 2 > elementRec.offsetWidth / 2 &&
    availableSpaceRight - maxWidthOffset > elementXOverflow / 2
  ) {
    elementXPosition -= elementXOverflow /= 2;
    alignment.horizontal = 'center';
  }

  // Check if horizontal alignment needs to be changed to "end"
  if (availableSpaceRight < elementXOverflow && triggerLeft > elementXOverflow) {
    elementXPosition = elementXPosition - elementXOverflow;
    alignment.horizontal = 'end';
  }

  // Add horizontal offset
  if (
    horizontalOffset &&
    alignment.horizontal !== 'center' &&
    triggerRec.width / 2 < horizontalOffset
  ) {
    elementXPosition += horizontalOffset * (alignment.horizontal === 'start' ? -1 : 1);
  }

  // Check whether there is insufficient space on both sides
  if (
    (triggerLeft < elementXOverflow && availableSpaceRight < elementXOverflow) ||
    document.documentElement.clientWidth < elementRec.offsetWidth
  ) {
    elementXPosition = document.documentElement.clientWidth / 2 - elementRec.offsetWidth / 2;
  }

  // Check if vertical alignment needs to be changed to "above":
  if (
    (availableSpaceBelow - verticalOffset < elementRec.scrollHeight &&
      availableSpaceAbove - verticalOffset >
        (responsiveHeight ? elementRec.clientHeight : elementRec.scrollHeight)) ||
    (availableSpaceAbove > availableSpaceBelow &&
      availableSpaceBelow - verticalOffset < elementRec.clientHeight &&
      !responsiveHeight)
  ) {
    elementYPosition =
      availableSpaceAbove < elementRec.scrollHeight
        ? elementYPosition - triggerRec.height - availableSpaceAbove - verticalOffset
        : triggerTop - elementRec.clientHeight - verticalOffset;

    elementMaxHeight = `${availableSpaceAbove - verticalOffset}px`;
    alignment.vertical = 'above';
  }

  const containerRect = container.getBoundingClientRect();

  // When zooming in Safari the container rectangle contains negative values for the position
  // and we need to re-add them to the calculated coordinates.
  if (containerRect.left < 0) {
    elementXPosition -= containerRect.left;
  }

  // Normally the containerRect's top value would be zero, however when the overlay is attached to an input
  // (e.g. in an autocomplete), mobile browsers will shift everything in order to put the input in the middle
  // of the screen and to make space for the virtual keyboard. We need to account for this offset,
  // otherwise our positioning will be thrown off.
  // Additionally, when zooming in Safari this fixes the vertical position.
  if (containerRect.top < 0) {
    elementYPosition -= containerRect.top;
  }

  return {
    top: elementYPosition,
    left: elementXPosition,
    maxHeight: elementMaxHeight,
    alignment: alignment,
  };
}
