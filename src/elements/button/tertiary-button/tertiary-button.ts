import type { CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators.js';

import { SbbButtonBaseElement } from '../../core/base-elements.js';
import { SbbDisabledTabIndexActionMixin } from '../../core/mixins.js';
import { buttonCommonStyle, buttonTertiaryStyle, SbbButtonCommonElementMixin } from '../common.js';

/**
 * It displays a button enhanced with the SBB Design in the 'tertiary' variant.
 *
 * @slot - Use the unnamed slot to add content to the tertiary-button.
 * @slot icon - Slot used to display the icon, if one is set
 */
@customElement('sbb-tertiary-button')
export class SbbTertiaryButtonElement extends SbbButtonCommonElementMixin(
  SbbDisabledTabIndexActionMixin(SbbButtonBaseElement),
) {
  public static override styles: CSSResultGroup = [buttonCommonStyle, buttonTertiaryStyle];
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-tertiary-button': SbbTertiaryButtonElement;
  }
}
