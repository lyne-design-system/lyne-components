import { type CSSResultGroup, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import {
  hostAttributes,
  SbbDisabledMixin,
  SbbMiniButtonBaseElement,
} from '../../core/common-behaviors';
import { isValidAttribute, setAttribute } from '../../core/dom';
import { AgnosticMutationObserver } from '../../core/observers';

import style from './autocomplete-grid-button.scss?lit&inline';

/** Configuration for the attribute to look at if component is nested in a sbb-optgroup */
const buttonObserverConfig: MutationObserverInit = {
  attributeFilter: ['data-group-disabled', 'data-negative'], // fixme negative
};

/**
 * It displays an icon-only button that can be used in `sbb-autocomplete-grid`.
 *
 * @slot icon - Slot used to display the icon, if one is set
 */
@customElement('sbb-autocomplete-grid-button')
@hostAttributes({
  tabindex: null,
})
export class SbbAutocompleteGridButtonElement extends SbbDisabledMixin(SbbMiniButtonBaseElement) {
  public static override styles: CSSResultGroup = style;

  /** Whether the component must be set disabled due disabled attribute on sbb-optgroup. */
  @state() private _disabledFromGroup = false;

  /** MutationObserver on data attributes. */
  private _optionAttributeObserver = new AgnosticMutationObserver((mutationsList) =>
    this._onOptionAttributesChange(mutationsList),
  );

  /** Observe changes on data attributes and set the appropriate values. */
  private _onOptionAttributesChange(mutationsList: MutationRecord[]): void {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'data-group-disabled') {
        this._disabledFromGroup = isValidAttribute(this, 'data-group-disabled');
      }
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const parentGroup = this.closest?.('sbb-autocomplete-grid-optgroup');
    if (parentGroup) {
      this._disabledFromGroup = parentGroup.disabled;
    }
    this._optionAttributeObserver.observe(this, buttonObserverConfig);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._optionAttributeObserver.disconnect();
  }

  public dispatchClick(event: KeyboardEvent): void {
    return super.dispatchClickEvent(event);
  }

  protected override renderTemplate(): TemplateResult {
    setAttribute(this, 'aria-disabled', `${this.disabled || this._disabledFromGroup}`);
    return super.renderTemplate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-autocomplete-grid-button': SbbAutocompleteGridButtonElement;
  }
}
