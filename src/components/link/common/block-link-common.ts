import type { CSSResultGroup, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

import type { SbbActionBaseElement, AbstractConstructor } from '../../core/common-behaviors';
import type { SbbIconPlacement } from '../../core/interfaces';
import { SbbIconNameMixin } from '../../icon';

import { SbbLinkCommonElementMixin, type SbbLinkCommonElementMixinType } from './link-common';
// eslint-disable-next-line import/order
import blockStyle from './block-link.scss?lit&inline';
import style from './link.scss?lit&inline';

export declare class SbbBlockLinkCommonElementMixinType extends SbbLinkCommonElementMixinType {
  public iconName?: string;
  public iconPlacement?: SbbIconPlacement;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SbbBlockLinkCommonElementMixin = <T extends AbstractConstructor<SbbActionBaseElement>>(
  superClass: T,
): AbstractConstructor<SbbBlockLinkCommonElementMixinType> & T => {
  abstract class SbbBlockLinkCommonElement
    extends SbbLinkCommonElementMixin(SbbIconNameMixin(superClass))
    implements Partial<SbbBlockLinkCommonElementMixinType>
  {
    public static styles: CSSResultGroup = [style, blockStyle];

    /** Moves the icon to the end of the component if set to true. */
    @property({ attribute: 'icon-placement', reflect: true })
    public iconPlacement?: SbbIconPlacement = 'start';

    protected override renderTemplate(): TemplateResult {
      return html`
        <span class="sbb-link__icon"> ${super.renderIconSlot()} </span>
        <slot></slot>
      `;
    }
  }
  return SbbBlockLinkCommonElement as unknown as AbstractConstructor<SbbBlockLinkCommonElementMixinType> &
    T;
};
