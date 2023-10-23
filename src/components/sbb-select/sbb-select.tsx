import { getNextElementIndex, assignId } from '../../global/a11y';
import {
  isSafari,
  isValidAttribute,
  toggleDatasetEntry,
  getDocumentWritingMode,
} from '../../global/dom';
import {
  setOverlayPosition,
  isEventOnElement,
  overlayGapFixCorners,
  SbbOverlayState,
} from '../../global/overlay';
import { CSSResult, html, LitElement, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { SbbOption } from '../sbb-option';
import { setAttribute } from '../../global/dom';
import { ConnectedAbortController, EventEmitter } from '../../global/eventing';
import { SbbOptGroup } from '../sbb-optgroup';
import Style from './sbb-select.scss?lit&inline';

let nextId = 0;

export interface SelectChange {
  type: 'value';
  value: string | string[];
}

/**
 * @slot unnamed - Use this slot to project options.
 */
@customElement('sbb-select')
export class SbbSelect extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    didChange: 'did-change',
    change: 'change',
    input: 'input',
    stateChange: 'state-change',
    willOpen: 'will-open',
    didOpen: 'did-open',
    willClose: 'will-close',
    didClose: 'did-close',
  };

  /** The value of the select component. If `multiple` is true, it's an array. */
  @property() public value: string | string[];

  /** The placeholder used if no value has been selected. */
  @property() public placeholder: string;

  /** Whether the select allows for multiple selection. */
  @property({ type: Boolean }) public multiple = false;

  /** Whether the select is required. */
  @property({ type: Boolean }) public required = false;

  /** Whether the select is disabled. */
  @property({ type: Boolean }) public disabled = false;

  /** Whether the select is readonly. */
  @property({ type: Boolean }) public readonly = false;

  /** Negative coloring variant flag. */
  @property({ reflect: true, type: Boolean }) public negative = false;

  /** Whether the animation is disabled. */
  @property({ attribute: 'disable-animation', reflect: true, type: Boolean })
  public disableAnimation = false;

  /** The state of the select. */
  @state() private _state: SbbOverlayState = 'closed';

  /** The value displayed by the component. */
  @state() private _displayValue: string;

  /**
   * @deprecated only used for React. Will probably be removed once React 19 is available.
   */
  private _didChange: EventEmitter = new EventEmitter(this, SbbSelect.events.didChange);

  private _change: EventEmitter = new EventEmitter(this, SbbSelect.events.change);

  private _input: EventEmitter = new EventEmitter(this, SbbSelect.events.input);

  /** @internal */
  private _stateChange: EventEmitter<SelectChange> = new EventEmitter(
    this,
    SbbSelect.events.stateChange,
    {
      composed: false,
    },
  );

  /** Emits whenever the select starts the opening transition. */
  private _willOpen: EventEmitter<void> = new EventEmitter(this, SbbSelect.events.willOpen);

  /** Emits whenever the select is opened. */
  private _didOpen: EventEmitter<void> = new EventEmitter(this, SbbSelect.events.didOpen);

  /** Emits whenever the select begins the closing transition. */
  private _willClose: EventEmitter<void> = new EventEmitter(this, SbbSelect.events.willClose);

  /** Emits whenever the select is closed. */
  private _didClose: EventEmitter<void> = new EventEmitter(this, SbbSelect.events.didClose);

  private _overlay: HTMLElement;
  private _optionContainer: HTMLElement;
  private _originElement: HTMLElement;
  private _triggerElement: HTMLElement;
  private _openPanelEventsController: AbortController;
  private _overlayId = `sbb-select-${++nextId}`;
  private _activeItemIndex = -1;
  private _searchTimeout: ReturnType<typeof setTimeout>;
  private _searchString = '';
  private _didLoad = false;
  private _isPointerDownEventOnMenu: boolean;
  private _abort = new ConnectedAbortController(this);

  /**
   * On Safari, the aria role 'listbox' must be on the host element, or else VoiceOver won't work at all.
   * On the other hand, JAWS and NVDA need the role to be an "immediate parent" to the options, or else optgroups won't work.
   */
  private _ariaRoleOnHost = isSafari();

  /** Gets all the HTMLSbbOptionElement projected in the select. */
  private get _options(): SbbOption[] {
    return Array.from(this.querySelectorAll('sbb-option'));
  }

  private get _filteredOptions(): SbbOption[] {
    return this._options.filter(
      (opt: SbbOption) =>
        !isValidAttribute(opt, 'disabled') && !isValidAttribute(opt, 'data-group-disabled'),
    );
  }

  /** Opens the selection panel. */
  public open(): void {
    if (this._state !== 'closed' || !this._overlay || this._options.length === 0) {
      return;
    }

    this._state = 'opening';
    this._willOpen.emit();
    this._setOverlayPosition();
  }

  /** Closes the selection panel. */
  public close(): void {
    if (this._state !== 'opened') {
      return;
    }

    this._state = 'closing';
    this._willClose.emit();
    this._openPanelEventsController.abort();
  }

  /** Gets the current displayed value. */
  public getDisplayValue(): string {
    return !this._displayValue ? '' : this._displayValue;
  }

  /** Listens to option changes. */
  private _onOptionChanged(event: Event): void {
    const target = event.target as SbbOption;
    if (target.selected) {
      this._onOptionSelected(target);
    } else {
      this._onOptionDeselected(target);
    }
  }

  private _onOptionClick(event): void {
    if (event.target?.tagName !== 'SBB-OPTION' || event.target.disabled) {
      return;
    }

    if (!this.multiple) {
      this.close();
    }
  }

  /** Sets the _displayValue by checking the internal sbb-options and setting the correct `selected` value on them. */
  private _onValueChanged(newValue: string | string[]): void {
    if (!Array.isArray(newValue)) {
      const optionElement = this._filteredOptions.find((e) => e.value === newValue);
      if (optionElement) {
        optionElement.selected = true;
      }
      this._filteredOptions
        .filter((option) => option.value !== newValue)
        .forEach((option) => (option.selected = false));
      this._displayValue = optionElement?.textContent || null;
    } else {
      this._filteredOptions
        .filter((opt) => !newValue.includes(opt.value))
        .forEach((e) => (e.selected = false));
      const selectedOptionElements = this._filteredOptions.filter((opt) =>
        newValue.includes(opt.value),
      );
      selectedOptionElements.forEach((e) => (e.selected = true));
      this._displayValue = selectedOptionElements.map((e) => e.textContent).join(', ') || null;
    }
    this._stateChange.emit({ type: 'value', value: newValue });
  }

  protected override firstUpdated(): void {
    this._setupOrigin();
    this._setupTrigger();

    // Override the default focus behavior
    this.focus = () => this._triggerElement.focus();
    this._didLoad = true;
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    const formField = this.closest('sbb-form-field') ?? this.closest('[data-form-field]');

    if (formField) {
      this.negative = isValidAttribute(formField, 'negative');
    }
    this._syncNegative();

    if (this._didLoad) {
      this._setupOrigin();
      this._setupTrigger();
    }
    if (this.value) {
      this._onValueChanged(this.value);
    }

    this.addEventListener('option-selection-change', (e) => this._onOptionChanged(e), { signal });
    this.addEventListener('click', (e) => this._onOptionClick(e), { signal });
    this.addEventListener('click', () => this._toggleOpening(), { signal });
  }

  public override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('value')) {
      this._onValueChanged(this.value);
    }
    if (changedProperties.has('negative')) {
      this._syncNegative();
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.prepend(this._triggerElement); // Take back the trigger element previously moved to the light DOM
    this._openPanelEventsController?.abort();
  }

  private _syncNegative(): void {
    this.querySelectorAll('sbb-divider').forEach((element) => (element.negative = this.negative));

    this.querySelectorAll('sbb-option, sbb-optgroup').forEach((element: SbbOption | SbbOptGroup) =>
      toggleDatasetEntry(element, 'negative', this.negative),
    );
  }

  /** Sets the originElement; if the component is used in a sbb-form-field uses it, otherwise uses the parentElement. */
  private _setupOrigin(): void {
    const formField = this.closest('sbb-form-field');
    this._originElement =
      formField?.shadowRoot.querySelector('#overlay-anchor') || this.parentElement;
    if (this._originElement) {
      toggleDatasetEntry(
        this,
        'optionPanelOriginBorderless',
        formField?.hasAttribute('borderless'),
      );
    }
  }

  /**
   * To assess screen-readers problems caused by the interaction between aria patterns and shadow DOM,
   * we are forced to move the 'combobox' trigger element to the light DOM
   */
  private _setupTrigger(): void {
    // Move the trigger before the sbb-select
    this.parentElement.insertBefore(this._triggerElement, this);

    // Set the invisible trigger element dimension to match the parent (needed for screen readers)
    const containerElement = this.closest('sbb-form-field') ?? this;
    this._triggerElement.style.top = '0px';
    this._triggerElement.style.height = `${containerElement.offsetHeight}px`;
    this._triggerElement.style.width = `${containerElement.offsetWidth}px`;
  }

  private _setOverlayPosition(): void {
    setOverlayPosition(this._overlay, this._originElement, this._optionContainer, this);
  }

  // In rare cases it can be that the animationEnd event is triggered twice.
  // To avoid entering a corrupt state, exit when state is not expected.
  private _onAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'open' && this._state === 'opening') {
      this._onOpenAnimationEnd();
    } else if (event.animationName === 'close' && this._state === 'closing') {
      this._onCloseAnimationEnd();
    }
  }

  private _onOpenAnimationEnd(): void {
    this._state = 'opened';
    this._attachOpenPanelEvents();
    this._triggerElement.setAttribute('aria-expanded', 'true');

    this._didOpen.emit();
  }

  private _onCloseAnimationEnd(): void {
    this._state = 'closed';
    this._triggerElement.setAttribute('aria-expanded', 'false');
    this._resetActiveElement();
    this._optionContainer.scrollTop = 0;
    this._didClose.emit();
  }

  /** When an option is selected, updates the displayValue; it also closes the select if not `multiple`. */
  private _onOptionSelected(optionSelectionChange: SbbOption): void {
    if (!this.multiple) {
      this._filteredOptions
        .filter((option) => option.id !== optionSelectionChange.id)
        .forEach((option) => (option.selected = false));
      this.value = optionSelectionChange.value;
    } else {
      if (!this.value) {
        this.value = [optionSelectionChange.value];
      } else if (!this.value.includes(optionSelectionChange.value)) {
        this.value = [...this.value, optionSelectionChange.value];
      }
    }

    this._input.emit();
    this._change.emit();
    this._didChange.emit();
  }

  /** When an option is unselected in `multiple`, removes it from value and updates displayValue. */
  private _onOptionDeselected(optionSelectionChange: SbbOption): void {
    if (this.multiple) {
      this.value = (this.value as string[]).filter(
        (el: string) => el !== optionSelectionChange.value,
      );

      this._input.emit();
      this._change.emit();
      this._didChange.emit();
    }
  }

  private _attachOpenPanelEvents(): void {
    this._openPanelEventsController = new AbortController();

    // Recalculate the overlay position on scroll and window resize
    document.addEventListener('scroll', () => this._setOverlayPosition(), {
      passive: true,
      signal: this._openPanelEventsController.signal,
    });
    window.addEventListener('resize', () => this._setOverlayPosition(), {
      passive: true,
      signal: this._openPanelEventsController.signal,
    });

    // Close menu on backdrop click
    window.addEventListener('pointerdown', (ev) => this._pointerDownListener(ev), {
      signal: this._openPanelEventsController.signal,
    });
    window.addEventListener('pointerup', (ev) => this._closeOnBackdropClick(ev), {
      signal: this._openPanelEventsController.signal,
    });
  }

  private async _onKeyDown(event: KeyboardEvent): Promise<void> {
    if (this.disabled || this.readonly) {
      return;
    }

    if (this._state === 'opened') {
      await this._openedPanelKeyboardInteraction(event);
    }
    if (this._state === 'closed') {
      await this._closedPanelKeyboardInteraction(event);
    }
  }

  private async _closedPanelKeyboardInteraction(event: KeyboardEvent): Promise<void> {
    if (this._checkForLetterSelection(event)) {
      return this._setNextActiveOptionByText(event);
    }

    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        await this.open();
        break;
    }
  }

  private async _openedPanelKeyboardInteraction(event: KeyboardEvent): Promise<void> {
    if (this.disabled || this.readonly || this._state !== 'opened') {
      return;
    }

    if (this._checkForLetterSelection(event)) {
      return this._setNextActiveOptionByText(event);
    }

    switch (event.key) {
      case 'Escape':
      case 'Tab':
        await this.close();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        await this._selectByKeyboard();
        break;

      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        await this._setNextActiveOption(event);
        break;

      case 'Home':
      case 'PageUp':
        event.preventDefault();
        await this._setNextActiveOption(event, 0);
        break;

      case 'End':
      case 'PageDown':
        event.preventDefault();
        await this._setNextActiveOption(event, this._filteredOptions.length - 1);
        break;
    }
  }

  private _checkForLetterSelection(event): boolean {
    return (
      event.key === 'Backspace' ||
      event.key === 'Clear' ||
      (event.key.length === 1 &&
        event.key !== ' ' &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey)
    );
  }

  private async _setNextActiveOptionByText(event): Promise<void> {
    // Set timeout and the string to search.
    if (typeof this._searchTimeout === typeof setTimeout) {
      clearTimeout(this._searchTimeout);
    }
    this._searchTimeout = setTimeout(() => (this._searchString = ''), 1000);
    this._searchString += event.key;

    // Reorder the _filteredOption array to have the last selected element at the bottom.
    const indexForSlice: number = this._activeItemIndex + 1;
    const filteredOptionsSorted: SbbOption[] = [
      ...this._filteredOptions.slice(indexForSlice),
      ...this._filteredOptions.slice(0, indexForSlice),
    ];

    const match: SbbOption = filteredOptionsSorted.find(
      (option: SbbOption) =>
        option.textContent.toLowerCase().indexOf(this._searchString.toLowerCase()) === 0,
    );
    if (match) {
      // If an exact match has been found, go to that option.
      await this._setNextActiveOption(event, this._filteredOptions.indexOf(match));
    } else if (
      this._searchString.length > 1 &&
      new RegExp(`^${this._searchString.charAt(0)}*$`).test(this._searchString)
    ) {
      // If no exact match has been found but the string to search is made by the same repeated letter,
      // go to the first element, if exists, that matches the letter.
      const firstMatch: SbbOption = filteredOptionsSorted.find(
        (option: SbbOption) =>
          option.textContent.toLowerCase().indexOf(this._searchString[0].toLowerCase()) === 0,
      );
      if (firstMatch) {
        await this._setNextActiveOption(event, this._filteredOptions.indexOf(firstMatch));
      }
    } else {
      // No match found, clear the timeout and the search term.
      clearTimeout(this._searchTimeout);
      this._searchString = '';
    }
  }

  private async _selectByKeyboard(): Promise<void> {
    const activeOption: SbbOption = this._filteredOptions[this._activeItemIndex];

    if (this.multiple) {
      await activeOption.setSelectedViaUserInteraction(!activeOption.selected);
    } else {
      await this.close();
    }
  }

  private async _setNextActiveOption(event: KeyboardEvent, index?: number): Promise<void> {
    const nextIndex =
      index ?? getNextElementIndex(event, this._activeItemIndex, this._filteredOptions.length);
    const nextOption = this._filteredOptions[nextIndex];
    const activeOption = this._filteredOptions[this._activeItemIndex];

    this._setActiveElement(nextOption, activeOption);

    if (!this.multiple) {
      await this._setSelectedElement(nextOption, activeOption);
    } else if (event?.shiftKey) {
      await nextOption.setSelectedViaUserInteraction(!nextOption.selected);
    }
    this._activeItemIndex = nextIndex;
  }

  private _setActiveElement(
    nextActiveOption: SbbOption,
    lastActiveOption: SbbOption = null,
    setActiveDescendant = true,
  ): void {
    nextActiveOption.active = true;
    nextActiveOption.scrollIntoView({ block: 'nearest' });

    if (setActiveDescendant) {
      this._triggerElement.setAttribute('aria-activedescendant', nextActiveOption.id);
    }

    // Reset the previous
    if (lastActiveOption && lastActiveOption !== nextActiveOption) {
      lastActiveOption.active = false;
    }
  }

  private async _setSelectedElement(
    nextActiveOption: SbbOption,
    lastActiveOption: SbbOption,
  ): Promise<void> {
    await nextActiveOption.setSelectedViaUserInteraction(true);

    if (lastActiveOption && lastActiveOption !== nextActiveOption) {
      await lastActiveOption.setSelectedViaUserInteraction(false);
    }
  }

  private _resetActiveElement(): void {
    const activeElement = this._filteredOptions[this._activeItemIndex];

    if (activeElement) {
      activeElement.active = false;
    }
    this._activeItemIndex = -1;
    this._triggerElement.removeAttribute('aria-activedescendant');
  }

  // Check if the pointerdown event target is triggered on the menu.
  private _pointerDownListener = (event: PointerEvent): void => {
    this._isPointerDownEventOnMenu = isEventOnElement(this._overlay, event);
  };

  // Close menu on backdrop click.
  private _closeOnBackdropClick = async (event: PointerEvent): Promise<void> => {
    if (!this._isPointerDownEventOnMenu && !isEventOnElement(this._overlay, event)) {
      await this.close();
    }
  };

  private _setValueFromSelectedOption(): void {
    if (!this.multiple) {
      const selectedOption = this._filteredOptions.find((option) => option.selected);
      if (selectedOption) {
        this._activeItemIndex = this._filteredOptions.findIndex(
          (option) => option === selectedOption,
        );
        this.value = selectedOption.value;
      }
    } else {
      const options = this._filteredOptions.filter((option) => option.selected);
      if (options && options.length > 0) {
        const value = [];
        for (const option of options) {
          value.push(option.value);
        }
        this.value = value;
      }
    }
  }

  private async _toggleOpening(): Promise<void> {
    if (this.disabled || this.readonly) {
      return;
    }
    this._triggerElement?.focus();

    switch (this._state) {
      case 'opened': {
        this.close();
        break;
      }
      case 'closed': {
        this.open();
        break;
      }
      default:
        break;
    }
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'data-state', this._state);
    setAttribute(this, 'data-multiple', this.multiple);
    setAttribute(this, 'role', this._ariaRoleOnHost ? 'listbox' : null);
    setAttribute(this, 'dir', getDocumentWritingMode());
    this._ariaRoleOnHost && assignId(() => this._overlayId)(this);

    return html`
      <!-- This element is visually hidden and will be appended to the light DOM to allow screen
      readers to work properly -->
      <div
        class="sbb-screen-reader-only sbb-select-invisible-trigger"
        tabindex=${this.disabled ? nothing : '0'}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-required=${this.required.toString()}
        aria-controls=${this._overlayId}
        aria-owns=${this._overlayId}
        ${ref((ref) => (this._triggerElement = ref as HTMLElement))}
        @keydown=${this._onKeyDown}
        @click=${this._toggleOpening}
      >
        ${this._displayValue ? html`${this._displayValue}` : html`<span>${this.placeholder}</span>`}
      </div>

      <!-- Visually display the value -->
      <div class="sbb-select__trigger" aria-hidden="true">
        ${this._displayValue
          ? html`${this._displayValue}`
          : html`<span class="sbb-select__trigger--placeholder">${this.placeholder}</span>`}
      </div>

      <div class="sbb-select__gap-fix"></div>
      <div class="sbb-select__container">
        <div class="sbb-select__gap-fix">${overlayGapFixCorners()}</div>
        <div
          @animationend=${this._onAnimationEnd}
          class="sbb-select__panel"
          ?data-open=${this._state === 'opened' || this._state === 'opening'}
          ${ref((dialogRef) => (this._overlay = dialogRef as HTMLElement))}
        >
          <div class="sbb-select__wrapper">
            <div
              id=${!this._ariaRoleOnHost ? this._overlayId : nothing}
              class="sbb-select__options"
              role=${!this._ariaRoleOnHost ? 'listbox' : nothing}
              ?aria-multiselectable=${this.multiple}
              ${ref((containerRef) => (this._optionContainer = containerRef as HTMLElement))}
            >
              <slot @slotchange=${this._setValueFromSelectedOption}></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-select': SbbSelect;
  }
}
