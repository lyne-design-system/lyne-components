import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import style from './dialog-content.scss?lit&inline';

/**
 * Use this component to provide a content for an `sbb-dialog`.
 *
 * @slot - Use the unnamed slot to provide a dialog content.
 */
@customElement('sbb-dialog-content')
export class SbbDialogContentElement extends LitElement {
  public static override styles: CSSResultGroup = style;

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-dialog-content">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-dialog-content': SbbDialogContentElement;
  }
}
