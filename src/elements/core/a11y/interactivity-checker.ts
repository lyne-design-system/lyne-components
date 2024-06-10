export function hasGeometry(element: HTMLElement): boolean {
  // Use logic from jQuery to check for an invisible element.
  // See https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js#L12
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    (typeof element.getClientRects === 'function' && element.getClientRects().length)
  );
}

export interface InterfaceInteractivityChecker {
  isVisible(element: HTMLElement): boolean;
}

export class InteractivityChecker implements InterfaceInteractivityChecker {
  /**
   * Gets whether an element is visible for the purposes of interactivity.
   *
   * This will capture states like `display: none` and `visibility: hidden`, but not things like
   * being clipped by an `overflow: hidden` parent or being outside the viewport.
   *
   * @returns Whether the element is visible.
   */
  public isVisible(element: HTMLElement): boolean {
    return hasGeometry(element) && getComputedStyle(element).visibility === 'visible';
  }
}

class InteractivityCheckerMock implements InterfaceInteractivityChecker {
  public isVisible(): boolean {
    return true;
  }
}

// For unit tests we need to pretend that an element is always visible.
// This can be done by checking if visibility property is set to empty.
export const interactivityChecker: InterfaceInteractivityChecker =
  typeof getComputedStyle === 'undefined' ||
  getComputedStyle(document.documentElement).visibility === ''
    ? new InteractivityCheckerMock()
    : new InteractivityChecker();
