import type { CSSResultGroup, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

import {
  type SbbActionBaseElement,
  type AbstractConstructor,
  type SbbNegativeMixinType,
  SbbNegativeMixin,
  NamedSlotStateController,
} from '../../core/common-behaviors';

import '../../icon';
import style from './link.scss?lit&inline';

export type SbbLinkSize = 'xs' | 's' | 'm';

export declare class SbbLinkCommonElementMixinType extends SbbNegativeMixinType {
  public size?: SbbLinkSize;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SbbLinkCommonElementMixin = <T extends AbstractConstructor<SbbActionBaseElement>>(
  superClass: T,
): AbstractConstructor<SbbLinkCommonElementMixinType> & T => {
  abstract class SbbLinkCommonElement
    extends SbbNegativeMixin(superClass)
    implements Partial<SbbLinkCommonElementMixinType>
  {
    public static styles: CSSResultGroup = style;

    /**
     * Text size, the link should get in the non-button variation.
     * With inline variant, the text size adapts to where it is used.
     */
    @property({ reflect: true }) public size: SbbLinkSize = 's';

    public constructor(...args: any[]) {
      super(args);
      new NamedSlotStateController(this);
    }

    protected override renderTemplate(): TemplateResult {
      return html`<slot></slot>`;
    }
  }
  return SbbLinkCommonElement as unknown as AbstractConstructor<SbbLinkCommonElementMixinType> & T;
};
