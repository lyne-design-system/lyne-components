import {
  isEventOnElement,
  overlayGapFixCorners,
  removeAriaComboBoxAttributes,
  SbbOverlayState,
  setAriaComboBoxAttributes,
  setOverlayPosition,
} from '../../global/overlay';
import {
  getDocumentWritingMode,
  findReferencedElement,
  isSafari,
  isValidAttribute,
  toggleDatasetEntry,
} from '../../global/dom';
import { assignId, getNextElementIndex } from '../../global/a11y';
import { CSSResult, html, LitElement, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { setAttribute } from '../../global/dom';
import { ref } from 'lit/directives/ref.js';
import { ConnectedAbortController, EventEmitter } from '../../global/eventing';
import { SbbOption } from '../sbb-option';
import Style from './sbb-autocomplete.scss?lit&inline';

let nextId = 0;

/**
 * @slot unnamed - Use this slot to project options.
 */
@customElement('sbb-autocomplete')
export class SbbAutocomplete extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    willOpen: 'will-open',
    didOpen: 'did-open',
    willClose: 'will-close',
    didClose: 'did-close',
  };

  /**
   * The element where the autocomplete will attach; accepts both an element's id or an HTMLElement.
   * If not set, will search for the first 'sbb-form-field' ancestor.
   */
  @property() public origin: string | HTMLElement;

  /**
   * The input element that will trigger the autocomplete opening; accepts both an element's id or an HTMLElement.
   * By default, the autocomplete will open on focus, click, input or `ArrowDown` keypress of the 'trigger' element.
   * If not set, will search for the first 'input' child of a 'sbb-form-field' ancestor.
   */
  @property() public trigger: string | HTMLInputElement;

  /** Whether the animation is disabled. */
  @property({ attribute: 'disable-animation', reflect: true, type: Boolean })
  public disableAnimation = false;

  /** Whether the icon space is preserved when no icon is set. */
  @property({ attribute: 'preserve-icon-space', reflect: true, type: Boolean })
  public preserveIconSpace: boolean;

  /** Negative coloring variant flag. */
  @property({ reflect: true, type: Boolean }) public negative = false;

  /** The state of the autocomplete. */
  @state() private _state: SbbOverlayState = 'closed';

  /** Emits whenever the autocomplete starts the opening transition. */
  private _willOpen: EventEmitter = new EventEmitter(this, SbbAutocomplete.events.willOpen);

  /** Emits whenever the autocomplete is opened. */
  private _didOpen: EventEmitter = new EventEmitter(this, SbbAutocomplete.events.didOpen);

  /** Emits whenever the autocomplete begins the closing transition. */
  private _willClose: EventEmitter = new EventEmitter(this, SbbAutocomplete.events.willClose);

  /** Emits whenever the autocomplete is closed. */
  private _didClose: EventEmitter = new EventEmitter(this, SbbAutocomplete.events.didClose);

  private _overlay: HTMLElement;
  private _optionContainer: HTMLElement;
  private _originElement: HTMLElement;
  private _triggerElement: HTMLInputElement;
  private _triggerEventsController: AbortController;
  private _openPanelEventsController: AbortController;
  private _overlayId = `sbb-autocomplete-${++nextId}`;
  private _activeItemIndex = -1;
  private _didLoad = false;
  private _isPointerDownEventOnMenu: boolean;
  private _abort = new ConnectedAbortController(this);

  /**
   * On Safari, the aria role 'listbox' must be on the host element, or else VoiceOver won't work at all.
   * On the other hand, JAWS and NVDA need the role to be "closer" to the options, or else optgroups won't work.
   */
  private _ariaRoleOnHost = isSafari();

  /** The autocomplete should inherit 'readonly' state from the trigger. */
  private get _readonly(): boolean {
    return this._triggerElement && isValidAttribute(this._triggerElement, 'readonly');
  }

  private get _options(): SbbOption[] {
    return Array.from(this.querySelectorAll('sbb-option'));
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

    this._state = 'opening';
    this._willOpen.emit();
    this._setOverlayPosition();
  }

  /** Closes the autocomplete. */
  public close(): void {
    if (this._state !== 'opened') {
      return;
    }

    this._state = 'closing';
    this._willClose.emit();
    this._openPanelEventsController.abort();
  }

  /** Removes trigger click listener on trigger change. */
  private _resetOriginClickListener(
    newValue: string | HTMLElement,
    oldValue: string | HTMLElement,
  ): void {
    if (newValue !== oldValue) {
      this._componentSetup();
    }
  }

  /** Removes trigger click listener on trigger change. */
  private _resetTriggerClickListener(
    newValue: string | HTMLElement,
    oldValue: string | HTMLElement,
  ): void {
    if (newValue !== oldValue) {
      this._componentSetup();
    }
  }

  /** When an option is selected, update the input value and close the autocomplete. */
  private _onOptionSelected(event: CustomEvent): void {
    const target = event.target as SbbOption;
    if (!target.selected) {
      return;
    }

    // Deselect the previous options
    this._options
      .filter((option) => option.id !== target.id && option.selected)
      .forEach((option) => (option.selected = false));

    // Set the option value
    this._triggerElement.value = target.value;

    // Manually trigger the change events
    this._triggerElement.dispatchEvent(new window.Event('change', { bubbles: true }));
    this._triggerElement.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));

    this.close();
  }

  private _onOptionClick(event): void {
    if (event.target?.tagName !== 'SBB-OPTION' || event.target.disabled) {
      return;
    }
    this.close();
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    const formField = this.closest('sbb-form-field') ?? this.closest('[data-form-field]');

    if (formField) {
      this.negative = isValidAttribute(formField, 'negative');
    }

    if (this._didLoad) {
      this._componentSetup();
    }
    this._syncNegative();

    this.addEventListener(
      'option-selection-change',
      (e: CustomEvent) => this._onOptionSelected(e),
      { signal },
    );
    this.addEventListener('click', (e) => this._onOptionClick(e), { signal });
  }

  public override willUpdate(changedProperties: PropertyValues<this>): void {
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

  protected override firstUpdated(): void {
    this._componentSetup();
    this._didLoad = true;
  }

  private _syncNegative(): void {
    this.querySelectorAll('sbb-divider').forEach((element) =>
      setAttribute(element, 'negative', this.negative),
    );

    this.querySelectorAll('sbb-option, sbb-optgroup').forEach((element: HTMLElement) =>
      toggleDatasetEntry(element, 'negative', this.negative),
    );
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._triggerEventsController?.abort();
    this._openPanelEventsController?.abort();
  }

  private _componentSetup(): void {
    this._triggerEventsController?.abort();
    this._openPanelEventsController?.abort();

    this._attachTo(this._getOriginElement());
    this._bindTo(this._getTriggerElement());
  }

  /**
   * Retrieve the element where the autocomplete will be attached.
   * @returns 'origin' or the first 'sbb-form-field' ancestor.
   */
  private _getOriginElement(): HTMLElement {
    let result: HTMLElement;

    if (!this.origin) {
      result = this.closest('sbb-form-field')?.shadowRoot.querySelector('#overlay-anchor');
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
      return this.closest('sbb-form-field')?.querySelector('input') as HTMLInputElement;
    }

    const result = findReferencedElement<HTMLInputElement>(this.trigger);

    if (!result) {
      throw new Error(
        'Cannot find the trigger element. Please specify a valid element or read the "trigger" prop documentation',
      );
    }

    return result;
  }

  private _attachTo(anchorElem: HTMLElement): void {
    if (!anchorElem) {
      return;
    }

    this._originElement = anchorElem;

    toggleDatasetEntry(
      this,
      'optionPanelOriginBorderless',
      this.closest('sbb-form-field')?.hasAttribute('borderless'),
    );
  }

  private _bindTo(triggerElem: HTMLInputElement): void {
    if (!triggerElem) {
      return;
    }

    // Reset attributes to the old trigger and add them to the new one
    this._removeTriggerAttributes(this._triggerElement);
    this._setTriggerAttributes(triggerElem);

    this._triggerElement = triggerElem;

    this._setupTriggerEvents();
  }

  private _setupTriggerEvents(): void {
    this._triggerEventsController = new AbortController();

    // Open the overlay on focus, click, input and `ArrowDown` event
    this._triggerElement.addEventListener('focus', () => this.open(), {
      signal: this._triggerEventsController.signal,
    });
    this._triggerElement.addEventListener('click', () => this.open(), {
      signal: this._triggerEventsController.signal,
    });
    this._triggerElement.addEventListener(
      'input',
      (event) => {
        this.open();
        this._highlightOptions((event.target as HTMLInputElement).value);
      },
      { signal: this._triggerEventsController.signal },
    );
    this._triggerElement.addEventListener(
      'keydown',
      (event: KeyboardEvent) => this._closedPanelKeyboardInteraction(event),
      { signal: this._triggerEventsController.signal },
    );
  }

  // Set overlay position, width and max height
  private _setOverlayPosition(): void {
    setOverlayPosition(this._overlay, this._originElement, this._optionContainer, this);
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
    this._triggerElement?.setAttribute('aria-expanded', 'true');
    this._didOpen.emit();
  }

  private _onCloseAnimationEnd(): void {
    this._state = 'closed';
    this._triggerElement?.setAttribute('aria-expanded', 'false');
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
    this._triggerElement.addEventListener(
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
      !isEventOnElement(this._originElement, event)
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
        this._selectByKeyboard();
        break;

      case 'ArrowDown':
      case 'ArrowUp':
        this._setNextActiveOption(event);
        break;
    }
  }

  private _selectByKeyboard(): void {
    const activeOption = this._options[this._activeItemIndex];

    if (activeOption) {
      activeOption.setSelectedViaUserInteraction(true);
    }
  }

  private _setNextActiveOption(event: KeyboardEvent): void {
    const filteredOptions = this._options.filter(
      (opt) => !isValidAttribute(opt, 'disabled') && !isValidAttribute(opt, 'data-group-disabled'),
    );

    // Get and activate the next active option
    const next = getNextElementIndex(event, this._activeItemIndex, filteredOptions.length);
    const nextActiveOption = filteredOptions[next];
    nextActiveOption.active = true;
    this._triggerElement.setAttribute('aria-activedescendant', nextActiveOption.id);
    nextActiveOption.scrollIntoView({ block: 'nearest' });

    // Reset the previous active option
    const lastActiveOption = filteredOptions[this._activeItemIndex];
    if (lastActiveOption) {
      lastActiveOption.active = false;
    }

    this._activeItemIndex = next;
  }

  private _resetActiveElement(): void {
    const activeElement = this._options[this._activeItemIndex];

    if (activeElement) {
      activeElement.active = false;
    }
    this._activeItemIndex = -1;
    this._triggerElement.removeAttribute('aria-activedescendant');
  }

  /** Highlight the searched text on the options. */
  private _highlightOptions(searchTerm: string): void {
    this._options.forEach((option) => option.highlight(searchTerm));
  }

  private _setTriggerAttributes(element: HTMLInputElement): void {
    setAriaComboBoxAttributes(element, this.id || this._overlayId, false);
  }

  private _removeTriggerAttributes(element: HTMLInputElement): void {
    removeAriaComboBoxAttributes(element);
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'data-state', this._state);
    setAttribute(this, 'role', this._ariaRoleOnHost ? 'listbox' : null);
    setAttribute(this, 'dir', getDocumentWritingMode());
    this._ariaRoleOnHost && assignId(() => this._overlayId)(this);

    return html`
      <div class="sbb-autocomplete__gap-fix"></div>
      <div class="sbb-autocomplete__container">
        <div class="sbb-autocomplete__gap-fix">${overlayGapFixCorners()}</div>
        <div
          @animationend=${this._onAnimationEnd}
          class="sbb-autocomplete__panel"
          ?data-open=${this._state === 'opened' || this._state === 'opening'}
          ${ref((overlayRef) => (this._overlay = overlayRef as HTMLElement))}
        >
          <div class="sbb-autocomplete__wrapper">
            <div
              class="sbb-autocomplete__options"
              ${ref((containerRef) => (this._optionContainer = containerRef as HTMLElement))}
              role=${!this._ariaRoleOnHost ? 'listbox' : nothing}
              id=${!this._ariaRoleOnHost ? this._overlayId : nothing}
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
    'sbb-autocomplete': SbbAutocomplete;
  }
}
