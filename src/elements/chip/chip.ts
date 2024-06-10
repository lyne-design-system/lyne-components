import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import style from './chip.scss?lit&inline';

/**
 * It displays brief and compact information.
 *
 * @slot - Use the unnamed slot to add content to the `sbb-chip`.
 */
@customElement('sbb-chip')
export class SbbChipElement extends LitElement {
  public static override styles: CSSResultGroup = style;

  /** Size of the chip. */
  @property({ reflect: true })
  public size: 'xxs' | 'xs' | 's' = 'xxs';

  /** Color of the chip. */
  @property({ reflect: true })
  public color: 'milk' | 'charcoal' | 'white' | 'granite' = 'milk';

  protected override render(): TemplateResult {
    return html`
      <span class="sbb-chip">
        <span class="sbb-chip__text-wrapper">
          <slot></slot>
        </span>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-chip': SbbChipElement;
  }
}
