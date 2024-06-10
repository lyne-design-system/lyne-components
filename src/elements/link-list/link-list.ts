import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { SbbSlotStateController } from '../core/controllers.js';
import type { SbbHorizontalFrom, SbbOrientation } from '../core/interfaces.js';
import { SbbNamedSlotListMixin, SbbNegativeMixin, type WithListChildren } from '../core/mixins.js';
import type {
  SbbBlockLinkButtonElement,
  SbbBlockLinkElement,
  SbbBlockLinkStaticElement,
  SbbLinkSize,
} from '../link.js';
import type { SbbTitleLevel } from '../title.js';

import style from './link-list.scss?lit&inline';

import '../title.js';

/**
 * It displays a list of `sbb-block-link`.
 *
 * @slot - Use the unnamed slot to add one or more `sbb-block-link`.
 * @slot title - Use this slot to provide a title.
 */
@customElement('sbb-link-list')
export class SbbLinkListElement extends SbbNegativeMixin(
  SbbNamedSlotListMixin<
    SbbBlockLinkElement | SbbBlockLinkButtonElement | SbbBlockLinkStaticElement,
    typeof LitElement
  >(LitElement),
) {
  public static override styles: CSSResultGroup = style;
  protected override readonly listChildLocalNames = [
    'sbb-block-link',
    'sbb-block-link-button',
    'sbb-block-link-static',
  ];

  /** The title text we want to show before the list. */
  @property({ attribute: 'title-content', reflect: true }) public titleContent?: string;

  /** The semantic level of the title, e.g. 2 = h2. */
  @property({ attribute: 'title-level' }) public titleLevel: SbbTitleLevel = '2';

  /**
   * Text size of the nested sbb-block-link instances. This will overwrite the size attribute of
   * nested sbb-block-link instances.
   */
  @property({ reflect: true }) public size: SbbLinkSize = 's';

  /** Selected breakpoint from which the list is rendered horizontally. */
  @property({ attribute: 'horizontal-from', reflect: true })
  public horizontalFrom?: SbbHorizontalFrom;

  /** The orientation in which the list will be shown vertical or horizontal. */
  @property({ reflect: true }) public orientation: SbbOrientation = 'vertical';

  public constructor() {
    super();
    new SbbSlotStateController(this);
  }

  protected override willUpdate(changedProperties: PropertyValues<WithListChildren<this>>): void {
    super.willUpdate(changedProperties);

    if (
      changedProperties.has('size') ||
      changedProperties.has('negative') ||
      changedProperties.has('listChildren')
    ) {
      for (const link of this.listChildren) {
        link.negative = this.negative;
        link.size = this.size;
      }
    }
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-link-list-wrapper">
        <sbb-title
          class="sbb-link-list-title"
          level=${this.titleLevel || nothing}
          visual-level="5"
          ?negative=${this.negative}
          id="sbb-link-list-title-id"
        >
          <slot name="title">${this.titleContent}</slot>
        </sbb-title>
        ${this.renderList({ ariaLabelledby: 'sbb-link-list-title-id' })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-link-list': SbbLinkListElement;
  }
}
