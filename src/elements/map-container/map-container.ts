import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import type { SbbTertiaryButtonElement } from '../button.js';
import { SbbLanguageController } from '../core/controllers.js';
import { i18nMapContainerButtonLabel } from '../core/i18n.js';
import { AgnosticIntersectionObserver } from '../core/observers.js';

import style from './map-container.scss?lit&inline';

import '../button/tertiary-button.js';

/**
 * It can be used as a container for maps.
 *
 * @slot - Use the unnamed slot to add content to the sidebar.
 * @slot map - Used for slotting the map.
 * @cssprop [--sbb-map-container-margin-start=var(--sbb-header-height)] - The component
 * comes along with a height calculation that subtracts the height of the header.
 * For specific use cases, this variable can be used to modify the preset height.
 * @cssprop [--sbb-map-container-sidebar-width=zero-large:400px;wide-ultra:480px] - Can be used
 * to modify the width of the left sidebar.
 */
@customElement('sbb-map-container')
export class SbbMapContainerElement extends LitElement {
  public static override styles: CSSResultGroup = style;

  /** Flag to show/hide the scroll up button inside the sidebar on mobile. */
  @property({ attribute: 'hide-scroll-up-button', reflect: true, type: Boolean })
  public hideScrollUpButton = false;

  @state() private _scrollUpButtonVisible = false;

  private _intersector?: HTMLSpanElement;
  private _language = new SbbLanguageController(this);
  private _observer = new AgnosticIntersectionObserver((entries) =>
    this._toggleButtonVisibilityOnIntersect(entries),
  );

  /**
   * Button click callback to trigger the scroll to container top
   * @private
   */
  private _onScrollButtonClick(): void {
    this.scrollIntoView({ behavior: 'smooth' });
  }
  /**
   * Intersection callback. Toggles the visibility.
   * @param entries
   * @private
   */
  private _toggleButtonVisibilityOnIntersect(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      const mapIsHidden = !entry.isIntersecting;
      this.toggleAttribute('data-scroll-up-button-visible', mapIsHidden);
      this._scrollUpButtonVisible = mapIsHidden;
    });
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._updateIntersectionObserver();
  }

  private _updateIntersectionObserver(): void {
    this._observer.disconnect();
    if (!this.hideScrollUpButton && this._intersector) {
      this._observer.observe(this._intersector);
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._observer.disconnect();
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-map-container">
        <div class="sbb-map-container__sidebar">
          ${!this.hideScrollUpButton
            ? html`<span
                ${ref((el?: Element): void => {
                  if (this._intersector === el) {
                    return;
                  }
                  this._intersector = el as HTMLSpanElement;
                  this._updateIntersectionObserver();
                })}
              ></span>`
            : nothing}

          <slot></slot>

          ${!this.hideScrollUpButton
            ? html`<sbb-tertiary-button
                class="sbb-map-container__sidebar-button"
                size="l"
                icon-name="location-pin-map-small"
                type="button"
                @click=${() => this._onScrollButtonClick()}
                ${ref((ref?: Element) => {
                  if (ref) {
                    (ref as SbbTertiaryButtonElement).inert = !this._scrollUpButtonVisible;
                  }
                })}
              >
                ${i18nMapContainerButtonLabel[this._language.current]}
              </sbb-tertiary-button>`
            : nothing}
        </div>
        <div class="sbb-map-container__map">
          <slot name="map"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-map-container': SbbMapContainerElement;
  }
}
