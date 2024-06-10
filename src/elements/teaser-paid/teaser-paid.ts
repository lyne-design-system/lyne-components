import { html, type CSSResultGroup, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { SbbLinkBaseElement } from '../core/base-elements.js';

import style from './teaser-paid.scss?lit&inline';

/**
 * It displays an image and a chip with a text.
 *
 * @slot chip - Link content of the panel
 * @slot image - The background image that can be a `sbb-image`
 */
@customElement('sbb-teaser-paid')
export class SbbTeaserPaidElement extends SbbLinkBaseElement {
  public static override styles: CSSResultGroup = style;

  private _chipSlotChanged(): void {
    this.querySelector('sbb-chip')?.setAttribute('color', 'charcoal');
  }

  protected override renderTemplate(): TemplateResult {
    return html`
      <slot name="chip" @slotchange=${() => this._chipSlotChanged()}></slot>
      <slot name="image"></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-teaser-paid': SbbTeaserPaidElement;
  }
}
