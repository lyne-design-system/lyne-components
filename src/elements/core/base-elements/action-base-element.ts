import { html, LitElement, type TemplateResult } from 'lit';

import { hostAttributes } from '../decorators.js';
import { getDocumentWritingMode, getLocalName } from '../dom.js';

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
  protected get maybeDisabled(): boolean | undefined {
    const maybeDisabled = this as MaybeDisabled;
    return maybeDisabled.disabled || maybeDisabled.formDisabled;
  }

  protected setupBaseEventHandlers(): void {
    this.addEventListener(
      'click',
      (event) => {
        if (this.maybeDisabled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      // capture is necessary here, as this event handler needs to be executed before any other
      // in order to stop immediate propagation in the disabled case.
      { capture: true },
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
