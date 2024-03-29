import { customElement } from 'lit/decorators.js';

import { SbbActionBaseElement, SbbDisabledMixin } from '../../core/common-behaviors';
import { SbbInlineLinkCommonElementMixin } from '../common';

/**
 * It displays a static link enhanced with the SBB Design.
 *
 * @slot - Use the unnamed slot to add content to the `sbb-link-static`.
 */
@customElement('sbb-link-static')
export class SbbLinkStaticElement extends SbbInlineLinkCommonElementMixin(
  SbbDisabledMixin(SbbActionBaseElement),
) {}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-link-static': SbbLinkStaticElement;
  }
}
