import { type CSSResultGroup, html, LitElement, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { hostAttributes } from '../../core/common-behaviors';
import type { SbbAutocompleteGridOptionElement, SbbAutocompleteGridActionsElement } from '../index';

import style from './autocomplete-grid-row.scss?lit&inline';

let autocompleteRowNextId = 0;

/**
 * Describe the purpose of the component with a single short sentence.
 */
@customElement('sbb-autocomplete-grid-row')
@hostAttributes({
  role: 'row',
})
export class SbbAutocompleteGridRowElement extends LitElement {
  public static override styles: CSSResultGroup = style;
  private _rowId = ++autocompleteRowNextId;

  public constructor() {
    super();
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    if (!this.id) {
      this.id = `sbb-autocomplete-grid-row-${this._rowId}`;
    }
  }

  private _setChildrenParameters(event: Event): void {
    const elements = (event.target as HTMLSlotElement).assignedElements();
    if (!elements.length) {
      return;
    }

    const option = elements.find(
      (e): e is SbbAutocompleteGridOptionElement => e.tagName === 'SBB-AUTOCOMPLETE-GRID-OPTION',
    );
    if (option && !option.id) {
      option.setAttribute('id', `sbb-autocomplete-grid-item-${this._rowId}x0`);
    }

    const action = elements.find(
      (e): e is SbbAutocompleteGridActionsElement => e.tagName === 'SBB-AUTOCOMPLETE-GRID-ACTIONS',
    );
    if (action && !action.id) {
      action.setAttribute('id', `sbb-autocomplete-grid-item-${this._rowId}x1`);
    }
  }

  protected override render(): TemplateResult {
    return html`
      <span class="sbb-autocomplete-grid-row">
        <slot @slotchange=${this._setChildrenParameters}></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-autocomplete-grid-row': SbbAutocompleteGridRowElement;
  }
}
