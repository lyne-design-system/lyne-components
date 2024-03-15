import type { TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import type { SbbAutocompleteElement } from '../../autocomplete';
import { SbbOptgroupBaseElement } from '../../core/common-behaviors/optgroup-base-element';
import { setAttribute } from '../../core/dom';
import type { SbbOptionElement, SbbOptionVariant } from '../option';

import '../../divider';

/**
 * It can be used as a container for one or more `sbb-option`.
 *
 * @slot - Use the unnamed slot to add `sbb-option` elements to the `sbb-optgroup`.
 */
@customElement('sbb-optgroup')
export class SbbOptGroupElement extends SbbOptgroupBaseElement {
  private _variant!: SbbOptionVariant;

  private get _isMultiple(): boolean {
    return this._variant === 'select' && !!this.closest('sbb-select')?.hasAttribute('multiple');
  }

  protected get options(): SbbOptionElement[] {
    return Array.from(this.querySelectorAll?.('sbb-option') ?? []) as SbbOptionElement[];
  }

  protected getAutocompleteParent(): SbbAutocompleteElement {
    return this.closest('sbb-autocomplete')!; // fixme
  }

  protected setAttributeFromParent(): void {
    this.negative = !!this.closest?.(`:is(sbb-autocomplete, sbb-select, sbb-form-field)[negative]`);
    this.toggleAttribute('data-negative', this.negative);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._setVariantByContext();
  }

  private _setVariantByContext(): void {
    if (this.closest?.('sbb-autocomplete')) {
      this._variant = 'autocomplete';
    } else if (this.closest?.('sbb-select')) {
      this._variant = 'select';
    }
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'data-variant', this._variant);
    setAttribute(this, 'data-multiple', this._isMultiple);
    return super.render();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-optgroup': SbbOptGroupElement;
  }
}
