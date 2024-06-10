import type { CSSResultGroup, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

import { SbbLinkBaseElement } from '../core/base-elements.js';
import { SbbSlotStateController } from '../core/controllers.js';
import type { SbbTitleLevel } from '../title.js';

import style from './teaser.scss?lit&inline';

import '../chip.js';
import '../title.js';

/**
 * It displays an interactive image with caption.
 *
 * @slot image - Slot used to render the image.
 * @slot chip - Slot used to render the sbb-chip label.
 * @slot title - Slot used to render the title.
 * @slot - Use the unnamed slot to render the description.
 */
@customElement('sbb-teaser')
export class SbbTeaserElement extends SbbLinkBaseElement {
  public static override styles: CSSResultGroup = style;

  /** Teaser variant - define the position and the alignment of the text block. */
  @property({ reflect: true }) public alignment: 'after-centered' | 'after' | 'below' =
    'after-centered';

  /** Heading level of the sbb-title element (e.g. h1-h6). */
  @property({ attribute: 'title-level' }) public titleLevel: SbbTitleLevel = '5';

  /** Content of title. */
  @property({ attribute: 'title-content' }) public titleContent?: string;

  /** Content of chip. */
  @property({ attribute: 'chip-content', reflect: true }) public chipContent?: string;

  public constructor() {
    super();
    new SbbSlotStateController(this);
  }

  protected override renderTemplate(): TemplateResult {
    return html`
      <span class="sbb-teaser__container">
        <span class="sbb-teaser__image-wrapper">
          <slot name="image"></slot>
        </span>
        <span class="sbb-teaser__text">
          <sbb-chip size="xxs" color="charcoal" class="sbb-teaser__chip">
            <slot name="chip">${this.chipContent}</slot>
          </sbb-chip>
          <sbb-title level=${this.titleLevel} visual-level="5" class="sbb-teaser__lead">
            <slot name="title">${this.titleContent}</slot>
          </sbb-title>
          <span class="sbb-teaser__description">
            <slot></slot>
          </span>
        </span>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-teaser': SbbTeaserElement;
  }
}
