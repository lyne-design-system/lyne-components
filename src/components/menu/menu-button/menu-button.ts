import { customElement } from 'lit/decorators.js';

import { SbbButtonBaseElement } from '../../core/common-behaviors';
import { SbbMenuActionCommonElementMixin } from '../common';

/**
 * It displays a button element that can be used in the `sbb-menu` component.
 *
 * @slot - Use the unnamed slot to add content to the `sbb-menu-button`.
 * @slot icon - Use this slot to provide an icon. If `icon-name` is set, a `sbb-icon` will be used.
 * @cssprop [--sbb-menu-action-outer-horizontal-padding=var(--sbb-spacing-fixed-3x)] - Can be used
 * to modify horizontal padding.
 */
@customElement('sbb-menu-button')
export class SbbMenuButtonElement extends SbbMenuActionCommonElementMixin(SbbButtonBaseElement) {}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-menu-button': SbbMenuButtonElement;
  }
}
