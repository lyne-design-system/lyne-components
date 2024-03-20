import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';

import { FocusHandler, getFirstFocusableElement, setModalityOnNextFocus } from '../core/a11y';
import { LanguageController, SbbNegativeMixin } from '../core/common-behaviors';
import { ScrollHandler, isValidAttribute, hostContext } from '../core/dom';
import { EventEmitter } from '../core/eventing';
import { i18nCloseDialog, i18nDialog, i18nGoBack } from '../core/i18n';
import type { SbbOverlayState } from '../core/overlay';
import { applyInertMechanism, removeInertMechanism } from '../core/overlay';

import style from './overlay.scss?lit&inline';

// A global collection of existing overlays
const overlayRefs: SbbOverlayElement[] = [];
let nextId = 0;

export type SbbOverlayCloseEventDetails = {
  returnValue?: any;
  closeTarget?: HTMLElement;
};

/**
 * It displays an interactive overlay element.
 *
 * @slot - Use the unnamed slot to provide a content for the overlay.
 * @event {CustomEvent<void>} willOpen - Emits whenever the `sbb-overlay` starts the opening transition. Can be canceled.
 * @event {CustomEvent<void>} didOpen - Emits whenever the `sbb-overlay` is opened.
 * @event {CustomEvent<void>} willClose - Emits whenever the `sbb-overlay` begins the closing transition. Can be canceled.
 * @event {CustomEvent<SbbOverlayCloseEventDetails>} didClose - Emits whenever the `sbb-overlay` is closed.
 * @event {CustomEvent<void>} requestBackAction - Emits whenever the back button is clicked.
 * @cssprop [--sbb-overlay-z-index=var(--sbb-overlay-z-index)] - To specify a custom stack order,
 * the `z-index` can be overridden by defining this CSS variable. The default `z-index` of the
 * component is set to `var(--sbb-overlay-z-index)` with a value of `1000`.
 */
@customElement('sbb-overlay')
export class SbbOverlayElement extends SbbNegativeMixin(LitElement) {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    willOpen: 'willOpen',
    didOpen: 'didOpen',
    willClose: 'willClose',
    didClose: 'didClose',
    backClick: 'requestBackAction',
  } as const;

  /**
   * Whether to allow the overlay content to stretch to full width.
   * By default, the content has the appropriate page size.
   */
  @property({ reflect: true, type: Boolean }) public expanded = false;

  /**
   * Whether a back button is displayed next to the title.
   */
  @property({ attribute: 'back-button', type: Boolean }) public backButton = false;

  /**
   * This will be forwarded as aria-label to the close button element.
   */
  @property({ attribute: 'accessibility-close-label' }) public accessibilityCloseLabel:
    | string
    | undefined;

  /**
   * This will be forwarded as aria-label to the back button element.
   */
  @property({ attribute: 'accessibility-back-label' }) public accessibilityBackLabel:
    | string
    | undefined;

  /**
   * This will be forwarded as aria-label adn will describe the purpose of the dialog.
   */
  @property({ attribute: 'accessibility-label' }) public accessibilityLabel: string | undefined;

  /**
   * Whether the animation is enabled.
   */
  @property({ attribute: 'disable-animation', reflect: true, type: Boolean })
  public disableAnimation = false;

  /*
   * The state of the overlay.
   */
  private set _state(state: SbbOverlayState) {
    this.dataset.state = state;
  }
  private get _state(): SbbOverlayState {
    return this.dataset?.state as SbbOverlayState;
  }

  private _ariaLiveRef!: HTMLElement;
  private _ariaLiveRefToggle = false;

  /** Emits whenever the `sbb-overlay` starts the opening transition. */
  private _willOpen: EventEmitter<void> = new EventEmitter(this, SbbOverlayElement.events.willOpen);

  /** Emits whenever the `sbb-overlay` is opened. */
  private _didOpen: EventEmitter<void> = new EventEmitter(this, SbbOverlayElement.events.didOpen);

  /** Emits whenever the `sbb-overlay` begins the closing transition. */
  private _willClose: EventEmitter = new EventEmitter(this, SbbOverlayElement.events.willClose);

  /** Emits whenever the `sbb-overlay` is closed. */
  private _didClose: EventEmitter<SbbOverlayCloseEventDetails> = new EventEmitter(
    this,
    SbbOverlayElement.events.didClose,
  );

  /** Emits whenever the back button is clicked. */
  private _backClick: EventEmitter<any> = new EventEmitter(
    this,
    SbbOverlayElement.events.backClick,
  );

  private _overlayContentElement: HTMLElement | null = null;
  private _overlayCloseElement?: HTMLElement;
  private _overlayController!: AbortController;
  private _openOverlayController!: AbortController;
  private _focusHandler = new FocusHandler();
  private _scrollHandler = new ScrollHandler();
  private _returnValue: any;
  private _overlayId = `sbb-overlay-${nextId++}`;

  // Last element which had focus before the overlay was opened.
  private _lastFocusedElement?: HTMLElement;

  private _language = new LanguageController(this);

  /**
   * Opens the overlay element.
   */
  public open(): void {
    if (this._state !== 'closed') {
      return;
    }
    this._lastFocusedElement = document.activeElement as HTMLElement;

    this._overlayContentElement = this.shadowRoot?.querySelector(
      '.sbb-overlay__content',
    ) as HTMLElement;

    if (!this._willOpen.emit()) {
      return;
    }
    this._state = 'opening';

    // Add this overlay to the global collection
    overlayRefs.push(this as SbbOverlayElement);

    // Disable scrolling for content below the overlay
    this._scrollHandler.disableScroll();
  }

  /**
   * Closes the overlay element.
   */
  public close(result?: any, target?: HTMLElement): any {
    if (this._state !== 'opened') {
      return;
    }

    this._returnValue = result;
    this._overlayCloseElement = target;
    const eventData = {
      returnValue: this._returnValue,
      closeTarget: this._overlayCloseElement,
    };

    if (!this._willClose.emit(eventData)) {
      return;
    }
    this._state = 'closing';
    this._removeAriaLiveRefContent();
  }

  // Closes the overlay on "Esc" key pressed.
  private _onKeydownEvent(event: KeyboardEvent): void {
    if (this._state !== 'opened') {
      return;
    }

    if (event.key === 'Escape') {
      overlayRefs[overlayRefs.length - 1].close();
      return;
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._state = this._state || 'closed';
    this._overlayController?.abort();
    this._overlayController = new AbortController();

    if (this._state === 'opened') {
      applyInertMechanism(this);
    }
  }

  protected override firstUpdated(): void {
    this._ariaLiveRef = this.shadowRoot!.querySelector('sbb-screenreader-only')!;
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._overlayController?.abort();
    this._openOverlayController?.abort();
    this._focusHandler.disconnect();
    this._removeInstanceFromGlobalCollection();
    removeInertMechanism();
  }

  private _removeInstanceFromGlobalCollection(): void {
    overlayRefs.splice(overlayRefs.indexOf(this as SbbOverlayElement), 1);
  }

  private _attachOpenOverlayEvents(): void {
    this._openOverlayController = new AbortController();
    // Remove overlay label as soon as it is not needed anymore to prevent accessing it with browse mode.
    window.addEventListener(
      'keydown',
      async (event: KeyboardEvent) => {
        this._removeAriaLiveRefContent();
        await this._onKeydownEvent(event);
      },
      {
        signal: this._openOverlayController.signal,
      },
    );
    window.addEventListener('click', () => this._removeAriaLiveRefContent(), {
      signal: this._openOverlayController.signal,
    });
  }

  // Close the overlay on click of any element that has the 'sbb-overlay-close' attribute.
  private _closeOnSbbOverlayCloseClick(event: Event): void {
    const overlayCloseElement = event
      .composedPath()
      .filter((e): e is HTMLElement => e instanceof window.HTMLElement)
      .find(
        (target) =>
          target.hasAttribute('sbb-overlay-close') && !isValidAttribute(target, 'disabled'),
      );

    if (!overlayCloseElement) {
      return;
    }

    // Check if the target is a submission element within a form and return the form, if present
    const closestForm =
      overlayCloseElement.getAttribute('type') === 'submit'
        ? (hostContext('form', overlayCloseElement) as HTMLFormElement)
        : undefined;
    overlayRefs[overlayRefs.length - 1].close(closestForm, overlayCloseElement);
  }

  // Wait for overlay transition to complete.
  // In rare cases it can be that the animationEnd event is triggered twice.
  // To avoid entering a corrupt state, exit when state is not expected.
  private _onOverlayAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'open' && this._state === 'opening') {
      this._state = 'opened';
      this._didOpen.emit();
      applyInertMechanism(this);
      this._attachOpenOverlayEvents();
      this._setOverlayFocus();
      // Use timeout to read label after focused element
      setTimeout(() => this._setAriaLiveRefContent());
      this._focusHandler.trap(this);
    } else if (event.animationName === 'close' && this._state === 'closing') {
      this._overlayContentElement?.scrollTo(0, 0);
      this._state = 'closed';
      removeInertMechanism();
      setModalityOnNextFocus(this._lastFocusedElement);
      // Manually focus last focused element
      this._lastFocusedElement?.focus();
      this._openOverlayController?.abort();
      this._focusHandler.disconnect();
      this._removeInstanceFromGlobalCollection();
      // Enable scrolling for content below the overlay if no overlay is open
      !overlayRefs.length && this._scrollHandler.enableScroll();
      this._didClose.emit({
        returnValue: this._returnValue,
        closeTarget: this._overlayCloseElement,
      });
    }
  }

  private _setAriaLiveRefContent(): void {
    this._ariaLiveRefToggle = !this._ariaLiveRefToggle;

    // If the text content remains the same, on VoiceOver the aria-live region is not announced a second time.
    // In order to support reading on every opening, we toggle an invisible space.
    this._ariaLiveRef.textContent = `${i18nDialog[this._language.current]}${
      this.accessibilityLabel ? `, ${this.accessibilityLabel}` : ''
    }${this._ariaLiveRefToggle ? ' ' : ''}`;
  }

  private _removeAriaLiveRefContent(): void {
    this._ariaLiveRef.textContent = '';
  }

  // Set focus on the first focusable element.
  private _setOverlayFocus(): void {
    const firstFocusable = getFirstFocusableElement(
      Array.from(this.shadowRoot!.children).filter(
        (e): e is HTMLElement => e instanceof window.HTMLElement,
      ),
    );
    setModalityOnNextFocus(firstFocusable);
    firstFocusable?.focus();
  }

  protected override render(): TemplateResult {
    const TAG_NAME = this.negative ? 'sbb-transparent-button' : 'sbb-secondary-button';

    /* eslint-disable lit/binding-positions */
    const closeButton = html`
      <${unsafeStatic(TAG_NAME)}
        class="sbb-overlay__close"
        aria-label=${this.accessibilityCloseLabel || i18nCloseDialog[this._language.current]}
        ?negative=${this.negative}
        size="m"
        type="button"
        icon-name="cross-small"
        sbb-overlay-close
      ></${unsafeStatic(TAG_NAME)}>
    `;

    const backButton = html`
      <${unsafeStatic(TAG_NAME)}
        class="sbb-overlay__back"
        aria-label=${this.accessibilityBackLabel || i18nGoBack[this._language.current]}
        ?negative=${this.negative}
        size="m"
        type="button"
        icon-name="chevron-small-left-small"
        @click=${() => this._backClick.emit()}
      ></${unsafeStatic(TAG_NAME)}>
    `;
    /* eslint-enable lit/binding-positions */

    return html`
      <div class="sbb-overlay__container">
        <div
          @animationend=${(event: AnimationEvent) => this._onOverlayAnimationEnd(event)}
          class="sbb-overlay"
          id=${this._overlayId}
        >
          <div
            @click=${(event: Event) => this._closeOnSbbOverlayCloseClick(event)}
            class="sbb-overlay__wrapper"
          >
            <div class="sbb-overlay__header">
              ${this.backButton ? backButton : nothing} ${closeButton}
            </div>
            <div class="sbb-overlay__content">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
      <sbb-screenreader-only></sbb-screenreader-only>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-overlay': SbbOverlayElement;
  }
}
