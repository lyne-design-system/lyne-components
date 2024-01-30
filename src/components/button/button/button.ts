import { nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

import {
  SbbButtonBaseElement,
  resolveButtonOrStaticRenderVariables,
} from '../../core/common-behaviors';
import { setAttributes } from '../../core/dom';
import { SbbButtonCommonElementMixin } from '../common/button-common';

/**
 * It displays a button enhanced with the SBB Design.
 *
 * @slot - Use the unnamed slot to add content to the button.
 * @slot icon - Slot used to display the icon, if one is set
 */
@customElement('sbb-button')
export class SbbButtonElement extends SbbButtonCommonElementMixin(SbbButtonBaseElement) {
  protected override render(): TemplateResult {
    // ## Migr: Host attributes ##
    setAttributes(this, resolveButtonOrStaticRenderVariables(this.isStatic, this.disabled));
    // ####

    return html`
      <span class="sbb-button">
        <span class="sbb-button__icon">
          <slot name="icon">
            ${this.iconName ? html`<sbb-icon name="${this.iconName}"></sbb-icon>` : nothing}
          </slot>
        </span>

        <span class="sbb-button__label">
          <slot></slot>
        </span>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-button': SbbButtonElement;
  }
}
