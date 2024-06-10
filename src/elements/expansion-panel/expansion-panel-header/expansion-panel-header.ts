import { type CSSResultGroup, html, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { SbbButtonBaseElement } from '../../core/base-elements.js';
import { SbbConnectedAbortController, SbbSlotStateController } from '../../core/controllers.js';
import { hostAttributes } from '../../core/decorators.js';
import { EventEmitter } from '../../core/eventing.js';
import { SbbDisabledTabIndexActionMixin } from '../../core/mixins.js';
import { SbbIconNameMixin } from '../../icon.js';
import type { SbbExpansionPanelElement } from '../expansion-panel.js';

import style from './expansion-panel-header.scss?lit&inline';

/**
 * It acts as a native `summary` tag for the `sbb-expansion-panel` component.
 *
 * @slot - Use the unnamed slot to add content to the `sbb-expansion-panel-header`.
 * @slot icon - Slot used to render the `sbb-expansion-panel-header` icon.
 * @event {CustomEvent<void>} toggleExpanded - Notifies that the `sbb-expansion-panel` has to expand.
 */
@customElement('sbb-expansion-panel-header')
@hostAttributes({
  slot: 'header',
})
export class SbbExpansionPanelHeaderElement extends SbbDisabledTabIndexActionMixin(
  SbbIconNameMixin(SbbButtonBaseElement),
) {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    toggleExpanded: 'toggleExpanded',
  } as const;

  /** Notifies that the `sbb-expansion-panel` has to expand. */
  private _toggleExpanded: EventEmitter = new EventEmitter(
    this,
    SbbExpansionPanelHeaderElement.events.toggleExpanded,
    {
      bubbles: true,
    },
  );
  private _abort = new SbbConnectedAbortController(this);
  private _namedSlots = new SbbSlotStateController(this, () => this._setDataIconAttribute());

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('click', () => this._emitExpandedEvent(), { signal });
    this.addEventListener('mouseenter', () => this._onMouseMovement(true), { signal });
    this.addEventListener('mouseleave', () => this._onMouseMovement(false), { signal });
  }

  private _emitExpandedEvent(): void {
    if (!this.disabled) {
      this._toggleExpanded.emit();
    }
  }

  private _onMouseMovement(toggleDataAttribute: boolean): void {
    const parent: SbbExpansionPanelElement = this.closest('sbb-expansion-panel')!;
    // The `sbb.hover-mq` logic has been removed from scss, but it must be replicated to have the correct behavior on mobile.
    if (!toggleDataAttribute || (parent && window.matchMedia('(any-hover: hover)').matches)) {
      parent.toggleAttribute('data-toggle-hover', toggleDataAttribute);
    }
  }

  /**
   * The 'data-icon' is used by the 'sbb-expansion-panel'.
   * It needs to be set before the @slotchange event bubbles to the 'expansion-panel'
   * but after the 'NamedSlotStateController' has run.
   */
  private _setDataIconAttribute(): void {
    this.toggleAttribute('data-icon', !!(this.iconName || this._namedSlots.slots.has('icon')));
  }

  protected override renderTemplate(): TemplateResult {
    this._setDataIconAttribute();
    return html`
      <span class="sbb-expansion-panel-header__title">
        <span class="sbb-expansion-panel-header__icon"> ${this.renderIconSlot()} </span>
        <slot></slot>
      </span>
      ${!this.disabled
        ? html`<span class="sbb-expansion-panel-header__toggle">
            <sbb-icon
              name="chevron-small-down-medium"
              class="sbb-expansion-panel-header__toggle-icon"
            >
            </sbb-icon>
          </span>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-expansion-panel-header': SbbExpansionPanelHeaderElement;
  }
}
