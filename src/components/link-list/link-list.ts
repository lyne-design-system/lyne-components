import type { CSSResultGroup, TemplateResult, PropertyValues } from 'lit';
import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { WithListChildren } from '../core/common-behaviors';
import { NamedSlotListElement, NamedSlotStateController } from '../core/common-behaviors';
import type { SbbHorizontalFrom, SbbOrientation } from '../core/interfaces';
import type { SbbLinkElement, SbbLinkSize } from '../link';
import type { TitleLevel } from '../title';

import style from './link-list.scss?lit&inline';

import '../title';

/**
 * It displays a list of `sbb-link`.
 *
 * @slot - Use the unnamed slot to add one or more `sbb-link`.
 * @slot title - Use this slot to provide a title.
 */
@customElement('sbb-link-list')
export class SbbLinkListElement extends NamedSlotListElement<SbbLinkElement> {
  public static override styles: CSSResultGroup = style;
  protected override readonly listChildTagNames = ['SBB-LINK'];

  /** The title text we want to show before the list. */
  @property({ attribute: 'title-content', reflect: true }) public titleContent?: string;

  /** The semantic level of the title, e.g. 2 = h2. */
  @property({ attribute: 'title-level' }) public titleLevel?: TitleLevel = '2';

  /**
   * Text size of the nested sbb-link instances. This will overwrite the size attribute of
   * nested sbb-link instances.
   */
  @property({ reflect: true }) public size: SbbLinkSize = 's';

  /**
   * Whether to render the link list and nested sbb-link instances as negative. This will overwrite
   * the negative attribute of nested sbb-link instances.
   */
  @property({ reflect: true, type: Boolean }) public negative: boolean = false;

  /** Selected breakpoint from which the list is rendered horizontally. */
  @property({ attribute: 'horizontal-from', reflect: true })
  public horizontalFrom?: SbbHorizontalFrom;

  /** The orientation in which the list will be shown vertical or horizontal. */
  @property({ reflect: true }) public orientation: SbbOrientation = 'vertical';

  private _namedSlots = new NamedSlotStateController(this);

  protected override willUpdate(changedProperties: PropertyValues<WithListChildren<this>>): void {
    if (
      changedProperties.has('size') ||
      changedProperties.has('negative') ||
      changedProperties.has('listChildren')
    ) {
      for (const link of this.listChildren) {
        link.negative = this.negative;
        link.size = this.size;
        link.variant = 'block';
      }
    }
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-link-list-wrapper">
        <sbb-title
          class="sbb-link-list-title"
          level=${this.titleLevel ?? nothing}
          visual-level="5"
          ?negative=${this.negative}
          id="sbb-link-list-title-id"
        >
          <slot name="title" @slotchange=${() => this.requestUpdate()}>${this.titleContent}</slot>
        </sbb-title>
        <ul
          aria-labelledby=${this._namedSlots.slots.has('title') || this.titleContent
            ? 'sbb-link-list-title-id'
            : nothing}
          class="sbb-link-list"
          role=${this.roleOverride()}
        >
          ${this.renderListSlots()}
        </ul>
        ${this.renderHiddenSlot()}
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
