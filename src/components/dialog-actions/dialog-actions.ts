import { CSSResultGroup, html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { SbbActionGroupElement } from '../action-group';
import { setAttribute } from '../core/dom';

import style from './dialog-actions.scss?lit&inline';

/**
 * Describe the purpose of the component with a single short sentence.
 *
 * @slot - Use the unnamed slot to add `sbb-TODO` elements.
 * @event {CustomEvent<any>} myEventName - TODO: Document this event
 */
@customElement('sbb-dialog-actions')
export class SbbDialogActionsElement extends SbbActionGroupElement {
  public static override styles: CSSResultGroup = [SbbActionGroupElement.styles, style];

  public override connectedCallback(): void {
    super.connectedCallback();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    // do stuff
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'slot', 'actions');

    return html` <div class="sbb-dialog-actions">${super.render()}</div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-dialog-actions': SbbDialogActionsElement;
  }
}
