import { type CSSResultGroup, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

import {
  type SbbActionBaseElement,
  type AbstractConstructor,
  type SbbDisabledMixinType,
  SbbDisabledTabIndexActionMixin,
} from '../../core/common-behaviors';
import { SbbIconNameMixin, type SbbIconNameMixinType } from '../../icon';

import style from './menu-action.scss?lit&inline';

export declare class SbbMenuActionCommonElementMixinType
  implements Partial<SbbDisabledMixinType>, Partial<SbbIconNameMixinType>
{
  public amount?: string;
  public disabled: boolean;
  public iconName?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SbbMenuActionCommonElementMixin = <
  T extends AbstractConstructor<SbbActionBaseElement>,
>(
  superClass: T,
): AbstractConstructor<SbbMenuActionCommonElementMixinType> & T => {
  abstract class SbbMenuActionCommonElement
    extends SbbIconNameMixin(SbbDisabledTabIndexActionMixin(superClass))
    implements Partial<SbbMenuActionCommonElementMixinType>
  {
    public static styles: CSSResultGroup = style;

    /** Value shown as badge at component end. */
    @property() public amount: string | undefined;

    protected override renderTemplate(): TemplateResult {
      return html`
        <span class="sbb-menu-action__content">
          <span class="sbb-menu-action__icon"> ${super.renderIconSlot()} </span>
          <span class="sbb-menu-action__label">
            <slot></slot>
          </span>
          ${this.amount && !this.disabled
            ? html`<span class="sbb-menu-action__amount">${this.amount}</span>`
            : nothing}
        </span>
      `;
    }
  }
  return SbbMenuActionCommonElement as unknown as AbstractConstructor<SbbMenuActionCommonElementMixinType> &
    T;
};
