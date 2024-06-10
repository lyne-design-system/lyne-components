import type { CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators.js';

import { SbbLinkBaseElement } from '../../core/base-elements.js';
import { SbbDisabledMixin } from '../../core/mixins.js';
import { buttonCommonStyle, buttonTertiaryStyle, SbbButtonCommonElementMixin } from '../common.js';

/**
 * It displays a button enhanced with the SBB Design in the 'tertiary' variant, which will behave as a link.
 *
 * @slot - Use the unnamed slot to add content to the tertiary-button-link.
 * @slot icon - Slot used to display the icon, if one is set
 */
@customElement('sbb-tertiary-button-link')
export class SbbTertiaryButtonLinkElement extends SbbButtonCommonElementMixin(
  SbbDisabledMixin(SbbLinkBaseElement),
) {
  public static override styles: CSSResultGroup = [buttonCommonStyle, buttonTertiaryStyle];
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-tertiary-button-link': SbbTertiaryButtonLinkElement;
  }
}
