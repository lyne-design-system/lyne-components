/**
 * Add meaningful aria attributes to trigger elements that are connected to
 * overlay elements such as menus and dialogs.
 */
export function setAriaOverlayTriggerAttributes(
  trigger: HTMLElement,
  popupType: 'menu' | 'dialog',
  overlayId: string,
  state: string,
): void {
  if (!trigger) {
    return;
  }

  trigger.setAttribute('aria-haspopup', popupType);
  trigger.setAttribute('aria-controls', overlayId);
  trigger.setAttribute('aria-expanded', `${state === 'opening' || state === 'opened'}`);
}

/**
 * Remove aria attributes from trigger elements.
 */
export function removeAriaOverlayTriggerAttributes(trigger: HTMLElement | null | undefined): void {
  if (!trigger) {
    return;
  }

  trigger.removeAttribute('aria-haspopup');
  trigger.removeAttribute('aria-controls');
  trigger.removeAttribute('aria-expanded');
}

/**
 * Add meaningful aria attributes to trigger element of role='combobox'
 */
export function setAriaComboBoxAttributes(
  trigger: HTMLElement,
  overlayId: string,
  expanded: boolean,
): void {
  if (!trigger) {
    return;
  }

  trigger.setAttribute('autocomplete', 'off');
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-autocomplete', 'list');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-controls', overlayId);
  trigger.setAttribute('aria-owns', overlayId); // From Aria 1.2 this should not be necessary but safari still needs it
  trigger.setAttribute('aria-expanded', `${expanded}`);
}

/**
 * Remove aria attributes from trigger elements.
 */
export function removeAriaComboBoxAttributes(trigger?: HTMLElement): void {
  if (!trigger) {
    return;
  }

  trigger.removeAttribute('autocomplete');
  trigger.removeAttribute('role');
  trigger.removeAttribute('aria-autocomplete');
  trigger.removeAttribute('aria-haspopup');
  trigger.removeAttribute('aria-controls');
  trigger.removeAttribute('aria-owns');
  trigger.removeAttribute('aria-expanded');
}
