import {
  type CSSResultGroup,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import { SbbConnectedAbortController } from '../controllers/index.js';
import { findReferencedElement, isBrowser, isSafari } from '../dom/index.js';
import type { EventEmitter } from '../eventing/index.js';
import type { SbbOpenedClosedState } from '../interfaces/index.js';
import { SbbHydrationMixin } from '../mixins/index.js';
import { SbbNegativeMixin } from '../mixins/negative-mixin.js';
import {
  isEventOnElement,
  overlayGapFixCorners,
  removeAriaComboBoxAttributes,
  setOverlayPosition,
} from '../overlay/index.js';

import style from './autocomplete-base-element.scss?lit&inline';
import type { SbbOptionBaseElement } from './option-base-element.js';

/**
 * On Safari, the aria role 'listbox' must be on the host element, or else VoiceOver won't work at all.
 * On the other hand, JAWS and NVDA need the role to be "closer" to the options, or else optgroups won't work.
 */
const ariaRoleOnHost = isSafari();

export abstract class SbbAutocompleteBaseElement extends SbbNegativeMixin(
  SbbHydrationMixin(LitElement),
) {
  public static override styles: CSSResultGroup = style;

  /**
   * The element where the autocomplete will attach; accepts both an element's id or an HTMLElement.
   * If not set, it will search for the first 'sbb-form-field' ancestor.
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

  /* The state of the autocomplete. */
  protected set state(state: SbbOpenedClosedState) {
    this.setAttribute('data-state', state);
  }
  protected get state(): SbbOpenedClosedState {
    return this.getAttribute('data-state') as SbbOpenedClosedState;
  }

  /** Emits whenever the `sbb-autocomplete` starts the opening transition. */
  protected abstract willOpen: EventEmitter;

  /** Emits whenever the `sbb-autocomplete` is opened. */
  protected abstract didOpen: EventEmitter;

  /** Emits whenever the `sbb-autocomplete` begins the closing transition. */
  protected abstract willClose: EventEmitter;

  /** Emits whenever the `sbb-autocomplete` is closed. */
  protected abstract didClose: EventEmitter;

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

  protected abstract overlayId: string;
  protected abort = new SbbConnectedAbortController(this);
  private _overlay!: HTMLElement;
  private _optionContainer!: HTMLElement;
  private _triggerEventsController!: AbortController;
  private _openPanelEventsController!: AbortController;
  private _didLoad = false;
  private _isPointerDownEventOnMenu: boolean = false;

  protected abstract get options(): SbbOptionBaseElement[];
  protected abstract syncNegative(): void;
  protected abstract setTriggerAttributes(element: HTMLInputElement): void;
  protected abstract setRoleOnInnerPanel(): string | typeof nothing;
  protected abstract openedPanelKeyboardInteraction(event: KeyboardEvent): void;
  protected abstract selectByKeyboard(event: KeyboardEvent): void;
  protected abstract setNextActiveOption(event: KeyboardEvent): void;
  protected abstract resetActiveElement(): void;
  /** When an option is selected, update the input value and close the autocomplete. */
  protected abstract onOptionSelected(event: CustomEvent): void;
  protected abstract onOptionClick(event: MouseEvent): void;

  /** Opens the autocomplete. */
  public open(): void {
    if (this.state !== 'closed' || !this._overlay || this.options.length === 0 || this._readonly) {
      return;
    }
    if (!this.willOpen.emit()) {
      return;
    }

    this.state = 'opening';
    this._setOverlayPosition();
  }

  /** Closes the autocomplete. */
  public close(): void {
    if (this.state !== 'opened') {
      return;
    }
    if (!this.willClose.emit()) {
      return;
    }

    this.state = 'closing';
    this._openPanelEventsController.abort();
  }

  public override connectedCallback(): void {
    super.connectedCallback();

    this.state ||= 'closed';
    const signal = this.abort.signal;
    const formField = this.closest('sbb-form-field') ?? this.closest('[data-form-field]');

    if (formField) {
      this.negative = formField.hasAttribute('negative');
    }

    if (this._didLoad) {
      this._componentSetup();
    }
    this.syncNegative();

    this.addEventListener('click', (e: MouseEvent) => this.onOptionClick(e), { signal });
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
      this.syncNegative();
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this._componentSetup();
    this._didLoad = true;
  }

  private _handleSlotchange(): void {
    this._highlightOptions(this.triggerElement?.value);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._triggerEventsController?.abort();
    this._openPanelEventsController?.abort();
  }

  /** The autocomplete should inherit 'readonly' state from the trigger. */
  private get _readonly(): boolean {
    return this.triggerElement?.hasAttribute('readonly') ?? false;
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
    this.setTriggerAttributes(triggerElem);

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
    if (event.animationName === 'open' && this.state === 'opening') {
      this._onOpenAnimationEnd();
    } else if (event.animationName === 'close' && this.state === 'closing') {
      this._onCloseAnimationEnd();
    }
  }

  private _onOpenAnimationEnd(): void {
    this.state = 'opened';
    this._attachOpenPanelEvents();
    this.triggerElement?.setAttribute('aria-expanded', 'true');
    this.didOpen.emit();
  }

  private _onCloseAnimationEnd(): void {
    this.state = 'closed';
    this.triggerElement?.setAttribute('aria-expanded', 'false');
    this.resetActiveElement();
    this._optionContainer.scrollTop = 0;
    this.didClose.emit();
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
      (event: KeyboardEvent) => this.openedPanelKeyboardInteraction(event),
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
    if (this.state !== 'closed') {
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

  /** Highlight the searched text on the options. */
  private _highlightOptions(searchTerm?: string): void {
    if (searchTerm === null || searchTerm === undefined) {
      return;
    }
    this.options.forEach((option) => option.highlight(searchTerm));
  }

  private _removeTriggerAttributes(element?: HTMLInputElement): void {
    removeAriaComboBoxAttributes(element);
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'data-state', this.state);

    return html`
      <div class="sbb-autocomplete__gap-fix"></div>
      <div class="sbb-autocomplete__container">
        <div class="sbb-autocomplete__gap-fix">${overlayGapFixCorners()}</div>
        <div
          @animationend=${this._onAnimationEnd}
          class="sbb-autocomplete__panel"
          ?data-open=${this.state === 'opened' || this.state === 'opening'}
          ${ref((overlayRef?: Element) => (this._overlay = overlayRef as HTMLElement))}
        >
          <div class="sbb-autocomplete__wrapper">
            <div
              class="sbb-autocomplete__options"
              role=${this.setRoleOnInnerPanel()}
              id=${!ariaRoleOnHost ? this.overlayId : nothing}
              ${ref((containerRef) => (this._optionContainer = containerRef as HTMLElement))}
            >
              <slot @slotchange=${this._handleSlotchange}></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
