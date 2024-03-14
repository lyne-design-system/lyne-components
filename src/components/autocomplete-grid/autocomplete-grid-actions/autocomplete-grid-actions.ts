import { type CSSResultGroup, html, LitElement, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { hostAttributes } from '../../core/common-behaviors';
import type { SbbAutocompleteGridButtonElement } from '../index';

import style from './autocomplete-grid-actions.scss?lit&inline';

/**
 * A wrapper component for autocomplete-grid action buttons.
 *
 * @slot - Use the unnamed slot to add `sbb-mini-button` elements.
 */
@customElement('sbb-autocomplete-grid-actions')
@hostAttributes({
  role: 'gridcell',
})
export class SbbAutocompleteGridActionsElement extends LitElement {
  public static override styles: CSSResultGroup = style;

  private _setChildrenParameters(event: Event): void {
    const elements = (event.target as HTMLSlotElement).assignedElements();
    if (!elements.length) {
      return;
    }

    elements
      .filter(
        (e): e is SbbAutocompleteGridButtonElement => e.tagName === 'SBB-AUTOCOMPLETE-GRID-BUTTON',
      )
      .forEach((element, index) => element.setAttribute('id', `${this.id}x${index}`));
  }

  protected override render(): TemplateResult {
    return html`
      <span class="sbb-autocomplete-grid-action">
        <slot @slotchange=${this._setChildrenParameters}></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-autocomplete-grid-actions': SbbAutocompleteGridActionsElement;
  }
}
