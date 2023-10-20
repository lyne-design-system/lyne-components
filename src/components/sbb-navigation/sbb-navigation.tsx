import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  JSX,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';
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
  isSafari,
  toggleDatasetEntry,
} from '../../global/dom';
import {
  documentLanguage,
  HandlerRepository,
  languageChangeHandlerAspect,
} from '../../global/eventing';
import { i18nCloseNavigation } from '../../global/i18n';
import { AgnosticMutationObserver } from '../../global/observers';
import {
  removeAriaOverlayTriggerAttributes,
  setAriaOverlayTriggerAttributes,
  isEventOnElement,
  SbbOverlayState,
  applyInertMechanism,
  removeInertMechanism,
} from '../../global/overlay';

/** Configuration for the attribute to look at if a navigation section is displayed */
const navigationObserverConfig: MutationObserverInit = {
  subtree: true,
  attributeFilter: ['data-state'],
};

let nextId = 0;

/**
 * @slot unnamed - Use this to project any content inside the navigation.
 */

@Component({
  shadow: true,
  styleUrl: 'sbb-navigation.scss',
  tag: 'sbb-navigation',
})
export class SbbNavigation implements ComponentInterface {
  /**
   * The element that will trigger the navigation.
   * Accepts both a string (id of an element) or an HTML element.
   */
  @Prop() public trigger: string | HTMLElement;

  /**
   * This will be forwarded as aria-label to the dialog and is read as a title of the navigation.
   */
  @Prop() public accessibilityLabel: string | undefined;

  /**
   * This will be forwarded as aria-label to the close button element.
   */
  @Prop() public accessibilityCloseLabel: string | undefined;

  /**
   * Whether the animation is enabled.
   */
  @Prop({ reflect: true }) public disableAnimation = false;

  /**
   * The state of the navigation.
   */
  @State() private _state: SbbOverlayState = 'closed';

  /**
   * Whether a navigation section is displayed.
   */
  @State() private _activeNavigationSection: HTMLElement;

  @State() private _currentLanguage = documentLanguage();

  /**
   * Emits whenever the navigation begins the opening transition.
   */
  @Event({
    bubbles: true,
    composed: true,
  })
  public willOpen: EventEmitter<void>;

  /**
   * Emits whenever the navigation is opened.
   */
  @Event({
    bubbles: true,
    composed: true,
  })
  public didOpen: EventEmitter<void>;

  /**
   * Emits whenever the navigation begins the closing transition.
   */
  @Event({
    bubbles: true,
    composed: true,
  })
  public willClose: EventEmitter<void>;

  /**
   * Emits whenever the navigation is closed.
   */
  @Event({
    bubbles: true,
    composed: true,
  })
  public didClose: EventEmitter<void>;

  private _navigation: HTMLDialogElement;
  private _navigationContainerElement: HTMLElement;
  private _navigationContentElement: HTMLElement;
  private _triggerElement: HTMLElement;
  private _navigationController: AbortController;
  private _windowEventsController: AbortController;
  private _focusTrap = new FocusTrap();
  private _scrollHandler = new ScrollHandler();
  private _isPointerDownEventOnDialog: boolean;
  private _navigationObserver = new AgnosticMutationObserver((mutationsList: MutationRecord[]) =>
    this._onNavigationSectionChange(mutationsList),
  );
  private _navigationId = `sbb-navigation-${++nextId}`;

  @Element() private _element!: HTMLElement;

  private _handlerRepository = new HandlerRepository(
    this._element,
    languageChangeHandlerAspect((l) => (this._currentLanguage = l)),
  );

  /**
   * Opens the navigation.
   */
  @Method()
  public async open(): Promise<void> {
    if (this._state !== 'closed' || !this._navigation) {
      return;
    }

    this.willOpen.emit();
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
  @Method()
  public async close(): Promise<void> {
    if (this._state !== 'opened') {
      return;
    }

    this.willClose.emit();
    this._state = 'closing';
    this._triggerElement?.setAttribute('aria-expanded', 'false');
  }

  // Removes trigger click listener on trigger change.
  @Watch('trigger')
  public removeTriggerClickListener(
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
      this._element.id || this._navigationId,
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
      this.didOpen.emit();
      applyInertMechanism(this._element);
      this._focusTrap.trap(this._element, this._trapFocusFilter);
      this._attachWindowEvents();
    } else if (event.animationName === 'close' && this._state === 'closing') {
      this._state = 'closed';
      this._navigationContentElement.scrollTo(0, 0);
      setModalityOnNextFocus(this._triggerElement);
      removeInertMechanism();
      this._navigation.close();
      // To enable focusing other element than the trigger, we need to call focus() a second time.
      this._triggerElement?.focus();
      this.didClose.emit();
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

  @Listen('click')
  public async handleNavigationClose(event: Event): Promise<void> {
    const composedPathElements = event
      .composedPath()
      .filter((el) => el instanceof window.HTMLElement);
    if (composedPathElements.some((el) => this._isCloseElement(el as HTMLElement))) {
      await this.close();
    }
  }

  private _isCloseElement(element: HTMLElement): boolean {
    return (
      element.nodeName === 'A' ||
      (element.hasAttribute('sbb-navigation-close') && !isValidAttribute(element, 'disabled'))
    );
  }

  // Closes the navigation on "Esc" key pressed.
  private async _onKeydownEvent(event: KeyboardEvent): Promise<void> {
    if (this._state === 'opened' && event.key === 'Escape') {
      await this.close();
    }
  }

  // Set focus on the first focusable element.
  private _setNavigationFocus(): void {
    const firstFocusable = this._element.shadowRoot.querySelector(
      IS_FOCUSABLE_QUERY,
    ) as HTMLElement;

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
        this._element
          .querySelector('sbb-navigation-section[data-state="opened"]')
          ?.shadowRoot.querySelector('dialog') as HTMLElement,
        event,
      );
  };

  // Close navigation on backdrop click.
  private _closeOnBackdropClick = async (event: PointerEvent): Promise<void> => {
    if (!this._isPointerDownEventOnDialog && !isEventOnElement(this._navigation, event)) {
      await this.close();
    }
  };

  // Observe changes on navigation section data-state.
  private _onNavigationSectionChange(mutationsList: MutationRecord[]): void {
    for (const mutation of mutationsList) {
      if ((mutation.target as HTMLElement).nodeName === 'SBB-NAVIGATION-SECTION') {
        this._activeNavigationSection = this._element.querySelector(
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

  public connectedCallback(): void {
    this._handlerRepository.connect();
    // Validate trigger element and attach event listeners
    this._configure(this.trigger);
    this._navigationObserver.observe(this._element, navigationObserverConfig);

    // TODO: Remove if possible, related to https://bugs.chromium.org/p/chromium/issues/detail?id=1493323
    // For Safari we need to keep the solution which doesn't work in Chrome as it seems mutual exclusive.
    toggleDatasetEntry(this._element, 'isSafari', isSafari());

    if (this._state === 'opened') {
      applyInertMechanism(this._element);
    }
  }

  public disconnectedCallback(): void {
    this._handlerRepository.disconnect();
    this._navigationController?.abort();
    this._windowEventsController?.abort();
    this._focusTrap.disconnect();
    this._navigationObserver.disconnect();
    removeInertMechanism();
  }

  public render(): JSX.Element {
    const closeButton = (
      <sbb-button
        class="sbb-navigation__close"
        aria-label={this.accessibilityCloseLabel || i18nCloseNavigation[this._currentLanguage]}
        aria-controls="sbb-navigation-dialog-id"
        variant="transparent"
        negative={true}
        size="m"
        type="button"
        icon-name="cross-small"
        sbb-navigation-close
      ></sbb-button>
    );
    return (
      <Host
        role="navigation"
        data-has-navigation-section={!!this._activeNavigationSection}
        data-state={this._state}
        ref={assignId(() => this._navigationId)}
        onPointerUp={(event) => this._closeOnBackdropClick(event)}
        onPointerDown={(event) => this._pointerDownListener(event)}
      >
        <div
          class="sbb-navigation__container"
          ref={(el) => (this._navigationContainerElement = el)}
        >
          <dialog
            ref={(navigationRef) => (this._navigation = navigationRef)}
            id="sbb-navigation-dialog-id"
            aria-label={this.accessibilityLabel}
            onAnimationEnd={(event: AnimationEvent) => this._onAnimationEnd(event)}
            class="sbb-navigation"
            role="group"
          >
            <div class="sbb-navigation__header">{closeButton}</div>
            <div class="sbb-navigation__wrapper">
              <div
                class="sbb-navigation__content"
                ref={(el) => (this._navigationContentElement = el)}
              >
                <slot />
              </div>
            </div>
          </dialog>
          <slot name="navigation-section" />
        </div>
      </Host>
    );
  }
}
