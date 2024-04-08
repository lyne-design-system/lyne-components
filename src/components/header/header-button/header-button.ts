import { customElement } from 'lit/decorators.js';

import { SbbButtonBaseElement } from '../../core/base-elements';
import { SbbHeaderActionCommonElementMixin } from '../common';

/**
 * It displays a button element that can be used in the `sbb-header` component.
 *
 * @slot icon - Slot used to render the button icon.
 * @slot - Use the unnamed slot to add content to the `sbb-header-button`.
 */
@customElement('sbb-header-button')
export class SbbHeaderButtonElement extends SbbHeaderActionCommonElementMixin(
  SbbButtonBaseElement,
) {}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-header-button': SbbHeaderButtonElement;
  }
}
