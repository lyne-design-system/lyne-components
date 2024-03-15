import {
  type CSSResultGroup,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { property, state } from 'lit/decorators.js';

import type { SbbAutocompleteElement } from '../../autocomplete';
import type { SbbAutocompleteGridElement } from '../../autocomplete-grid';
import { isSafari, isValidAttribute, setAttribute } from '../dom';
import { AgnosticMutationObserver } from '../observers';

import { SbbDisabledMixin } from './disabled-mixins';
import style from './optgroup-base-element.scss?lit&inline';
import type { SbbOptionBaseElement } from './option-base-element';
import { SlotChildObserver } from './slot-child-observer';

export abstract class SbbOptgroupBaseElement extends SlotChildObserver(
  SbbDisabledMixin(LitElement),
) {
  public static override styles: CSSResultGroup = style;

  /** Option group label. */
  @property() public label!: string;

  @state() protected negative = false;

  private _negativeObserver = new AgnosticMutationObserver(() => this._onNegativeChange());

  /**
   * On Safari, the groups labels are not read by VoiceOver.
   * To solve the problem, we remove the role="group" and add a hidden span containing the group name
   * TODO: We should periodically check if it has been solved and, if so, remove the property.
   */
  private _inertAriaGroups = isSafari();

  protected abstract get options(): SbbOptionBaseElement[];
  protected abstract setAttributeFromParent(): void;
  protected abstract getAutocompleteParent(): SbbAutocompleteGridElement | SbbAutocompleteElement; // fixme autocomplete base element

  public override connectedCallback(): void {
    super.connectedCallback();
    this._negativeObserver?.disconnect();
    this.setAttributeFromParent();
    this._negativeObserver.observe(this, {
      attributes: true,
      attributeFilter: ['data-negative'],
    });

    this._proxyGroupLabelToOptions();
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);
    if (changedProperties.has('disabled')) {
      this.proxyDisabledToOptions();
    }
    if (changedProperties.has('label')) {
      this._proxyGroupLabelToOptions();
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._negativeObserver?.disconnect();
  }

  protected override checkChildren(): void {
    this.proxyDisabledToOptions();
    this._proxyGroupLabelToOptions();
    this._highlightOptions();
  }

  private _proxyGroupLabelToOptions(): void {
    if (!this._inertAriaGroups) {
      return;
    }

    this.options.forEach((opt) => opt.setGroupLabel(this.label));
  }

  protected proxyDisabledToOptions(): void {
    for (const option of this.options) {
      option.toggleAttribute('data-group-disabled', this.disabled);
    }
  }

  private _highlightOptions(): void {
    const autocomplete = this.getAutocompleteParent();
    if (!autocomplete) {
      return;
    }
    const value = autocomplete.triggerElement?.value;
    if (!value) {
      return;
    }
    this.options.forEach((opt) => opt.highlight(value));
  }

  private _onNegativeChange(): void {
    this.negative = isValidAttribute(this, 'data-negative');
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'role', !this._inertAriaGroups ? 'group' : null);
    setAttribute(this, 'aria-label', !this._inertAriaGroups && this.label);
    setAttribute(this, 'aria-disabled', !this._inertAriaGroups && this.disabled.toString());

    return html`
      <div class="sbb-optgroup__divider">
        <sbb-divider ?negative=${this.negative}></sbb-divider>
      </div>
      <div class="sbb-optgroup__label" aria-hidden="true">
        <div class="sbb-optgroup__icon-space"></div>
        <span>${this.label}</span>
      </div>
      <slot></slot>
    `;
  }
}
