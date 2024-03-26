import { nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { assignId, getNextElementIndex } from '../../core/a11y';
import { hostAttributes } from '../../core/common-behaviors';
import { SbbAutocompleteBaseElement } from '../../core/common-behaviors/autocomplete-base-element';
import { getDocumentWritingMode, isValidAttribute, setAttribute } from '../../core/dom';
import { EventEmitter } from '../../core/eventing';
import { setAriaComboBoxAttributes } from '../../core/overlay';
import type { SbbDividerElement } from '../../divider';
import type { SbbOptGroupElement, SbbOptionElement } from '../../option';
import type { SbbAutocompleteGridButtonElement } from '../autocomplete-grid-button';
import { SbbAutocompleteGridOptionElement } from '../autocomplete-grid-option';
import type { SbbAutocompleteGridRowElement } from '../autocomplete-grid-row';

let nextId = 0;

/**
 * Combined with a native input, it displays a panel with a list of available options with connected buttons.
 *
 * @slot - Use the unnamed slot to add `sbb-autocomplete-grid-row` or `sbb-autocomplete-grid-optgroup` elements to the `sbb-autocomplete-grid`.
 * @event {CustomEvent<void>} willOpen - Emits whenever the `sbb-autocomplete-grid` starts the opening transition. Can be canceled.
 * @event {CustomEvent<void>} didOpen - Emits whenever the `sbb-autocomplete-grid` is opened.
 * @event {CustomEvent<void>} willClose - Emits whenever the `sbb-autocomplete-grid` begins the closing transition. Can be canceled.
 * @event {CustomEvent<void>} didClose - Emits whenever the `sbb-autocomplete-grid` is closed.
 * @cssprop [--sbb-autocomplete-z-index=var(--sbb-overlay-z-index)] - To specify a custom stack order,
 * the `z-index` can be overridden by defining this CSS variable. The default `z-index` of the
 * component is set to `var(--sbb-overlay-z-index)` with a value of `1000`.
 */
@customElement('sbb-autocomplete-grid')
@hostAttributes({
  dir: getDocumentWritingMode(),
})
export class SbbAutocompleteGridElement extends SbbAutocompleteBaseElement {
  public static readonly events = {
    willOpen: 'willOpen',
    didOpen: 'didOpen',
    willClose: 'willClose',
    didClose: 'didClose',
  } as const;

  /** Emits whenever the `sbb-autocomplete` starts the opening transition. */
  protected willOpen: EventEmitter = new EventEmitter(
    this,
    SbbAutocompleteGridElement.events.willOpen,
  );

  /** Emits whenever the `sbb-autocomplete` is opened. */
  protected didOpen: EventEmitter = new EventEmitter(
    this,
    SbbAutocompleteGridElement.events.didOpen,
  );

  /** Emits whenever the `sbb-autocomplete` begins the closing transition. */
  protected willClose: EventEmitter = new EventEmitter(
    this,
    SbbAutocompleteGridElement.events.willClose,
  );

  /** Emits whenever the `sbb-autocomplete` is closed. */
  protected didClose: EventEmitter = new EventEmitter(
    this,
    SbbAutocompleteGridElement.events.didClose,
  );

  protected overlayId = `sbb-autocomplete-grid-${++nextId}`;
  private _activeItemIndex = -1;
  private _activeColumnIndex = 0;

  protected get options(): SbbAutocompleteGridOptionElement[] {
    return Array.from(this.querySelectorAll?.('sbb-autocomplete-grid-option') ?? []);
  }

  private get _row(): SbbAutocompleteGridRowElement[] {
    return (
      Array.from(this.querySelectorAll?.('sbb-autocomplete-grid-row')).filter(
        (row) => !row.hasAttribute('data-disabled'),
      ) ?? []
    );
  }

  /** When an option is selected, update the input value and close the autocomplete. */
  protected onOptionSelected(event: CustomEvent): void {
    const target = event.target as SbbAutocompleteGridOptionElement;
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
      (event.target as Element).tagName !== 'SBB-AUTOCOMPLETE-GRID-OPTION' ||
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
      'autocompleteOptionSelectionChange',
      (e: CustomEvent<void>) => this.onOptionSelected(e),
      { signal },
    );
  }

  protected syncNegative(): void {
    this.querySelectorAll?.<SbbDividerElement | SbbAutocompleteGridButtonElement>(
      'sbb-divider, sbb-autocomplete-grid-button',
    ).forEach((e) => (e.negative = this.negative));

    this.querySelectorAll?.<SbbAutocompleteGridOptionElement | SbbOptGroupElement>(
      'sbb-autocomplete-grid-row, sbb-autocomplete-grid-option, sbb-autocomplete-grid-optgroup',
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
        this.selectByKeyboard(event);
        break;

      case 'ArrowDown':
      case 'ArrowUp':
        this.setNextActiveOption(event);
        break;

      case 'ArrowRight':
      case 'ArrowLeft':
        this._setNextHorizontalActiveElement(event);
        break;
    }
  }

  protected selectByKeyboard(event: KeyboardEvent): void {
    if (this._activeColumnIndex !== 0) {
      (
        this._row[this._activeItemIndex].querySelectorAll(
          'sbb-autocomplete-grid-option, sbb-autocomplete-grid-button',
        )[this._activeColumnIndex] as SbbAutocompleteGridButtonElement
      ).dispatchClick(event);
    } else {
      const activeOption = this.options[this._activeItemIndex];
      if (activeOption) {
        activeOption.setSelectedViaUserInteraction(true);
      }
    }
  }

  protected setNextActiveOption(event: KeyboardEvent): void {
    const filteredOptions = this.options.filter(
      (opt) => !opt.disabled && !isValidAttribute(opt, 'data-group-disabled'),
    );

    // Get and activate the next active option
    const next = getNextElementIndex(event, this._activeItemIndex, filteredOptions.length);
    if (isNaN(next)) {
      return;
    }
    const nextActiveOption = filteredOptions[next];
    nextActiveOption.active = true;
    this.triggerElement?.setAttribute('aria-activedescendant', nextActiveOption.id);
    nextActiveOption.scrollIntoView({ block: 'nearest' });

    // Reset the previous active option/button
    if (this._activeColumnIndex !== 0) {
      this._row[this._activeItemIndex]
        .querySelectorAll('sbb-autocomplete-grid-button')
        .forEach((e) => e.toggleAttribute('data-focus-visible', false));
    } else {
      const lastActiveOption = filteredOptions[this._activeItemIndex];
      if (lastActiveOption) {
        lastActiveOption.active = false;
      }
    }
    this._activeItemIndex = next;
    this._activeColumnIndex = 0;
  }

  private _setNextHorizontalActiveElement(event: KeyboardEvent): void {
    if (this._activeItemIndex < 0) {
      return;
    }

    const elementsInRow: (SbbAutocompleteGridOptionElement | SbbAutocompleteGridButtonElement)[] =
      Array.from(
        this._row[this._activeItemIndex].querySelectorAll<
          SbbAutocompleteGridOptionElement | SbbAutocompleteGridButtonElement
        >('sbb-autocomplete-grid-option, sbb-autocomplete-grid-button'),
      ).filter((el) => !el.disabled && !isValidAttribute(el, 'data-group-disabled'));
    const next: number = getNextElementIndex(event, this._activeColumnIndex, elementsInRow.length);
    if (isNaN(next)) {
      return;
    }
    const nextElement: SbbAutocompleteGridOptionElement | SbbAutocompleteGridButtonElement =
      elementsInRow[next];
    if (nextElement instanceof SbbAutocompleteGridOptionElement) {
      nextElement.active = true;
    } else {
      nextElement.toggleAttribute('data-focus-visible', true);
    }

    const lastActiveElement: SbbAutocompleteGridOptionElement | SbbAutocompleteGridButtonElement =
      elementsInRow[this._activeColumnIndex];
    if (lastActiveElement instanceof SbbAutocompleteGridOptionElement) {
      lastActiveElement.active = false;
    } else {
      lastActiveElement.toggleAttribute('data-focus-visible', false);
    }
    this.triggerElement?.setAttribute('aria-activedescendant', nextElement.id);
    nextElement.scrollIntoView({ block: 'nearest' });
    this._activeColumnIndex = next;
  }

  protected resetActiveElement(): void {
    if (this._activeColumnIndex !== 0) {
      this._row[this._activeItemIndex]
        .querySelectorAll('sbb-autocomplete-grid-button')
        .forEach((e) => e.toggleAttribute('data-focus-visible', false));
    } else {
      const activeElement = this.options.filter(
        (opt) => !opt.disabled && !isValidAttribute(opt, 'data-group-disabled'),
      )[this._activeItemIndex];
      if (activeElement) {
        activeElement.active = false;
      }
    }
    this._activeItemIndex = -1;
    this._activeColumnIndex = 0;
    this.triggerElement?.removeAttribute('aria-activedescendant');
  }

  protected setTriggerAttributes(element: HTMLInputElement): void {
    setAriaComboBoxAttributes(element, this.id || this.overlayId, false, 'grid');
  }

  protected setRoleOnInnerPanel(): string | typeof nothing {
    return !this.ariaRoleOnHost ? 'grid' : nothing;
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'role', this.ariaRoleOnHost ? 'grid' : null);
    this.ariaRoleOnHost && assignId(() => this.overlayId)(this);
    return super.render();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-autocomplete-grid': SbbAutocompleteGridElement;
  }
}
