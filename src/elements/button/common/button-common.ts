import type { TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

import type { SbbActionBaseElement } from '../../core/base-elements.js';
import { SbbSlotStateController } from '../../core/controllers.js';
import { hostAttributes } from '../../core/decorators.js';
import type {
  AbstractConstructor,
  SbbDisabledMixinType,
  SbbNegativeMixinType,
} from '../../core/mixins.js';
import { SbbNegativeMixin } from '../../core/mixins.js';
import { SbbIconNameMixin, type SbbIconNameMixinType } from '../../icon.js';

export type SbbButtonCommonElement = SbbButtonCommonElementMixinType & SbbActionBaseElement;

export type SbbButtonSize = 'l' | 'm' | 's';

export declare class SbbButtonCommonElementMixinType
  implements SbbNegativeMixinType, Partial<SbbDisabledMixinType>, Partial<SbbIconNameMixinType>
{
  public size?: SbbButtonSize;
  public disabled: boolean;
  public iconName?: string;
  public negative: boolean;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SbbButtonCommonElementMixin = <T extends AbstractConstructor<SbbActionBaseElement>>(
  superClass: T,
): AbstractConstructor<SbbButtonCommonElementMixinType> & T => {
  @hostAttributes({
    'data-sbb-button': '',
  })
  abstract class SbbButtonCommonElementClass
    extends SbbNegativeMixin(SbbIconNameMixin(superClass))
    implements Partial<SbbButtonCommonElementMixinType>
  {
    /** Size variant, either l or m. */
    @property({ reflect: true }) public size?: SbbButtonSize = 'l';

    protected constructor(...args: any[]) {
      super(args);
      new SbbSlotStateController(this);
    }

    protected override renderTemplate(): TemplateResult {
      return html`
        ${super.renderIconSlot()}
        <span class="sbb-button__label">
          <slot></slot>
        </span>
      `;
    }
  }
  return SbbButtonCommonElementClass as unknown as AbstractConstructor<SbbButtonCommonElementMixinType> &
    T;
};
