import type { CSSResultGroup, TemplateResult, PropertyValues } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import { getNextElementIndex, assignId } from '../core/a11y';
import {
  hostAttributes,
  SbbDisabledMixin,
  SbbNegativeMixin,
  UpdateScheduler,
} from '../core/common-behaviors';
import {
  isSafari,
  isValidAttribute,
  getDocumentWritingMode,
  setAttribute,
  isNextjs,
} from '../core/dom';
import { ConnectedAbortController, EventEmitter } from '../core/eventing';
import type { SbbOverlayState } from '../core/overlay';
import { setOverlayPosition, isEventOnElement, overlayGapFixCorners } from '../core/overlay';
import type { SbbOptionElement, SbbOptGroupElement } from '../option';

import style from './select.scss?lit&inline';

let nextId = 0;

export interface SelectChange {
  type: 'value';
  value: string | string[];
}

/**
 * It displays a panel with selectable options.
 *
 * @slot - Use the unnamed slot to add options.
 * @event {CustomEvent<void>} didChange - Deprecated. used for React. Will probably be removed once React 19 is available.
 * @event {CustomEvent<void>} change - Notifies that the component's value has changed.
 * @event {CustomEvent<void>} input - Notifies that an option value has been selected.
 * @event {CustomEvent<void>} willOpen - Emits whenever the `sbb-select` starts the opening transition. Can be canceled.
 * @event {CustomEvent<void>} didOpen - Emits whenever the `sbb-select` is opened.
 * @event {CustomEvent<void>} willClose - Emits whenever the `sbb-select` begins the closing transition. Can be canceled.
 * @event {CustomEvent<void>} didClose - Emits whenever the `sbb-select` is closed.
 * @cssprop [--sbb-select-z-index=var(--sbb-overlay-z-index)] - To specify a custom stack order,
 * the `z-index` can be overridden by defining this CSS variable. The default `z-index` of the
 * component is set to `var(--sbb-overlay-z-index)` with a value of `1000`.
 */
@customElement('sbb-select')
@hostAttributes({
  dir: getDocumentWritingMode(),
})
export class SbbSelectElement extends UpdateScheduler(
  SbbDisabledMixin(SbbNegativeMixin(LitElement)),
) {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    didChange: 'didChange',
    change: 'change',
    input: 'input',
    stateChange: 'stateChange',
    willOpen: 'willOpen',
    didOpen: 'didOpen',
    willClose: 'willClose',
    didClose: 'didClose',
  } as const;

  /** The value of the select component. If `multiple` is true, it's an array. */
  @property() public value?: string | string[];

  /** The placeholder used if no value has been selected. */
  @property() public placeholder?: string;

  /** Whether the select allows for multiple selection. */
  @property({ type: Boolean }) public multiple = false;

  /** Whether the select is required. */
  @property({ reflect: true, type: Boolean }) public required = false;

  /** Whether the select is readonly. */
  @property({ type: Boolean }) public readonly = false;

  /** The state of the select. */
  @state() private _state: SbbOverlayState = 'closed';

  /** The value displayed by the component. */
  @state() private _displayValue: string | null = null;

  /**
   * @deprecated only used for React. Will probably be removed once React 19 is available.
   */
  private _didChange: EventEmitter = new EventEmitter(this, SbbSelectElement.events.didChange);

  /** Notifies that the component's value has changed. */
  private _change: EventEmitter = new EventEmitter(this, SbbSelectElement.events.change);

  /** Notifies that an option value has been selected. */
  private _input: EventEmitter = new EventEmitter(this, SbbSelectElement.events.input);

  /** @internal */
  private _stateChange: EventEmitter<SelectChange> = new EventEmitter(
    this,
    SbbSelectElement.events.stateChange,
    {
      composed: false,
    },
  );

  /** Emits whenever the `sbb-select` starts the opening transition. */
  private _willOpen: EventEmitter<void> = new EventEmitter(this, SbbSelectElement.events.willOpen);

  /** Emits whenever the `sbb-select` is opened. */
  private _didOpen: EventEmitter<void> = new EventEmitter(this, SbbSelectElement.events.didOpen);

  /** Emits whenever the `sbb-select` begins the closing transition. */
  private _willClose: EventEmitter<void> = new EventEmitter(
    this,
    SbbSelectElement.events.willClose,
  );

  /** Emits whenever the `sbb-select` is closed. */
  private _didClose: EventEmitter<void> = new EventEmitter(this, SbbSelectElement.events.didClose);

  private _overlay!: HTMLElement;
  private _optionContainer!: HTMLElement;
  private _originElement!: HTMLElement;
  private _triggerElement!: HTMLElement;
  private _openPanelEventsController!: AbortController;
  private _overlayId = `sbb-select-${++nextId}`;
  private _activeItemIndex = -1;
  private _searchTimeout?: ReturnType<typeof setTimeout>;
  private _searchString = '';
  private _didLoad = false;
  private _isPointerDownEventOnMenu: boolean = false;
  private _abort = new ConnectedAbortController(this);

  /**
   * On Safari, the aria role 'listbox' must be on the host element, or else VoiceOver won't work at all.
   * On the other hand, JAWS and NVDA need the role to be an "immediate parent" to the options, or else optgroups won't work.
   */
  private _ariaRoleOnHost = isSafari();

  /**
   * The 'combobox' input element
   * @internal
   */
  public get inputElement(): HTMLElement {
    return this._triggerElement;
  }

  /** Gets all the SbbOptionElement projected in the select. */
  private get _options(): SbbOptionElement[] {
    return Array.from(this.querySelectorAll?.('sbb-option') ?? []);
  }

  private get _filteredOptions(): SbbOptionElement[] {
    return this._options.filter(
      (opt: SbbOptionElement) => !opt.disabled && !isValidAttribute(opt, 'data-group-disabled'),
    );
  }

  /** Opens the selection panel. */
  public open(): void {
    if (this._state !== 'closed' || !this._overlay || this._options.length === 0) {
      return;
    }

    if (!this._willOpen.emit()) {
      return;
    }
    this._state = 'opening';
    this._setOverlayPosition();
  }

  /** Closes the selection panel. */
  public close(): void {
    if (this._state !== 'opened') {
      return;
    }

    if (!this._willClose.emit()) {
      return;
    }
    this._state = 'closing';
    this._openPanelEventsController.abort();
  }

  /** Gets the current displayed value. */
  public getDisplayValue(): string {
    return !this._displayValue ? '' : this._displayValue;
  }

  /** Listens to option changes. */
  private _onOptionChanged(event: Event): void {
    const target = event.target as SbbOptionElement;
    if (target.selected) {
      this._onOptionSelected(target);
    } else {
      this._onOptionDeselected(target);
    }
  }

  private _onOptionClick(event: MouseEvent): void {
    const target = event.target as SbbSelectElement | SbbOptionElement;
    if (target.tagName !== 'SBB-OPTION' || target.disabled) {
      return;
    }

    if (!this.multiple) {
      this.close();
    }
  }

  /** Sets the _displayValue by checking the internal sbb-options and setting the correct `selected` value on them. */
  private _onValueChanged(newValue: string | string[]): void {
    const options = this._filteredOptions;
    if (!Array.isArray(newValue)) {
      const optionElement = options.find((o) => (o.value ?? o.getAttribute('value')) === newValue);
      if (optionElement) {
        optionElement.selected = true;
      }
      options
        .filter((o) => (o.value ?? o.getAttribute('value')) !== newValue)
        .forEach((o) => (o.selected = false));
      this._displayValue = optionElement?.textContent || null;
    } else {
      options
        .filter((o) => !newValue.includes(o.value ?? o.getAttribute('value')))
        .forEach((e) => (e.selected = false));
      const selectedOptionElements = options.filter((o) =>
        newValue.includes(o.value ?? o.getAttribute('value')),
      );
      selectedOptionElements.forEach((o) => (o.selected = true));
      this._displayValue = selectedOptionElements.map((o) => o.textContent).join(', ') || null;
    }
    this._stateChange.emit({ type: 'value', value: newValue });
  }

  protected override firstUpdated(): void {
    // Override the default focus behavior
    this.focus = () => this._triggerElement.focus();
    this.blur = () => this._triggerElement.blur();

    // Wait for ssr hydration
    if (!isNextjs()) {
      this.startUpdate();
      this._setupSelect();
    }
  }

  /**
   * Removes element's first attribute whose qualified name is qualifiedName.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/removeAttribute)
   * @internal We need to override this due to a hydration issue with Next.js.
   */
  public override removeAttribute(qualifiedName: string): void {
    // In Next.js the hydration needs to finish before we can manipulate the light DOM.
    // @lit/react calls removeAttribute('defer-hydration') in a useLayoutEffect,
    // which is done after hydration is finished. Due to this we intercept this call
    // in overriding removeAttribute to finish initialization of the sbb-select.
    // https://github.com/lit/lit/blob/main/packages/react/src/create-component.ts#L293-L296
    // We also need to wait for update complete in order to be sure that the shadow DOM has been rendered.
    if (isNextjs() && qualifiedName === 'defer-hydration' && !this._didLoad) {
      this.updateComplete.then(() => this._setupSelect());
    }
    super.removeAttribute(qualifiedName);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    const formField = this.closest?.('sbb-form-field') ?? this.closest?.('[data-form-field]');

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

    this.addEventListener(
      'optionSelectionChange',
      (e: CustomEvent<void>) => this._onOptionChanged(e),
      { signal },
    );
    this.addEventListener(
      'click',
      (e: MouseEvent) => {
        this._onOptionClick(e);
        this._toggleOpening();
      },
      { signal },
    );
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('value')) {
      this._onValueChanged(this.value!);
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
    this.querySelectorAll?.('sbb-divider').forEach((element) => (element.negative = this.negative));

    this.querySelectorAll?.<SbbOptionElement | SbbOptGroupElement>(
      'sbb-option, sbb-optgroup',
    ).forEach((element: SbbOptionElement | SbbOptGroupElement) =>
      element.toggleAttribute('data-negative', this.negative),
    );
  }

  private _setupSelect(): void {
    this._setupOrigin();
    this._setupTrigger();
    this._didLoad = true;
    this.completeUpdate();
  }

  /** Sets the originElement; if the component is used in a sbb-form-field uses it, otherwise uses the parentElement. */
  private _setupOrigin(): void {
    const formField = this.closest?.('sbb-form-field');
    this._originElement =
      formField?.shadowRoot?.querySelector?.('#overlay-anchor') ?? this.parentElement!;
    if (this._originElement) {
      this.toggleAttribute(
        'data-option-panel-origin-borderless',
        !!formField?.hasAttribute?.('borderless'),
      );
    }
  }

  /**
   * To assess screen-readers problems caused by the interaction between aria patterns and shadow DOM,
   * we are forced to move the 'combobox' trigger element to the light DOM
   */
  private _setupTrigger(): void {
    // Move the trigger before the sbb-select
    this.parentElement!.insertBefore?.(this._triggerElement, this);

    // Set the invisible trigger element dimension to match the parent (needed for screen readers)
    const containerElement = this.closest?.('sbb-form-field') ?? this;
    this._triggerElement.style.top = '0px';
    this._triggerElement.style.height = `${containerElement.offsetHeight}px`;
    this._triggerElement.style.width = `${containerElement.offsetWidth}px`;
  }

  private _setOverlayPosition(): void {
    setOverlayPosition(
      this._overlay,
      this._originElement,
      this._optionContainer,
      this.shadowRoot!.querySelector('.sbb-select__container')!,
      this,
    );
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
  private _onOptionSelected(optionSelectionChange: SbbOptionElement): void {
    if (!this.multiple) {
      this._filteredOptions
        .filter((option) => option.id !== optionSelectionChange.id)
        .forEach((option) => (option.selected = false));
      this.value = optionSelectionChange.value;
    } else {
      if (!this.value) {
        this.value = [optionSelectionChange.value!];
      } else if (!this.value.includes(optionSelectionChange.value!)) {
        this.value = [...this.value, optionSelectionChange.value!];
      }
    }

    this._input.emit();
    this._change.emit();
    this._didChange.emit();
  }

  /** When an option is unselected in `multiple`, removes it from value and updates displayValue. */
  private _onOptionDeselected(optionSelectionChange: SbbOptionElement): void {
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

  private _checkForLetterSelection(event: KeyboardEvent): boolean {
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

  private async _setNextActiveOptionByText(event: KeyboardEvent): Promise<void> {
    // Set timeout and the string to search.
    if (typeof this._searchTimeout === typeof setTimeout) {
      clearTimeout(this._searchTimeout);
    }
    this._searchTimeout = setTimeout(() => (this._searchString = ''), 1000);
    this._searchString += event.key;

    // Reorder the _filteredOption array to have the last selected element at the bottom.
    const indexForSlice: number = this._activeItemIndex + 1;
    const filteredOptionsSorted: SbbOptionElement[] = [
      ...this._filteredOptions.slice(indexForSlice),
      ...this._filteredOptions.slice(0, indexForSlice),
    ];

    const match = filteredOptionsSorted.find(
      (option: SbbOptionElement) =>
        option.textContent?.toLowerCase().indexOf(this._searchString.toLowerCase()) === 0,
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
      const firstMatch = filteredOptionsSorted.find(
        (option: SbbOptionElement) =>
          option.textContent?.toLowerCase().indexOf(this._searchString[0].toLowerCase()) === 0,
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
    const activeOption: SbbOptionElement = this._filteredOptions[this._activeItemIndex];

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
    nextActiveOption: SbbOptionElement,
    lastActiveOption: SbbOptionElement | null = null,
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
    nextActiveOption: SbbOptionElement,
    lastActiveOption: SbbOptionElement,
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
        const value: string[] = [];
        for (const option of options) {
          value.push(option.value!);
        }
        this.value = value;
      }
    }
  }

  private _toggleOpening(): void {
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
    this._ariaRoleOnHost && assignId(() => this._overlayId)(this);

    return html`
      <!-- This element is visually hidden and will be appended to the light DOM to allow screen
      readers to work properly -->
      <div
        class="sbb-screen-reader-only"
        tabindex=${this.disabled ? nothing : '0'}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-required=${this.required.toString()}
        aria-controls=${this._overlayId}
        aria-owns=${this._overlayId}
        @keydown=${this._onKeyDown}
        @click=${this._toggleOpening}
        ${ref((ref) => (this._triggerElement = ref as HTMLElement))}
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
    'sbb-select': SbbSelectElement;
  }
}
