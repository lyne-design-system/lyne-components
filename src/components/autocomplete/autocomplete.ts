import { nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { assignId, getNextElementIndex } from '../core/a11y';
import { hostAttributes } from '../core/common-behaviors';
import { SbbAutocompleteBaseElement } from '../core/common-behaviors/autocomplete-base-element';
import { getDocumentWritingMode, isValidAttribute, setAttribute } from '../core/dom';
import { EventEmitter } from '../core/eventing';
import { setAriaComboBoxAttributes } from '../core/overlay';
import type { SbbOptGroupElement, SbbOptionElement } from '../option';

let nextId = 0;

/**
 * Combined with a native input, it displays a panel with a list of available options.
 *
 * @slot - Use the unnamed slot to add `sbb-option` or `sbb-optgroup` elements to the `sbb-autocomplete`.
 * @event {CustomEvent<void>} willOpen - Emits whenever the `sbb-autocomplete` starts the opening transition. Can be canceled.
 * @event {CustomEvent<void>} didOpen - Emits whenever the `sbb-autocomplete` is opened.
 * @event {CustomEvent<void>} willClose - Emits whenever the `sbb-autocomplete` begins the closing transition. Can be canceled.
 * @event {CustomEvent<void>} didClose - Emits whenever the `sbb-autocomplete` is closed.
 * @cssprop [--sbb-autocomplete-z-index=var(--sbb-overlay-z-index)] - To specify a custom stack order,
 * the `z-index` can be overridden by defining this CSS variable. The default `z-index` of the
 * component is set to `var(--sbb-overlay-z-index)` with a value of `1000`.
 */
@customElement('sbb-autocomplete')
@hostAttributes({
  dir: getDocumentWritingMode(),
})
export class SbbAutocompleteElement extends SbbAutocompleteBaseElement {
  public static readonly events = {
    willOpen: 'willOpen',
    didOpen: 'didOpen',
    willClose: 'willClose',
    didClose: 'didClose',
  } as const;

  /** Emits whenever the `sbb-autocomplete` starts the opening transition. */
  protected willOpen: EventEmitter = new EventEmitter(this, SbbAutocompleteElement.events.willOpen);

  /** Emits whenever the `sbb-autocomplete` is opened. */
  protected didOpen: EventEmitter = new EventEmitter(this, SbbAutocompleteElement.events.didOpen);

  /** Emits whenever the `sbb-autocomplete` begins the closing transition. */
  protected willClose: EventEmitter = new EventEmitter(
    this,
    SbbAutocompleteElement.events.willClose,
  );

  /** Emits whenever the `sbb-autocomplete` is closed. */
  protected didClose: EventEmitter = new EventEmitter(this, SbbAutocompleteElement.events.didClose);

  protected overlayId = `sbb-autocomplete-${++nextId}`;
  private _activeItemIndex = -1;

  protected get options(): SbbOptionElement[] {
    return Array.from(this.querySelectorAll?.('sbb-option') ?? []);
  }

  /** When an option is selected, update the input value and close the autocomplete. */
  protected onOptionSelected(event: CustomEvent): void {
    const target = event.target as SbbOptionElement;
    if (!target.selected) {
      return;
    }

    // Deselect the previous options
    this.options
      .filter((option) => option.id !== target.id && option.selected)
      .forEach((option) => (option.selected = false));

    if (this.triggerElement) {
      // Set the option value
      this.triggerElement.value = target.value as string;

      // Manually trigger the change events
      this.triggerElement.dispatchEvent(new Event('change', { bubbles: true }));
      this.triggerElement.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    }

    this.close();
  }

  protected onOptionClick(event: MouseEvent): void {
    if (
      (event.target as Element).tagName !== 'SBB-OPTION' ||
      (event.target as SbbOptionElement).disabled
    ) {
      return;
    }
    this.close();
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this.abort.signal;
    this.addEventListener(
      'optionSelectionChange',
      (e: CustomEvent<void>) => this.onOptionSelected(e),
      { signal },
    );
  }

  protected syncNegative(): void {
    this.querySelectorAll?.('sbb-divider').forEach((divider) => (divider.negative = this.negative));

    this.querySelectorAll?.<SbbOptionElement | SbbOptGroupElement>(
      'sbb-option, sbb-optgroup',
    ).forEach((element) => element.toggleAttribute('data-negative', this.negative));
  }

  protected openedPanelKeyboardInteraction(event: KeyboardEvent): void {
    if (this.state !== 'opened') {
      return;
    }

    switch (event.key) {
      case 'Escape':
      case 'Tab':
        this.close();
        break;

      case 'Enter':
        this.selectByKeyboard();
        break;

      case 'ArrowDown':
      case 'ArrowUp':
        this.setNextActiveOption(event);
        break;
    }
  }

  protected selectByKeyboard(): void {
    const activeOption = this.options[this._activeItemIndex];

    if (activeOption) {
      activeOption.setSelectedViaUserInteraction(true);
    }
  }

  protected setNextActiveOption(event: KeyboardEvent): void {
    const filteredOptions = this.options.filter(
      (opt) => !opt.disabled && !isValidAttribute(opt, 'data-group-disabled'),
    );

    // Get and activate the next active option
    const next = getNextElementIndex(event, this._activeItemIndex, filteredOptions.length);
    const nextActiveOption = filteredOptions[next];
    nextActiveOption.active = true;
    this.triggerElement?.setAttribute('aria-activedescendant', nextActiveOption.id);
    nextActiveOption.scrollIntoView({ block: 'nearest' });

    // Reset the previous active option
    const lastActiveOption = filteredOptions[this._activeItemIndex];
    if (lastActiveOption) {
      lastActiveOption.active = false;
    }

    this._activeItemIndex = next;
  }

  protected resetActiveElement(): void {
    const activeElement = this.options[this._activeItemIndex];

    if (activeElement) {
      activeElement.active = false;
    }
    this._activeItemIndex = -1;
    this.triggerElement?.removeAttribute('aria-activedescendant');
  }

  protected setTriggerAttributes(element: HTMLInputElement): void {
    setAriaComboBoxAttributes(element, this.id || this.overlayId, false);
  }

  protected setRoleOnInnerPanel(): string | typeof nothing {
    return !this.ariaRoleOnHost ? 'listbox' : nothing;
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'role', this.ariaRoleOnHost ? 'listbox' : null);
    this.ariaRoleOnHost && assignId(() => this.overlayId)(this);
    return super.render();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-autocomplete': SbbAutocompleteElement;
  }
}
