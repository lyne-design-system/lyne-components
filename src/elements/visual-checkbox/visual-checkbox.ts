import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { SbbDisabledMixin, SbbNegativeMixin } from '../core/mixins.js';

import style from './visual-checkbox.scss?lit&inline';

/**
 * It visually displays a non-interactive checkbox.
 */
@customElement('sbb-visual-checkbox')
export class SbbVisualCheckboxElement extends SbbDisabledMixin(SbbNegativeMixin(LitElement)) {
  public static override styles: CSSResultGroup = style;

  /** Checked state. */
  @property({ reflect: true, type: Boolean }) public checked: boolean = false;

  /** Indeterminate state. */
  @property({ reflect: true, type: Boolean }) public indeterminate = false;

  protected override render(): TemplateResult {
    return html`
      <span class="sbb-visual-checkbox">
        <span class="sbb-visual-checkbox__icon">
          ${this.checked || this.indeterminate
            ? html`<svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d=${this.indeterminate ? 'M9 12H15' : 'M8 12.3304L10.4615 15L16 9'}
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>`
            : nothing}
        </span>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-visual-checkbox': SbbVisualCheckboxElement;
  }
}
