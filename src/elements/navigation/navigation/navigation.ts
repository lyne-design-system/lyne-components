import type { CSSResultGroup, TemplateResult } from 'lit';
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import { SbbFocusHandler, setModalityOnNextFocus } from '../../core/a11y.js';
import { SbbOpenCloseBaseElement } from '../../core/base-elements.js';
import { SbbConnectedAbortController, SbbLanguageController } from '../../core/controllers.js';
import { hostAttributes } from '../../core/decorators.js';
import { findReferencedElement, SbbScrollHandler } from '../../core/dom.js';
import { i18nCloseNavigation } from '../../core/i18n.js';
import { SbbUpdateSchedulerMixin } from '../../core/mixins.js';
import { AgnosticMutationObserver, AgnosticResizeObserver } from '../../core/observers.js';
import {
  applyInertMechanism,
  isEventOnElement,
  removeAriaOverlayTriggerAttributes,
  removeInertMechanism,
  setAriaOverlayTriggerAttributes,
} from '../../core/overlay.js';
import type { SbbNavigationButtonElement } from '../navigation-button.js';
import type { SbbNavigationLinkElement } from '../navigation-link.js';

import style from './navigation.scss?lit&inline';

import '../../button/transparent-button.js';

/** Configuration for the attribute to look at if a navigation section is displayed */
const navigationObserverConfig: MutationObserverInit = {
  subtree: true,
  attributeFilter: ['data-state'],
};

let nextId = 0;
const DEBOUNCE_TIME = 150;

/**
 * It displays a navigation menu, wrapping one or more `sbb-navigation-*` components.
 *
 * @slot - Use the unnamed slot to add `sbb-navigation-button`/`sbb-navigation-link` elements into the sbb-navigation menu.
 * @event {CustomEvent<void>} willOpen - Emits whenever the `sbb-navigation` begins the opening transition. Can be canceled.
 * @event {CustomEvent<void>} didOpen - Emits whenever the `sbb-navigation` is opened.
 * @event {CustomEvent<void>} willClose - Emits whenever the `sbb-navigation` begins the closing transition. Can be canceled.
 * @event {CustomEvent<void>} didClose - Emits whenever the `sbb-navigation` is closed.
 * @cssprop [--sbb-navigation-z-index=var(--sbb-overlay-default-z-index)] - To specify a custom stack order,
 * the `z-index` can be overridden by defining this CSS variable. The default `z-index` of the
 * component is set to `var(--sbb-overlay-default-z-index)` with a value of `1000`.
 */
@customElement('sbb-navigation')
@hostAttributes({
  role: 'navigation',
})
export class SbbNavigationElement extends SbbUpdateSchedulerMixin(SbbOpenCloseBaseElement) {
  public static override styles: CSSResultGroup = style;

  /**
   * The element that will trigger the navigation.
   * Accepts both a string (id of an element) or an HTML element.
   */
  @property()
  public set trigger(value: string | HTMLElement | null) {
    const oldValue = this._trigger;
    this._trigger = value;
    this._removeTriggerClickListener(this._trigger, oldValue);
  }
  public get trigger(): string | HTMLElement | null {
    return this._trigger;
  }
  private _trigger: string | HTMLElement | null = null;

  /**
   * This will be forwarded as aria-label to the close button element.
   */
  @property({ attribute: 'accessibility-close-label' }) public accessibilityCloseLabel:
    | string
    | undefined;

  /**
   * Whether a navigation section is displayed.
   */
  @state() private _activeNavigationSection: HTMLElement | null = null;

  public get activeNavigationSection(): HTMLElement | null {
    return this._activeNavigationSection;
  }

  private _navigation!: HTMLDivElement;
  private _navigationContentElement!: HTMLElement;
  private _triggerElement: HTMLElement | null = null;
  private _navigationController!: AbortController;
  private _windowEventsController!: AbortController;
  private _abort = new SbbConnectedAbortController(this);
  private _language = new SbbLanguageController(this);
  private _focusHandler = new SbbFocusHandler();
  private _scrollHandler = new SbbScrollHandler();
  private _isPointerDownEventOnNavigation: boolean = false;
  private _resizeObserverTimeout: ReturnType<typeof setTimeout> | null = null;
  private _navigationObserver = new AgnosticMutationObserver((mutationsList: MutationRecord[]) =>
    this._onNavigationSectionChange(mutationsList),
  );
  private _navigationResizeObserver = new AgnosticResizeObserver(() => this._onNavigationResize());

  /**
   * Opens the navigation.
   */
  public open(): void {
    if (this.state !== 'closed' || !this._navigation) {
      return;
    }

    if (!this.willOpen.emit()) {
      return;
    }
    this.state = 'opening';
    this._checkActiveActions();
    this._checkActiveSection();
    this.startUpdate();

    // Disable scrolling for content below the navigation
    this._scrollHandler.disableScroll();
    this._triggerElement?.setAttribute('aria-expanded', 'true');
  }

  private _checkActiveSection(): void {
    const activeAction = this.querySelector(
      'sbb-navigation-button.sbb-active',
    ) as SbbNavigationButtonElement;
    activeAction?.connectedSection?.open();
  }

  private _checkActiveActions(): void {
    const activeActions = Array.from(
      this.querySelectorAll(':is(sbb-navigation-button, sbb-navigation-link).sbb-active'),
    ) as (SbbNavigationButtonElement | SbbNavigationLinkElement)[];
    activeActions?.forEach((action) => action.marker?.select(action));
  }

  /**
   * Closes the navigation.
   */
  public close(): void {
    if (this.state !== 'opened') {
      return;
    }

    if (!this.willClose.emit()) {
      return;
    }
    this.state = 'closing';
    this.startUpdate();
    this._triggerElement?.setAttribute('aria-expanded', 'false');
  }

  // Removes trigger click listener on trigger change.
  private _removeTriggerClickListener(
    newValue: string | HTMLElement | null,
    oldValue: string | HTMLElement | null,
  ): void {
    if (newValue !== oldValue) {
      this._navigationController?.abort();
      this._windowEventsController?.abort();
      this._configure(this.trigger);
    }
  }

  // Check if the trigger is valid and attach click event listeners.
  private _configure(trigger: string | HTMLElement | null): void {
    removeAriaOverlayTriggerAttributes(this._triggerElement);

    if (!trigger) {
      return;
    }

    this._triggerElement = findReferencedElement(trigger);

    if (!this._triggerElement) {
      return;
    }

    setAriaOverlayTriggerAttributes(this._triggerElement, 'menu', this.id, this.state);
    this._navigationController?.abort();
    this._navigationController = new AbortController();
    this._triggerElement.addEventListener('click', () => this.open(), {
      signal: this._navigationController.signal,
    });
  }

  private _trapFocusFilter = (el: HTMLElement): boolean => {
    return el.nodeName !== 'SBB-NAVIGATION-SECTION' || el.getAttribute('data-state') === 'opened';
  };

  // In rare cases it can be that the animationEnd event is triggered twice.
  // To avoid entering a corrupt state, exit when state is not expected.
  private _onAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'open' && this.state === 'opening') {
      this.state = 'opened';
      this.didOpen.emit();
      this._navigationResizeObserver.observe(this);
      applyInertMechanism(this);
      this._focusHandler.trap(this, { filter: this._trapFocusFilter });
      this._attachWindowEvents();
      this._setNavigationFocus();
    } else if (event.animationName === 'close' && this.state === 'closing') {
      this.state = 'closed';
      this._navigationContentElement.scrollTo(0, 0);
      setModalityOnNextFocus(this._triggerElement);
      removeInertMechanism();
      // To enable focusing other element than the trigger, we need to call focus() a second time.
      this._triggerElement?.focus();
      this.didClose.emit();
      this._navigationResizeObserver.unobserve(this);
      this._resetMarkers();
      this._windowEventsController?.abort();
      this._focusHandler.disconnect();

      // Enable scrolling for content below the navigation
      this._scrollHandler.enableScroll();
    }
    this.completeUpdate();
  }

  private _resetMarkers(): void {
    const activeActions = Array.from(
      this.querySelectorAll(
        ':is(sbb-navigation-button, sbb-navigation-link)[data-action-active]:not(.sbb-active)',
      ),
    ) as (SbbNavigationButtonElement | SbbNavigationLinkElement)[];
    activeActions?.forEach((action) => action.marker?.reset());
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
      (element.hasAttribute('sbb-navigation-close') && !element.hasAttribute('disabled'))
    );
  }

  // Closes the navigation on "Esc" key pressed.
  private _onKeydownEvent(event: KeyboardEvent): void {
    if (this.state === 'opened' && event.key === 'Escape') {
      this.close();
    }
  }

  // Set focus on the first focusable element.
  private _setNavigationFocus(): void {
    const closeButton = this.shadowRoot!.querySelector(
      '#sbb-navigation-close-button',
    ) as HTMLElement;
    setModalityOnNextFocus(closeButton);
    closeButton.focus();
  }

  // Check if the pointerdown event target is triggered on the navigation.
  private _pointerDownListener = (event: PointerEvent): void => {
    this._isPointerDownEventOnNavigation =
      isEventOnElement(this._navigation, event) ||
      isEventOnElement(
        this.querySelector(
          'sbb-navigation-section[data-state="opened"]',
        )?.shadowRoot?.querySelector('nav.sbb-navigation-section') as HTMLElement,
        event,
      );
  };

  // Close navigation on backdrop click.
  private _closeOnBackdropClick = (event: PointerEvent): void => {
    if (!this._isPointerDownEventOnNavigation && !isEventOnElement(this._navigation, event)) {
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
        this.toggleAttribute('data-has-navigation-section', !!this._activeNavigationSection);
      }
    }
  }

  private _onNavigationResize(): void {
    if (this.state !== 'opened') {
      return;
    }

    if (this._resizeObserverTimeout) {
      clearTimeout(this._resizeObserverTimeout);
    }

    this.toggleAttribute('data-resize-disable-animation', true);

    // Disable the animation when resizing the navigation to avoid strange height transition effects.
    this._resizeObserverTimeout = setTimeout(
      () => this.removeAttribute('data-resize-disable-animation'),
      DEBOUNCE_TIME,
    );
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this.id ||= `sbb-navigation-${nextId++}`;
    const signal = this._abort.signal;
    this.addEventListener('click', (e) => this._handleNavigationClose(e), { signal });
    // Validate trigger element and attach event listeners
    this._configure(this.trigger);
    this._navigationObserver.observe(this, navigationObserverConfig);
    this.addEventListener('pointerup', (event) => this._closeOnBackdropClick(event), { signal });
    this.addEventListener('pointerdown', (event) => this._pointerDownListener(event), { signal });

    if (this.state === 'opened') {
      applyInertMechanism(this);
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._navigationController?.abort();
    this._windowEventsController?.abort();
    this._focusHandler.disconnect();
    this._navigationObserver.disconnect();
    this._navigationResizeObserver.disconnect();
    removeInertMechanism();
  }

  protected override render(): TemplateResult {
    const closeButton = html`
      <sbb-transparent-button
        id="sbb-navigation-close-button"
        class="sbb-navigation__close"
        aria-label=${this.accessibilityCloseLabel || i18nCloseNavigation[this._language.current]}
        aria-controls="sbb-navigation-overlay"
        negative
        size="m"
        type="button"
        icon-name="cross-small"
        sbb-navigation-close
      ></sbb-transparent-button>
    `;

    return html`
      <div class="sbb-navigation__container">
        <div
          id="sbb-navigation-overlay"
          @animationend=${(event: AnimationEvent) => this._onAnimationEnd(event)}
          class="sbb-navigation"
          ${ref((navigationRef?: Element) => (this._navigation = navigationRef as HTMLDivElement))}
        >
          <div class="sbb-navigation__header">${closeButton}</div>
          <div class="sbb-navigation__wrapper">
            <div
              class="sbb-navigation__content"
              ${ref((el?: Element) => (this._navigationContentElement = el as HTMLElement))}
            >
              <slot></slot>
            </div>
          </div>
        </div>
        <slot name="navigation-section"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-navigation': SbbNavigationElement;
  }
}
