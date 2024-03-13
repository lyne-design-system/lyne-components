import type { CSSResultGroup, TemplateResult, PropertyValues } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import { assignId, getNextElementIndex } from '../../core/a11y';
import { hostAttributes, SbbNegativeMixin, SlotChildObserver } from '../../core/common-behaviors';
import {
  setAttribute,
  getDocumentWritingMode,
  findReferencedElement,
  isSafari,
  isValidAttribute,
  isBrowser,
} from '../../core/dom';
import { ConnectedAbortController, EventEmitter } from '../../core/eventing';
import type { SbbOverlayState } from '../../core/overlay';
import {
  isEventOnElement,
  overlayGapFixCorners,
  removeAriaComboBoxAttributes,
  setAriaComboBoxAttributes,
  setOverlayPosition,
} from '../../core/overlay';
import type { SbbOptionElement, SbbOptGroupElement } from '../../option';
import type { SbbAutocompleteGridButtonElement } from '../autocomplete-grid-button';
import { SbbAutocompleteGridOptionElement } from '../autocomplete-grid-option';
import type { SbbAutocompleteGridRowElement } from '../autocomplete-grid-row';

import style from './autocomplete-grid.scss?lit&inline';

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
@hostAttributes({
  dir: getDocumentWritingMode(),
})
@customElement('sbb-autocomplete-grid')
export class SbbAutocompleteGridElement extends SlotChildObserver(SbbNegativeMixin(LitElement)) {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    willOpen: 'willOpen',
    didOpen: 'didOpen',
    willClose: 'willClose',
    didClose: 'didClose',
  } as const;

  /**
   * The element where the autocomplete will attach; accepts both an element's id or an HTMLElement.
   * If not set, will search for the first 'sbb-form-field' ancestor.
   */
  @property() public origin?: string | HTMLElement;

  /**
   * The input element that will trigger the autocomplete opening; accepts both an element's id or an HTMLElement.
   * By default, the autocomplete will open on focus, click, input or `ArrowDown` keypress of the 'trigger' element.
   * If not set, will search for the first 'input' child of a 'sbb-form-field' ancestor.
   */
  @property() public trigger?: string | HTMLInputElement;

  /** Whether the animation is disabled. */
  @property({ attribute: 'disable-animation', reflect: true, type: Boolean })
  public disableAnimation = false;

  /** Whether the icon space is preserved when no icon is set. */
  @property({ attribute: 'preserve-icon-space', reflect: true, type: Boolean })
  public preserveIconSpace?: boolean;

  /** The state of the autocomplete. */
  @state() private _state: SbbOverlayState = 'closed';

  /** Emits whenever the `sbb-autocomplete` starts the opening transition. */
  private _willOpen: EventEmitter = new EventEmitter(
    this,
    SbbAutocompleteGridElement.events.willOpen,
  );

  /** Emits whenever the `sbb-autocomplete` is opened. */
  private _didOpen: EventEmitter = new EventEmitter(
    this,
    SbbAutocompleteGridElement.events.didOpen,
  );

  /** Emits whenever the `sbb-autocomplete` begins the closing transition. */
  private _willClose: EventEmitter = new EventEmitter(
    this,
    SbbAutocompleteGridElement.events.willClose,
  );

  /** Emits whenever the `sbb-autocomplete` is closed. */
  private _didClose: EventEmitter = new EventEmitter(
    this,
    SbbAutocompleteGridElement.events.didClose,
  );

  private _overlay!: HTMLElement;
  private _optionContainer!: HTMLElement;

  /** Returns the element where autocomplete overlay is attached to. */
  public get originElement(): HTMLElement {
    if (!this._originElement) {
      this._originElement = this._findOriginElement();
    }
    return this._originElement;
  }
  private _originElement?: HTMLElement;

  /** Returns the trigger element. */
  public get triggerElement(): HTMLInputElement | undefined {
    return this._triggerElement;
  }
  private _triggerElement: HTMLInputElement | undefined;

  private _triggerEventsController!: AbortController;
  private _openPanelEventsController!: AbortController;
  private _overlayId = `sbb-autocomplete-grid-${++nextId}`;
  private _activeItemIndex = -1;
  private _activeColumnIndex = 0;
  private _didLoad = false;
  private _isPointerDownEventOnMenu: boolean = false;
  private _abort = new ConnectedAbortController(this);

  /**
   * On Safari, the aria role 'listbox' must be on the host element, or else VoiceOver won't work at all.
   * On the other hand, JAWS and NVDA need the role to be "closer" to the options, or else optgroups won't work.
   */
  private _ariaRoleOnHost = isSafari();

  /** The autocomplete should inherit 'readonly' state from the trigger. */
  private get _readonly(): boolean {
    return !!this.triggerElement && isValidAttribute(this.triggerElement, 'readonly');
  }

  private get _options(): SbbAutocompleteGridOptionElement[] {
    return Array.from(this.querySelectorAll?.('sbb-autocomplete-grid-option') ?? []);
  }

  // fixme
  private get _row(): SbbAutocompleteGridRowElement[] {
    return Array.from(this.querySelectorAll?.('sbb-autocomplete-grid-row') ?? []);
  }

  /** Opens the autocomplete. */
  public open(): void {
    if (
      this._state !== 'closed' ||
      !this._overlay ||
      this._options.length === 0 ||
      this._readonly
    ) {
      return;
    }
    if (!this._willOpen.emit()) {
      return;
    }

    this._state = 'opening';
    this._setOverlayPosition();
  }

  /** Closes the autocomplete. */
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

  /** Removes trigger click listener on trigger change. */
  private _resetOriginClickListener(
    newValue?: string | HTMLElement,
    oldValue?: string | HTMLElement,
  ): void {
    if (newValue !== oldValue) {
      this._componentSetup();
    }
  }

  /** Removes trigger click listener on trigger change. */
  private _resetTriggerClickListener(
    newValue?: string | HTMLElement,
    oldValue?: string | HTMLElement,
  ): void {
    if (newValue !== oldValue) {
      this._componentSetup();
    }
  }

  /** When an option is selected, update the input value and close the autocomplete. */
  private _onOptionSelected(event: CustomEvent): void {
    const target = event.target as SbbAutocompleteGridOptionElement;
    if (!target.selected) {
      return;
    }

    // Deselect the previous options
    this._options
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

  private _onOptionClick(event: MouseEvent): void {
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
    const signal = this._abort.signal;
    const formField = this.closest?.('sbb-form-field') ?? this.closest?.('[data-form-field]');

    if (formField) {
      this.negative = isValidAttribute(formField, 'negative');
    }

    if (this._didLoad) {
      this._componentSetup();
    }
    this._syncNegative();

    this.addEventListener(
      'autocompleteOptionSelectionChange',
      (e: CustomEvent<void>) => this._onOptionSelected(e),
      { signal },
    );
    this.addEventListener('click', (e: MouseEvent) => this._onOptionClick(e), { signal });
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);
    if (changedProperties.has('origin')) {
      this._resetOriginClickListener(this.origin, changedProperties.get('origin'));
    }
    if (changedProperties.has('trigger')) {
      this._resetTriggerClickListener(this.trigger, changedProperties.get('trigger'));
    }
    if (changedProperties.has('negative')) {
      this._syncNegative();
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this._componentSetup();
    this._didLoad = true;
  }

  public override checkChildren(): void {
    this._highlightOptions(this.triggerElement?.value);
  }

  private _syncNegative(): void {
    this.querySelectorAll?.('sbb-divider').forEach((divider) => (divider.negative = this.negative));

    this.querySelectorAll?.<SbbAutocompleteGridOptionElement | SbbOptGroupElement>(
      'sbb-autocomplete-grid-option, sbb-autocomplete-grid-optgroup',
    ).forEach((element) => element.toggleAttribute('data-negative', this.negative));

    this.querySelectorAll?.<SbbAutocompleteGridButtonElement>(
      'sbb-autocomplete-grid-button',
    ).forEach((element) => (element.negative = this.negative));
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._triggerEventsController?.abort();
    this._openPanelEventsController?.abort();
  }

  private _componentSetup(): void {
    if (!isBrowser()) {
      return;
    }
    this._triggerEventsController?.abort();
    this._openPanelEventsController?.abort();

    this._originElement = undefined;
    this.toggleAttribute(
      'data-option-panel-origin-borderless',
      !!this.closest?.('sbb-form-field')?.hasAttribute('borderless'),
    );

    this._bindTo(this._getTriggerElement());
  }

  /**
   * Retrieve the element where the autocomplete will be attached.
   * @returns 'origin' or the first 'sbb-form-field' ancestor.
   */
  private _findOriginElement(): HTMLElement {
    let result: HTMLElement | undefined | null;

    if (!this.origin) {
      result = this.closest?.('sbb-form-field')?.shadowRoot?.querySelector?.('#overlay-anchor');
    } else {
      result = findReferencedElement(this.origin);
    }

    if (!result) {
      throw new Error(
        'Cannot find the origin element. Please specify a valid element or read the "origin" prop documentation',
      );
    }

    return result;
  }

  /**
   * Retrieve the element that will trigger the autocomplete opening.
   * @returns 'trigger' or the first 'input' inside the origin element.
   */
  private _getTriggerElement(): HTMLInputElement {
    if (!this.trigger) {
      return this.closest?.('sbb-form-field')?.querySelector('input') as HTMLInputElement;
    }

    const result = findReferencedElement<HTMLInputElement>(this.trigger);

    if (!result) {
      throw new Error(
        'Cannot find the trigger element. Please specify a valid element or read the "trigger" prop documentation',
      );
    }

    return result;
  }

  private _bindTo(triggerElem: HTMLInputElement): void {
    if (!triggerElem) {
      return;
    }

    // Reset attributes to the old trigger and add them to the new one
    this._removeTriggerAttributes(this.triggerElement);
    this._setTriggerAttributes(triggerElem);

    this._triggerElement = triggerElem;

    this._setupTriggerEvents();
  }

  private _setupTriggerEvents(): void {
    this._triggerEventsController = new AbortController();

    // Open the overlay on focus, click, input and `ArrowDown` event
    this.triggerElement?.addEventListener('focus', () => this.open(), {
      signal: this._triggerEventsController.signal,
    });
    this.triggerElement?.addEventListener('click', () => this.open(), {
      signal: this._triggerEventsController.signal,
    });
    this.triggerElement?.addEventListener(
      'input',
      (event) => {
        this.open();
        this._highlightOptions((event.target as HTMLInputElement).value);
      },
      { signal: this._triggerEventsController.signal },
    );
    this.triggerElement?.addEventListener(
      'keydown',
      (event: KeyboardEvent) => this._closedPanelKeyboardInteraction(event),
      { signal: this._triggerEventsController.signal },
    );
  }

  // Set overlay position, width and max height
  private _setOverlayPosition(): void {
    setOverlayPosition(
      this._overlay,
      this.originElement,
      this._optionContainer,
      this.shadowRoot!.querySelector('.sbb-autocomplete__container')!,
      this,
    );
  }

  /** On open/close animation end.
   *  In rare cases it can be that the animationEnd event is triggered twice.
   *  To avoid entering a corrupt state, exit when state is not expected.
   */
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
    this.triggerElement?.setAttribute('aria-expanded', 'true');
    this._didOpen.emit();
  }

  private _onCloseAnimationEnd(): void {
    this._state = 'closed';
    this.triggerElement?.setAttribute('aria-expanded', 'false');
    this._resetActiveElement();
    this._optionContainer.scrollTop = 0;
    this._didClose.emit();
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

    // Close autocomplete on backdrop click
    window.addEventListener('pointerdown', (ev) => this._pointerDownListener(ev), {
      signal: this._openPanelEventsController.signal,
    });
    window.addEventListener('pointerup', (ev) => this._closeOnBackdropClick(ev), {
      signal: this._openPanelEventsController.signal,
    });

    // Keyboard interactions
    this.triggerElement?.addEventListener(
      'keydown',
      (event: KeyboardEvent) => this._openedPanelKeyboardInteraction(event),
      {
        signal: this._openPanelEventsController.signal,
      },
    );
  }

  // Check if the pointerdown event target is triggered on the menu.
  private _pointerDownListener = (event: PointerEvent): void => {
    this._isPointerDownEventOnMenu = isEventOnElement(this._overlay, event);
  };

  // If the click is outside the autocomplete, closes the panel.
  private _closeOnBackdropClick = (event: PointerEvent): void => {
    if (
      !this._isPointerDownEventOnMenu &&
      !isEventOnElement(this._overlay, event) &&
      !isEventOnElement(this.originElement, event)
    ) {
      this.close();
    }
  };

  private _closedPanelKeyboardInteraction(event: KeyboardEvent): void {
    if (this._state !== 'closed') {
      return;
    }

    switch (event.key) {
      case 'Enter':
      case 'ArrowDown':
      case 'ArrowUp':
        this.open();
        break;
    }
  }

  private _openedPanelKeyboardInteraction(event: KeyboardEvent): void {
    if (this._state !== 'opened') {
      return;
    }

    switch (event.key) {
      case 'Escape':
      case 'Tab':
        this.close();
        break;

      case 'Enter':
        this._selectByKeyboard(event);
        break;

      // FIXME
      case 'ArrowDown':
      case 'ArrowUp':
        this._setNextActiveOption(event);
        break;

      // FIXME
      case 'ArrowRight':
      case 'ArrowLeft':
        this._setNextHorizontalActiveElement(event);
        break;
    }
  }

  // TODO
  private _selectByKeyboard(event: KeyboardEvent): void {
    if (this._activeColumnIndex !== 0) {
      (
        this._row[this._activeItemIndex].querySelectorAll(
          'sbb-autocomplete-grid-option, sbb-autocomplete-grid-button',
        )[this._activeColumnIndex] as SbbAutocompleteGridButtonElement
      ).dispatchClick(event);
    } else {
      const activeOption = this._options[this._activeItemIndex];
      if (activeOption) {
        activeOption.setSelectedViaUserInteraction(true);
      }
    }
  }

  private _setNextActiveOption(event: KeyboardEvent): void {
    const filteredOptions = this._options.filter(
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
    if (this._activeColumnIndex !== 0) {
      this._row[this._activeItemIndex]
        .querySelectorAll('sbb-autocomplete-grid-button')
        .forEach((e) => e.toggleAttribute('data-focus-visible', false));
    }

    this._activeItemIndex = next;
    this._activeColumnIndex = 0;
  }

  // FIXME
  private _setNextHorizontalActiveElement(event: KeyboardEvent): void {
    if (this._activeItemIndex < 0) {
      return;
    }

    const elementsInRow: NodeListOf<
      SbbAutocompleteGridOptionElement | SbbAutocompleteGridButtonElement
    > = this._row[this._activeItemIndex].querySelectorAll(
      'sbb-autocomplete-grid-option, sbb-autocomplete-grid-button',
    );
    const next: number = getNextElementIndex(event, this._activeColumnIndex, elementsInRow.length);
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

  // FIXME
  private _resetActiveElement(): void {
    const activeElement = this._options[this._activeItemIndex];

    if (activeElement) {
      activeElement.active = false;
    }
    if (this._activeColumnIndex !== 0) {
      this._row[this._activeItemIndex]
        .querySelectorAll('sbb-autocomplete-grid-button')
        .forEach((e) => e.toggleAttribute('data-focus-visible', false));
    }
    this._activeItemIndex = -1;
    this._activeColumnIndex = 0;
    this.triggerElement?.removeAttribute('aria-activedescendant');
  }

  /** Highlight the searched text on the options. */
  private _highlightOptions(searchTerm?: string): void {
    if (searchTerm === null || searchTerm === undefined) {
      return;
    }
    this._options.forEach((option) => option.highlight(searchTerm));
  }

  private _setTriggerAttributes(element: HTMLInputElement): void {
    setAriaComboBoxAttributes(element, this.id || this._overlayId, false, 'grid');
  }

  private _removeTriggerAttributes(element?: HTMLInputElement): void {
    removeAriaComboBoxAttributes(element);
  }

  // FIXME
  protected override render(): TemplateResult {
    setAttribute(this, 'data-state', this._state);
    setAttribute(this, 'role', this._ariaRoleOnHost ? 'grid' : null);
    this._ariaRoleOnHost && assignId(() => this._overlayId)(this);

    return html`
      <div class="sbb-autocomplete__gap-fix"></div>
      <div class="sbb-autocomplete__container">
        <div class="sbb-autocomplete__gap-fix">${overlayGapFixCorners()}</div>
        <div
          @animationend=${this._onAnimationEnd}
          class="sbb-autocomplete__panel"
          ?data-open=${this._state === 'opened' || this._state === 'opening'}
          ${ref((overlayRef?: Element) => (this._overlay = overlayRef as HTMLElement))}
        >
          <div class="sbb-autocomplete__wrapper">
            <div
              class="sbb-autocomplete__options"
              role=${!this._ariaRoleOnHost ? 'grid' : nothing}
              id=${!this._ariaRoleOnHost ? this._overlayId : nothing}
              ${ref((containerRef) => (this._optionContainer = containerRef as HTMLElement))}
            >
              <slot></slot>
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
    'sbb-autocomplete-grid': SbbAutocompleteGridElement;
  }
}
