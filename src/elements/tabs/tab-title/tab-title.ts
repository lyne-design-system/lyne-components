import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';

import { SbbSlotStateController } from '../../core/controllers.js';
import { SbbDisabledMixin } from '../../core/mixins.js';
import { SbbIconNameMixin } from '../../icon.js';
import type { SbbTitleLevel } from '../../title.js';

import style from './tab-title.scss?lit&inline';

/**
 * Combined with a `sbb-tab-group`, it displays a tab's title.
 *
 * @slot - Use the unnamed slot to add content to the tab title.
 * @slot icon - Use this slot to display an icon to the left of the title, by providing the `sbb-icon` component.
 * @slot amount - Provide a number to show an amount to the right of the title.
 */
@customElement('sbb-tab-title')
export class SbbTabTitleElement extends SbbDisabledMixin(SbbIconNameMixin(LitElement)) {
  public static override styles: CSSResultGroup = style;

  /**
   * The level will correspond to the heading tag generated in the title.
   * Use this property to generate the appropriate header tag, taking SEO into consideration.
   */
  @property() public level: SbbTitleLevel = '1';

  /** Active tab state */
  @property({ reflect: true, type: Boolean }) public active?: boolean;

  /** Amount displayed inside the tab. */
  @property({ reflect: true }) public amount?: string;

  public constructor() {
    super();
    new SbbSlotStateController(this);
  }

  protected override render(): TemplateResult {
    const TAGNAME = `h${Number(this.level) < 7 ? this.level : '1'}`;

    /* eslint-disable lit/binding-positions */
    return html`
      <div class="sbb-tab-title__wrapper">
        <${unsafeStatic(TAGNAME)} class="sbb-tab-title">
          <span class="sbb-tab-title__icon">
            ${this.renderIconSlot()}
          </span>
          <span class="sbb-tab-title__text">
            <slot></slot>
          </span>
          <span class="sbb-tab-title__amount">
            <slot name="amount">${this.amount}</slot>
          </span>
        </${unsafeStatic(TAGNAME)}>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-tab-title': SbbTabTitleElement;
  }
}
