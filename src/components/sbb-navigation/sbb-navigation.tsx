import { SbbOverlayState } from '../../global/overlay';
import {
  FocusTrap,
  IS_FOCUSABLE_QUERY,
  assignId,
  sbbInputModalityDetector,
  setModalityOnNextFocus,
} from '../../global/a11y';
import {
  ScrollHandler,
  isValidAttribute,
  isBreakpoint,
  findReferencedElement,
} from '../../global/dom';
import {
  documentLanguage,
  HandlerRepository,
  languageChangeHandlerAspect,
  EventEmitter,
  ConnectedAbortController,
} from '../../global/eventing';
import { i18nCloseNavigation } from '../../global/i18n';
import { AgnosticMutationObserver } from '../../global/observers';
import {
  removeAriaOverlayTriggerAttributes,
  setAriaOverlayTriggerAttributes,
  isEventOnElement,
} from '../../global/overlay';
import { CSSResult, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { setAttribute } from '../../global/dom';
import { ref } from 'lit/directives/ref.js';
import Style from './sbb-navigation.scss?lit&inline';

/** Configuration for the attribute to look at if a navigation section is displayed */
const navigationObserverConfig: MutationObserverInit = {
  subtree: true,
  attributeFilter: ['data-state'],
};

let nextId = 0;

/**
 * @slot unnamed - Use this to project any content inside the navigation.
 */
@customElement('sbb-navigation')
export class SbbNavigation extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    willOpen: 'will-open',
    didOpen: 'did-open',
    willClose: 'will-close',
    didClose: 'did-close',
  };

  /**
   * The element that will trigger the navigation.
   * Accepts both a string (id of an element) or an HTML element.
   */
  @property()
  public get trigger(): string | HTMLElement {
    return this._trigger;
  }
  public set trigger(value: string | HTMLElement) {
    const oldValue = this._trigger;
    this._trigger = value;
    this._removeTriggerClickListener(this._trigger, oldValue);
    this.requestUpdate('trigger', oldValue);
  }
  private _trigger: string | HTMLElement = null;

  /**
   * This will be forwarded as aria-label to the dialog and is read as a title of the navigation.
   */
  @property({ attribute: 'accessibility-label' }) public accessibilityLabel: string | undefined;

  /**
   * This will be forwarded as aria-label to the close button element.
   */
  @property({ attribute: 'accessibility-close-label' }) public accessibilityCloseLabel:
    | string
    | undefined;

  /**
   * Whether the animation is enabled.
   */
  @property({ attribute: 'disable-animation', reflect: true, type: Boolean })
  public disableAnimation = false;

  /**
   * The state of the navigation.
   */
  @state() private _state: SbbOverlayState = 'closed';

  /**
   * Whether a navigation section is displayed.
   */
  @state() private _activeNavigationSection: HTMLElement;

  @state() private _currentLanguage = documentLanguage();

  /**
   * Emits whenever the navigation begins the opening transition.
   */
  private _willOpen: EventEmitter<void> = new EventEmitter(this, SbbNavigation.events.willOpen);

  /**
   * Emits whenever the navigation is opened.
   */
  private _didOpen: EventEmitter<void> = new EventEmitter(this, SbbNavigation.events.didOpen);

  /**
   * Emits whenever the navigation begins the closing transition.
   */
  private _willClose: EventEmitter<void> = new EventEmitter(this, SbbNavigation.events.willClose);

  /**
   * Emits whenever the navigation is closed.
   */
  private _didClose: EventEmitter<void> = new EventEmitter(this, SbbNavigation.events.didClose);

  private _navigation: HTMLDialogElement;
  private _navigationContainerElement: HTMLElement;
  private _navigationContentElement: HTMLElement;
  private _triggerElement: HTMLElement;
  private _navigationController: AbortController;
  private _windowEventsController: AbortController;
  private _abort = new ConnectedAbortController(this);
  private _focusTrap = new FocusTrap();
  private _scrollHandler = new ScrollHandler();
  private _isPointerDownEventOnDialog: boolean;
  private _navigationObserver = new AgnosticMutationObserver((mutationsList: MutationRecord[]) =>
    this._onNavigationSectionChange(mutationsList),
  );
  private _navigationId = `sbb-navigation-${++nextId}`;

  private _handlerRepository = new HandlerRepository(
    this,
    languageChangeHandlerAspect((l) => (this._currentLanguage = l)),
  );

  /**
   * Opens the navigation.
   */
  public open(): void {
    if (this._state !== 'closed' || !this._navigation) {
      return;
    }

    this._willOpen.emit();
    this._state = 'opening';

    // Disable scrolling for content below the dialog
    this._scrollHandler.disableScroll();
    this._navigation.show();
    this._setNavigationFocus();
    this._triggerElement?.setAttribute('aria-expanded', 'true');
  }

  /**
   * Closes the navigation.
   */
  public close(): void {
    if (this._state !== 'opened') {
      return;
    }

    this._willClose.emit();
    this._state = 'closing';
    this._triggerElement?.setAttribute('aria-expanded', 'false');
  }

  // Removes trigger click listener on trigger change.
  private _removeTriggerClickListener(
    newValue: string | HTMLElement,
    oldValue: string | HTMLElement,
  ): void {
    if (newValue !== oldValue) {
      this._navigationController?.abort();
      this._windowEventsController?.abort();
      this._configure(this.trigger);
    }
  }

  // Check if the trigger is valid and attach click event listeners.
  private _configure(trigger: string | HTMLElement): void {
    removeAriaOverlayTriggerAttributes(this._triggerElement);

    if (!trigger) {
      return;
    }

    this._triggerElement = findReferencedElement(trigger);

    if (!this._triggerElement) {
      return;
    }

    setAriaOverlayTriggerAttributes(
      this._triggerElement,
      'menu',
      this.id || this._navigationId,
      this._state,
    );
    this._navigationController = new AbortController();
    this._triggerElement.addEventListener('click', () => this.open(), {
      signal: this._navigationController.signal,
    });
  }

  private _trapFocusFilter = (el: HTMLElement): boolean => {
    return el.nodeName === 'SBB-NAVIGATION-SECTION' && el.getAttribute('data-state') !== 'opened';
  };

  // In rare cases it can be that the animationEnd event is triggered twice.
  // To avoid entering a corrupt state, exit when state is not expected.
  private _onAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'open' && this._state === 'opening') {
      this._state = 'opened';
      this._didOpen.emit();
      this._focusTrap.trap(this, this._trapFocusFilter);
      this._attachWindowEvents();
    } else if (event.animationName === 'close' && this._state === 'closing') {
      this._state = 'closed';
      this._navigationContentElement.scrollTo(0, 0);
      setModalityOnNextFocus(this._triggerElement);
      this._navigation.close();
      // To enable focusing other element than the trigger, we need to call focus() a second time.
      this._triggerElement?.focus();
      this._didClose.emit();
      this._windowEventsController?.abort();
      this._focusTrap.disconnect();

      // Enable scrolling for content below the dialog
      this._scrollHandler.enableScroll();
    }
  }

  private _attachWindowEvents(): void {
    this._windowEventsController = new AbortController();
    window.addEventListener('keydown', (event: KeyboardEvent) => this._onKeydownEvent(event), {
      signal: this._windowEventsController.signal,
    });
  }

  private _handleNavigationClose(event: Event): void {
    const composedPathElements = event
      .composedPath()
      .filter((el) => el instanceof window.HTMLElement);
    if (composedPathElements.some((el) => this._isCloseElement(el as HTMLElement))) {
      this.close();
    }
  }

  private _isCloseElement(element: HTMLElement): boolean {
    return (
      element.nodeName === 'A' ||
      (element.hasAttribute('sbb-navigation-close') && !isValidAttribute(element, 'disabled'))
    );
  }

  // Closes the navigation on "Esc" key pressed.
  private _onKeydownEvent(event: KeyboardEvent): void {
    if (this._state === 'opened' && event.key === 'Escape') {
      this.close();
    }
  }

  // Set focus on the first focusable element.
  private _setNavigationFocus(): void {
    const firstFocusable = this.shadowRoot.querySelector(IS_FOCUSABLE_QUERY) as HTMLElement;

    if (sbbInputModalityDetector.mostRecentModality === 'keyboard') {
      firstFocusable.focus();
    } else {
      // Focusing sbb-navigation__wrapper in order to provide a consistent behavior in Safari where else
      // the focus-visible styles would be incorrectly applied
      this._navigationContainerElement.tabIndex = 0;
      this._navigationContainerElement.focus();

      this._navigationContainerElement.addEventListener(
        'blur',
        () => this._navigationContainerElement.removeAttribute('tabindex'),
        { once: true },
      );
    }
  }

  // Check if the pointerdown event target is triggered on the navigation.
  private _pointerDownListener = (event: PointerEvent): void => {
    this._isPointerDownEventOnDialog =
      isEventOnElement(this._navigation, event) ||
      isEventOnElement(
        this.querySelector('sbb-navigation-section[data-state="opened"]')?.shadowRoot.querySelector(
          'dialog',
        ) as HTMLElement,
        event,
      );
  };

  // Close navigation on backdrop click.
  private _closeOnBackdropClick = (event: PointerEvent): void => {
    if (!this._isPointerDownEventOnDialog && !isEventOnElement(this._navigation, event)) {
      this.close();
    }
  };

  // Observe changes on navigation section data-state.
  private _onNavigationSectionChange(mutationsList: MutationRecord[]): void {
    for (const mutation of mutationsList) {
      if ((mutation.target as HTMLElement).nodeName === 'SBB-NAVIGATION-SECTION') {
        this._activeNavigationSection = this.querySelector(
          'sbb-navigation-section[data-state="opening"], sbb-navigation-section[data-state="opened"]',
        );
        if (!isBreakpoint('zero', 'large')) {
          (
            this._activeNavigationSection?.querySelector(IS_FOCUSABLE_QUERY) as HTMLElement
          )?.focus();
        }
      }
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('click', (e) => this._handleNavigationClose(e), { signal });
    this._handlerRepository.connect();
    // Validate trigger element and attach event listeners
    this._configure(this.trigger);
    this._navigationObserver.observe(this, navigationObserverConfig);
    this.addEventListener('pointerup', (event) => this._closeOnBackdropClick(event), { signal });
    this.addEventListener('pointerdown', (event) => this._pointerDownListener(event), { signal });
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._handlerRepository.disconnect();
    this._navigationController?.abort();
    this._windowEventsController?.abort();
    this._focusTrap.disconnect();
    this._navigationObserver.disconnect();
  }

  protected override render(): TemplateResult {
    const closeButton = html`
      <sbb-button
        class="sbb-navigation__close"
        aria-label=${this.accessibilityCloseLabel || i18nCloseNavigation[this._currentLanguage]}
        aria-controls="sbb-navigation-dialog-id"
        variant="transparent"
        negative
        size="m"
        type="button"
        icon-name="cross-small"
        sbb-navigation-close
      ></sbb-button>
    `;

    setAttribute(this, 'role', 'navigation');
    setAttribute(this, 'data-has-navigation-section', !!this._activeNavigationSection);
    setAttribute(this, 'data-state', this._state);
    assignId(() => this._navigationId)(this);

    return html`
      <div
        class="sbb-navigation__container"
        ${ref((el) => (this._navigationContainerElement = el as HTMLElement))}
      >
        <dialog
          ${ref((navigationRef) => (this._navigation = navigationRef as HTMLDialogElement))}
          id="sbb-navigation-dialog-id"
          aria-label=${this.accessibilityLabel ?? nothing}
          @animationend=${(event: AnimationEvent) => this._onAnimationEnd(event)}
          class="sbb-navigation"
          role="group"
        >
          <div class="sbb-navigation__header">${closeButton}</div>
          <div class="sbb-navigation__wrapper">
            <div
              class="sbb-navigation__content"
              ${ref((el) => (this._navigationContentElement = el as HTMLElement))}
            >
              <slot></slot>
            </div>
          </div>
        </dialog>
        <slot name="navigation-section"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-navigation': SbbNavigation;
  }
}
