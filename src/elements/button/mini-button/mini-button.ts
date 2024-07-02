import type { CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators.js';

import { SbbMiniButtonBaseElement } from '../../core/base-elements.js';
import { SbbDisabledTabIndexActionMixin } from '../../core/mixins.js';

import style from './mini-button.scss?lit&inline';

/**
 * It displays an icon-only button enhanced with the SBB Design;
 * it's meant to be used mainly within the sbb-form-field in prefix/suffix slot.
 *
 * @slot icon - Slot used to display the icon, if one is set
 */
@customElement('sbb-mini-button')
export class SbbMiniButtonElement extends SbbDisabledTabIndexActionMixin(SbbMiniButtonBaseElement) {
  public static override styles: CSSResultGroup = style;
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-mini-button': SbbMiniButtonElement;
  }
}
