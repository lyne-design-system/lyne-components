import { html, LitElement, type TemplateResult } from 'lit';

import { getDocumentWritingMode, getLocalName } from '../../dom';
import { hostAttributes } from '../host-attributes';

/**
 * Whenever an element can be disabled it has disabled property
 * or formDisabled if it's a form element.
 * Because we can't use types here directly we created this helper type.
 */
type MaybeDisabled = {
  disabled?: boolean;
  formDisabled?: boolean;
};

@hostAttributes({
  dir: getDocumentWritingMode(),
  'data-action': '',
})
export abstract class SbbActionBaseElement extends LitElement {
  protected setupBaseEventHandlers(): void {
    this.addEventListener(
      'click',
      (event) => {
        const maybeDisabled = this as MaybeDisabled;
        if (maybeDisabled.disabled || maybeDisabled.formDisabled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      // capture is necessary here, as this event handler needs to be executed before any other
      // in order to stop immediate propagation in the disabled case.
      { capture: true },
    );
    this.addEventListener(
      'keypress',
      (event: KeyboardEvent): void => {
        if (event.key === 'Enter' || event.key === '\n') {
          this.dispatchClickEvent(event);
        }
      },
      { passive: true },
    );
  }

  protected dispatchClickEvent(event: KeyboardEvent): void {
    const { altKey, ctrlKey, metaKey, shiftKey } = event;
    (event.target as Element).dispatchEvent(
      new PointerEvent('click', {
        bubbles: true,
        cancelable: true,
        composed: true,
        pointerId: -1,
        pointerType: '',
        altKey,
        ctrlKey,
        metaKey,
        shiftKey,
      }),
    );
  }

  /** Override this method to render the component template. */
  protected renderTemplate(): TemplateResult {
    throw new Error('Implementation needed!');
  }

  /** Default render method for button-like components. */
  protected override render(): TemplateResult {
    return html`
      <span class="sbb-action-base ${this.localName ?? getLocalName(this)}">
        ${this.renderTemplate()}
      </span>
    `;
  }
}
