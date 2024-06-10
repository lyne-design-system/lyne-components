import {
  type CSSResultGroup,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';

import style from './container.scss?lit&inline';

/**
 * It displays its content with the default page spacing.
 *
 * @slot - Use the unnamed slot to add anything to the container.
 * @slot sticky-bar - The slot used by the sbb-sticky-bar component.
 */
@customElement('sbb-container')
export class SbbContainerElement extends LitElement {
  public static override styles: CSSResultGroup = style;

  /** Whether the container is expanded. */
  @property({ type: Boolean, reflect: true }) public expanded = false;

  /** Whether the background color is shown on full container width on large screens. */
  @property({ type: Boolean, reflect: true, attribute: 'background-expanded' })
  public backgroundExpanded = false;

  /** Color of the container, like transparent, white etc. */
  @property({ reflect: true }) public color: 'transparent' | 'white' | 'milk' = 'white';

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('expanded')) {
      this.querySelector?.('sbb-sticky-bar')?.toggleAttribute('data-expanded', this.expanded);
    }
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-container">
        <slot></slot>
      </div>
      <slot name="sticky-bar"></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-container': SbbContainerElement;
  }
}
