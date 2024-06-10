import { type CSSResultGroup, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

import { SbbLinkBaseElement } from '../core/base-elements.js';

import style from './teaser-hero.scss?lit&inline';

import '../image.js';
import '../link/block-link-static.js';

/**
 * It displays an image and an action call within a panel.
 *
 * @slot - Use the unnamed slot to add text content to the panel
 * @slot link-content - Link content of the panel
 * @slot image - The background image that can be a `sbb-image`
 */
@customElement('sbb-teaser-hero')
export class SbbTeaserHeroElement extends SbbLinkBaseElement {
  public static override styles: CSSResultGroup = style;

  /** Panel link text. */
  @property({ attribute: 'link-content' }) public linkContent?: string;

  /** Image src will be passed to `sbb-image`. */
  @property({ attribute: 'image-src' }) public imageSrc?: string;

  /** Image alt text will be passed to `sbb-image`. */
  @property({ attribute: 'image-alt' }) public imageAlt?: string;

  protected override renderTemplate(): TemplateResult {
    return html`
      <span class="sbb-teaser-hero__panel">
        <p class="sbb-teaser-hero__panel-text">
          <slot></slot>
        </p>
        ${this.href
          ? html`<sbb-block-link-static
              class="sbb-teaser-hero__panel-link"
              icon-name="chevron-small-right-small"
              icon-placement="end"
              size="m"
              negative
            >
              <slot name="link-content">${this.linkContent}</slot>
            </sbb-block-link-static>`
          : nothing}
      </span>
      <slot name="image">
        ${this.imageSrc
          ? html`<sbb-image image-src=${this.imageSrc} alt=${this.imageAlt ?? nothing}></sbb-image>`
          : nothing}
      </slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-teaser-hero': SbbTeaserHeroElement;
  }
}
