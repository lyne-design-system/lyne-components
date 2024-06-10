import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { hostAttributes } from '../core/decorators.js';

import style from './loading-indicator.scss?lit&inline';

/**
 * It displays a loading indicator.
 */
@customElement('sbb-loading-indicator')
@hostAttributes({
  role: 'progressbar',
  'aria-busy': 'true',
})
export class SbbLoadingIndicatorElement extends LitElement {
  public static override styles: CSSResultGroup = style;

  /** Variant of the loading indicator; `circle` is meant to be used inline, while `window` as overlay. */
  @property({ reflect: true }) public variant?: 'window' | 'circle';

  /** Size variant, either s or m. */
  @property({ reflect: true }) public size: 's' | 'l' = 's';

  /** Color variant. */
  @property({ reflect: true }) public color: 'default' | 'smoke' | 'white' = 'default';

  protected override render(): TemplateResult {
    return html`
      <span class="sbb-loading-indicator">
        <span class="sbb-loading-indicator__animated-element">
          ${this.variant === 'window'
            ? html`<span>
                <span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </span>`
            : nothing}
        </span>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-loading-indicator': SbbLoadingIndicatorElement;
  }
}
