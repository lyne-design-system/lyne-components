import {
  Component,
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
import { FocusTrap, IS_FOCUSABLE_QUERY } from '../../global/helpers/focus';
import getDocumentLang from '../../global/helpers/get-document-lang';
import { isEventOnElement } from '../../global/helpers/position';
import { i18nCloseDialog } from '../../global/i18n';
import { AccessibilityProperties } from '../../global/interfaces/accessibility-properties';

/**
 * @slot unnamed - Use this to project any content inside the navigation.
 */

let nextId = 0;

@Component({
  shadow: true,
  styleUrl: 'sbb-navigation.scss',
  tag: 'sbb-navigation',
})
export class SbbNavigation implements AccessibilityProperties {
  /**
   * This id will be forwarded to the relevant inner element.
   */
  @Prop() public navigationId = `sbb-dialog-${++nextId}`;

  /**
   * The element that will trigger the navigation.
   * Accepts both a string (id of an element) or an HTML element.
   */
  @Prop() public trigger: string | HTMLElement;

  /**
   * This will be forwarded as aria-label to the relevant nested element.
   */
  @Prop() public accessibilityLabel: string | undefined;

  /**
   * This will be forwarded as aria-describedby to the relevant nested element.
   */
  @Prop() public accessibilityDescribedby: string | undefined;

  /**
   * This will be forwarded as aria-labelledby to the relevant nested element.
   */
  @Prop() public accessibilityLabelledby: string | undefined;

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
  @State() private _state: 'closed' | 'opening' | 'opened' | 'closing' = 'closed';

  /**
   * Whether a navigation section is displayed.
   */
  @State() private _hasNavigationSection = false;

  /**
   * Emits whenever the navigation starts the opening transition.
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
  private _navigationWrapperElement: HTMLElement;
  private _navigationContentElement: HTMLElement;
  private _triggerElement: HTMLElement;
  private _firstFocusable: HTMLElement;
  private _navigationController: AbortController;
  private _windowEventsController: AbortController;
  private _focusTrap = new FocusTrap();
  private _openedByKeyboard = false;
  private _currentLanguage = getDocumentLang();
  private _isPointerDownEventOnDialog: boolean;

  @Element() private _element: HTMLElement;

  /**
   * Opens the navigation on trigger click.
   */
  @Method()
  public async open(): Promise<void> {
    if (this._state === 'closing' || !this._navigation) {
      return;
    }

    this.willOpen.emit();
    this._state = 'opening';
    this._navigation.show();
  }

  /**
   * Closes the navigation.
   */
  @Method()
  public async close(): Promise<void> {
    if (this._state === 'opening') {
      return;
    }

    this.willClose.emit();
    this._state = 'closing';
    this._openedByKeyboard = false;
  }

  // Removes trigger click listener on trigger change.
  @Watch('trigger')
  public removeTriggerClickListener(
    newValue: string | HTMLElement,
    oldValue: string | HTMLElement
  ): void {
    if (newValue !== oldValue) {
      this._navigationController?.abort();
      this._windowEventsController?.abort();
      this._configure(this.trigger);
    }
  }

  // Check if the trigger is valid and attach click event listeners.
  private _configure(trigger: string | HTMLElement): void {
    if (!trigger) {
      return;
    }

    // Check whether it's a string or an HTMLElement
    if (typeof trigger === 'string') {
      this._triggerElement = document.getElementById(trigger);
      // TODO: Check if window can be avoided
    } else if (trigger instanceof window.Element) {
      this._triggerElement = trigger;
    }

    if (!this._triggerElement) {
      return;
    }

    this._navigationController = new AbortController();
    this._triggerElement.addEventListener('click', () => this.open(), {
      signal: this._navigationController.signal,
    });
    this._triggerElement.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        if (event.code === 'Enter' || event.code === 'Space') {
          this._openedByKeyboard = true;
        }
      },
      { signal: this._navigationController.signal }
    );
  }

  private _onAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'open') {
      this._state = 'opened';
      this.didOpen.emit();
      this._setDialogFocus();
      this._focusTrap.trap(this._element);
      this._attachWindowEvents();
    } else if (event.animationName === 'close') {
      this._state = 'closed';
      this._navigationContentElement.scrollTo(0, 0);
      this._navigation.close();
      this.didClose.emit();
      this._windowEventsController?.abort();
      this._focusTrap.disconnect();
    }
  }

  private _attachWindowEvents(): void {
    this._windowEventsController = new AbortController();
    window.addEventListener('keydown', (event: KeyboardEvent) => this._onKeydownEvent(event), {
      signal: this._windowEventsController.signal,
    });
  }

  // Close the navigation when a link is clicked.
  private _closeOnLinkElementClick(event: Event): void {
    const composedPathElements = event
      .composedPath()
      .filter((el) => el instanceof window.HTMLElement);
    if (composedPathElements.some((el) => (el as HTMLElement).nodeName === 'A')) {
      this.close();
    }
  }

  // Closes the navigation on "Esc" key pressed.
  private _onKeydownEvent(event: KeyboardEvent): void {
    if (this._state !== 'opened') {
      return;
    }

    if (event.key === 'Escape') {
      this.close();
      return;
    }
  }

  // Set focus on the first focusable element.
  private _setDialogFocus(): void {
    this._firstFocusable = this._element.shadowRoot.querySelector(
      IS_FOCUSABLE_QUERY
    ) as HTMLElement;

    if (this._openedByKeyboard) {
      this._firstFocusable.focus();
    } else {
      // Focusing sbb-navigation__wrapper in order to provide a consistent behavior in Safari where else
      // the focus-visible styles would be incorrectly applied
      this._navigationWrapperElement.tabIndex = 0;
      this._navigationWrapperElement.focus();

      this._navigationWrapperElement.addEventListener(
        'blur',
        () => this._navigationWrapperElement.removeAttribute('tabindex'),
        { once: true }
      );
    }
  }

  // Check if the pointerdown event target is triggered on the navigation.
  private _pointerDownListener = (event: PointerEvent): void => {
    this._isPointerDownEventOnDialog =
      isEventOnElement(this._navigation, event) ||
      isEventOnElement(
        this._element.querySelector('.sbb-navigation-section--opened')?.shadowRoot
          .firstElementChild as HTMLElement,
        event
      );
  };

  // Close navigation on backdrop click.
  private _closeOnBackdropClick = (event: PointerEvent): void => {
    if (!this._isPointerDownEventOnDialog && !isEventOnElement(this._navigation, event)) {
      this.close();
    }
  };

  // Close the navigation on click of any element that has the 'sbb-navigation-close' attribute.
  private _closeOnSbbNavigationCloseClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (target.hasAttribute('sbb-navigation-close') && !target.hasAttribute('disabled')) {
      this.close();
    }
  }

  @Listen('willOpen')
  public onNavigationSectionOpening(event: Event): void {
    if ((event.target as HTMLElement).nodeName === 'SBB-NAVIGATION-SECTION') {
      this._hasNavigationSection = true;
      event.stopImmediatePropagation();
    }
  }

  @Listen('willClose')
  public onNavigationSectionClosing(event: Event): void {
    if ((event.target as HTMLElement).nodeName === 'SBB-NAVIGATION-SECTION') {
      this._hasNavigationSection = false;
      event.stopImmediatePropagation();
    }
  }

  public connectedCallback(): void {
    // Validate trigger element and attach event listeners
    this._configure(this.trigger);

    // Close navigation on backdrop click
    this._element.addEventListener('pointerdown', this._pointerDownListener, {
      signal: this._navigationController.signal,
    });
    this._element.addEventListener('pointerup', this._closeOnBackdropClick, {
      signal: this._navigationController.signal,
    });
  }

  public disconnectedCallback(): void {
    this._navigationController?.abort();
    this._windowEventsController?.abort();
    this._focusTrap.disconnect();
  }

  public render(): JSX.Element {
    const closeButton = (
      <sbb-button
        class="sbb-navigation__close"
        accessibility-label={this.accessibilityCloseLabel || i18nCloseDialog[this._currentLanguage]}
        accessibility-controls={this.navigationId}
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
        class={{
          'sbb-navigation--opened': this._state === 'opened',
          'sbb-navigation--opening': this._state === 'opening',
          'sbb-navigation--closing': this._state === 'closing',
          'sbb-navigation--has-navigation-section': this._hasNavigationSection,
        }}
      >
        <dialog
          ref={(navigationRef) => (this._navigation = navigationRef)}
          id={this.navigationId}
          aria-label={this.accessibilityLabel}
          onAnimationEnd={(event: AnimationEvent) => this._onAnimationEnd(event)}
          class="sbb-navigation"
        >
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div
            onClick={(event: Event) => this._closeOnSbbNavigationCloseClick(event)}
            ref={(navigationWrapperRef) => (this._navigationWrapperElement = navigationWrapperRef)}
            class="sbb-navigation__wrapper"
          >
            {closeButton}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            <div
              onClick={(event: Event) => this._closeOnLinkElementClick(event)}
              class="sbb-navigation__content"
              ref={(navigationContent) => (this._navigationContentElement = navigationContent)}
            >
              <slot />
            </div>
          </div>
        </dialog>
      </Host>
    );
  }
}
