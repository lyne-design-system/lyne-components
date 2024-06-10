import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { hostAttributes } from '../../core/decorators.js';
import { isSafari, setOrRemoveAttribute } from '../../core/dom.js';
import { SbbDisabledMixin, SbbHydrationMixin } from '../../core/mixins.js';
import { AgnosticMutationObserver } from '../../core/observers.js';
import type { SbbOptionElement } from '../option.js';

import style from './optgroup.scss?lit&inline';

import '../../divider.js';

/**
 * On Safari, the groups labels are not read by VoiceOver.
 * To solve the problem, we remove the role="group" and add a hidden span containing the group name
 * TODO: We should periodically check if it has been solved and, if so, remove the property.
 */
const inertAriaGroups = isSafari;

/**
 * It can be used as a container for one or more `sbb-option`.
 *
 * @slot - Use the unnamed slot to add `sbb-option` elements to the `sbb-optgroup`.
 */
@customElement('sbb-optgroup')
@hostAttributes({ role: !inertAriaGroups ? 'group' : null })
export class SbbOptGroupElement extends SbbDisabledMixin(SbbHydrationMixin(LitElement)) {
  public static override styles: CSSResultGroup = style;

  /** Option group label. */
  @property() public label!: string;

  @state() private _negative = false;

  private _negativeObserver = new AgnosticMutationObserver(() => this._onNegativeChange());

  private get _options(): SbbOptionElement[] {
    return Array.from(this.querySelectorAll?.('sbb-option') ?? []) as SbbOptionElement[];
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._negativeObserver?.disconnect();
    this._negative = !!this.closest?.(
      `:is(sbb-autocomplete, sbb-select, sbb-form-field)[negative]`,
    );
    this.toggleAttribute('data-negative', this._negative);

    this._negativeObserver.observe(this, {
      attributes: true,
      attributeFilter: ['data-negative'],
    });

    this._setVariantByContext();
    this._proxyGroupLabelToOptions();

    this.toggleAttribute('data-multiple', !!this.closest('sbb-select[multiple]'));
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('disabled')) {
      if (!inertAriaGroups) {
        this.setAttribute('aria-disabled', this.disabled.toString());
      }

      this._proxyDisabledToOptions();
    }
    if (changedProperties.has('label')) {
      this._proxyGroupLabelToOptions();
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._negativeObserver?.disconnect();
  }

  private _setVariantByContext(): void {
    if (this.closest?.('sbb-autocomplete')) {
      this.setAttribute('data-variant', 'autocomplete');
    } else if (this.closest?.('sbb-select')) {
      this.setAttribute('data-variant', 'select');
    }
  }

  private _handleSlotchange(): void {
    this._proxyDisabledToOptions();
    this._proxyGroupLabelToOptions();
    this._highlightOptions();
  }

  private _proxyGroupLabelToOptions(): void {
    if (!inertAriaGroups) {
      setOrRemoveAttribute(this, 'aria-label', this.label);
      return;
    } else if (this.label) {
      this.removeAttribute('aria-label');
      for (const option of this._options) {
        option.setAttribute('data-group-label', this.label);
        option.requestUpdate?.();
      }
    } else {
      for (const option of this._options) {
        option.removeAttribute('data-group-label');
        option.requestUpdate?.();
      }
    }
  }

  private _proxyDisabledToOptions(): void {
    for (const option of this._options) {
      option.toggleAttribute('data-group-disabled', this.disabled);
    }
  }

  private _highlightOptions(): void {
    const autocomplete = this.closest('sbb-autocomplete');
    if (!autocomplete) {
      return;
    }
    const value = autocomplete.triggerElement?.value;
    if (!value) {
      return;
    }
    this._options.forEach((opt) => opt.highlight(value));
  }

  private _onNegativeChange(): void {
    this._negative = this.hasAttribute('data-negative');
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-optgroup__divider">
        <sbb-divider ?negative=${this._negative}></sbb-divider>
      </div>
      <div class="sbb-optgroup__label" aria-hidden="true">
        <div class="sbb-optgroup__icon-space"></div>
        <span>${this.label}</span>
      </div>
      <slot @slotchange=${this._handleSlotchange}></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-optgroup': SbbOptGroupElement;
  }
}
