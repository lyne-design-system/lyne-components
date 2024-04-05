import type { CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators.js';

import { SbbButtonBaseElement } from '../../core/base-elements/index.js';
import { SbbDisabledTabIndexActionMixin } from '../../core/mixins/index.js';
import {
  buttonCommonStyle,
  buttonSecondaryStyle,
  SbbButtonCommonElementMixin,
} from '../common/index.js';

/**
 * It displays a button enhanced with the SBB Design in the 'secondary' variant.
 *
 * @slot - Use the unnamed slot to add content to the secondary-button.
 * @slot icon - Slot used to display the icon, if one is set
 */
@customElement('sbb-secondary-button')
export class SbbSecondaryButtonElement extends SbbButtonCommonElementMixin(
  SbbDisabledTabIndexActionMixin(SbbButtonBaseElement),
) {
  public static override styles: CSSResultGroup = [buttonCommonStyle, buttonSecondaryStyle];
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-secondary-button': SbbSecondaryButtonElement;
  }
}
