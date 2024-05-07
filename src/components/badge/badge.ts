import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { SbbNegativeMixin } from '../core/mixins.js';

import style from './badge.scss?lit&inline';

/**
 * It displays a badge.
 */
@customElement('sbb-badge')
export class SbbBadgeElement extends SbbNegativeMixin(LitElement) {
  public static override styles: CSSResultGroup = style;

  @property() public label?: string;

  protected override render(): TemplateResult {
    return html`<slot></slot>
      <div class="sbb-badge">${this.label}</div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-badge': SbbBadgeElement;
  }
}
