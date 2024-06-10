import type { TemplateResult } from 'lit';
import { html } from 'lit';

const IS_OPEN_OVERLAY_QUERY = `:is(sbb-dialog, sbb-navigation, sbb-menu, sbb-overlay)[data-state='opened']`;

/**
 * Used to create the "wrapping" effect around the anchor for overlays (es. autocomplete)
 * Works in conjunction with the 'overlayGapFixCorners()' function in 'overlay.ts'
 */
export function overlayGapFixCorners(): TemplateResult {
  return html`
    <div class="sbb-gap-fix-wrapper">
      <div class="sbb-gap-fix-corner" id="left"></div>
    </div>
    <div class="sbb-gap-fix-wrapper">
      <div class="sbb-gap-fix-corner" id="right"></div>
    </div>
  `;
}

/**
 * Returns all the ancestors of the overlay.
 */
const getAncestors = (overlay: HTMLElement, root: HTMLElement): HTMLElement[] => {
  let el = overlay.parentElement;
  const ancestors: HTMLElement[] = [];
  while (el) {
    ancestors.push(el);
    if (el !== root) {
      el = el.parentElement;
    } else {
      break;
    }
  }
  return ancestors;
};

/**
 * Set the inert and the data-sbb-inert attributes.
 */
const setSbbInert = (el: HTMLElement): void => {
  if (!el.inert) {
    el.inert = true;
    if (el.matches(IS_OPEN_OVERLAY_QUERY)) {
      el.setAttribute('data-sbb-inert', `${+el.getAttribute('data-sbb-inert')! + 1 || 0}`);
    } else {
      el.toggleAttribute('data-sbb-inert', true);
    }
  }

  if (!el.hasAttribute('aria-hidden')) {
    el.setAttribute('aria-hidden', 'true');
    el.toggleAttribute('data-sbb-aria-hidden', true);
  }
};

/**
 * Removes the inert and the data-sbb-inert attributes.
 */
const removeSbbInert = (el: HTMLElement): void => {
  if (el.hasAttribute('data-sbb-inert')) {
    el.inert = false;
    el.removeAttribute('data-sbb-inert');
  }

  if (el.hasAttribute('data-sbb-aria-hidden')) {
    el.removeAttribute('aria-hidden');
    el.removeAttribute('data-sbb-aria-hidden');
  }
};

/**
 * Applies inert to every other element on the page except the overlay.
 */
export function applyInertMechanism(overlay: HTMLElement): void {
  removeSbbInert(overlay);

  const overlayRoot = overlay.closest('body > *') as HTMLElement;
  const documentChildren = Array.from(document.querySelectorAll('body > *')).filter(
    (el) => el !== overlayRoot,
  ) as HTMLElement[];

  documentChildren.forEach((el) => setSbbInert(el));

  let children: HTMLElement[] = [];
  const ancestors = getAncestors(overlay, overlayRoot);

  for (const el of ancestors) {
    children = children.concat(
      Array.from(el.children).filter(
        (el: Element) => el !== overlay && !ancestors.includes(el as HTMLElement),
      ) as HTMLElement[],
    );
    if (el.matches(IS_OPEN_OVERLAY_QUERY)) {
      el.setAttribute('data-sbb-inert', `${+el.getAttribute('data-sbb-inert')! + 1 || 0}`);
    }
  }

  children.forEach((el) => setSbbInert(el));
}

export function removeInertMechanism(): void {
  const openOverlays = Array.from(
    document.documentElement.querySelectorAll(IS_OPEN_OVERLAY_QUERY),
  ) as HTMLElement[];

  if (openOverlays.length) {
    openOverlays.forEach((el) => {
      const newValue = +el.getAttribute('data-sbb-inert')! - 1;
      el.setAttribute('data-sbb-inert', `${newValue}`);

      if (newValue && newValue < 0) {
        removeSbbInert(el);
        Array.from(el.children).forEach((el: Element) => removeSbbInert(el as HTMLElement));
      }
    });
    return;
  }

  Array.from(document.documentElement.querySelectorAll('[data-sbb-inert]')).forEach((el: Element) =>
    removeSbbInert(el as HTMLElement),
  );
}
declare global {
  interface GlobalEventHandlersEventMap {
    willOpen: CustomEvent<void>;
    willClose: CustomEvent<void>;
    didOpen: CustomEvent<void>;
    didClose: CustomEvent<void>;
  }
}
