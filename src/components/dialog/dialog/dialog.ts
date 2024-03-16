import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

import { FocusHandler, getFirstFocusableElement, setModalityOnNextFocus } from '../../core/a11y';
import { LanguageController, SbbNegativeMixin } from '../../core/common-behaviors';
import { ScrollHandler, isValidAttribute, hostContext, isBreakpoint } from '../../core/dom';
import { EventEmitter } from '../../core/eventing';
import { i18nDialog } from '../../core/i18n';
import { AgnosticResizeObserver } from '../../core/observers';
import type { SbbOverlayState } from '../../core/overlay';
import { applyInertMechanism, removeInertMechanism } from '../../core/overlay';
import type { SbbDialogActionsElement } from '../dialog-actions';
import type { SbbDialogTitleElement } from '../dialog-title';

import style from './dialog.scss?lit&inline';

import '../button/secondary-button';
import '../button/transparent-button';
import '../screenreader-only';
import '../title';

// A global collection of existing dialogs
const dialogRefs: SbbDialogElement[] = [];
let nextId = 0;

/**
 * It displays an interactive overlay element.
 *
 * @slot title - Use this slot to provide a `sbb-dialog-title`.
 * @slot content - Use this slot to provide a `sbb-dialog-content`.
 * @slot actions - Use this slot to provide a `sbb-dialog-actions`.
 * @event {CustomEvent<void>} willOpen - Emits whenever the `sbb-dialog` starts the opening transition. Can be canceled.
 * @event {CustomEvent<void>} didOpen - Emits whenever the `sbb-dialog` is opened.
 * @event {CustomEvent<void>} willClose - Emits whenever the `sbb-dialog` begins the closing transition. Can be canceled.
 * @event {CustomEvent<void>} didClose - Emits whenever the `sbb-dialog` is closed.
 * @cssprop [--sbb-dialog-z-index=var(--sbb-overlay-z-index)] - To specify a custom stack order,
 * the `z-index` can be overridden by defining this CSS variable. The default `z-index` of the
 * component is set to `var(--sbb-overlay-z-index)` with a value of `1000`.
 */
@customElement('sbb-dialog')
export class SbbDialogElement extends SbbNegativeMixin(LitElement) {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    willOpen: 'willOpen',
    didOpen: 'didOpen',
    willClose: 'willClose',
    didClose: 'didClose',
  } as const;

  /**
   * Backdrop click action.
   */
  @property({ attribute: 'backdrop-action' }) public backdropAction: 'close' | 'none' = 'close';

  /**
   * This will be forwarded as aria-label to the relevant nested element.
   */
  @property({ attribute: 'accessibility-label' }) public accessibilityLabel: string | undefined;

  /**
   * Whether the animation is enabled.
   */
  @property({ attribute: 'disable-animation', reflect: true, type: Boolean })
  public disableAnimation = false;

  /*
   * The state of the dialog.
   */
  private set _state(state: SbbOverlayState) {
    this.dataset.state = state;
  }
  private get _state(): SbbOverlayState {
    return this.dataset?.state as SbbOverlayState;
  }

  // We use a timeout as a workaround to the "ResizeObserver loop completed with undelivered notifications" error.
  // For more details:
  // - https://github.com/WICG/resize-observer/issues/38#issuecomment-422126006
  // - https://github.com/juggle/resize-observer/issues/103#issuecomment-1711148285
  private _dialogContentResizeObserver = new AgnosticResizeObserver(() =>
    setTimeout(() => this._onContentResize()),
  );
  private _ariaLiveRef!: HTMLElement;
  private _ariaLiveRefToggle = false;

  /** Emits whenever the `sbb-dialog` starts the opening transition. */
  private _willOpen: EventEmitter<void> = new EventEmitter(this, SbbDialogElement.events.willOpen);

  /** Emits whenever the `sbb-dialog` is opened. */
  private _didOpen: EventEmitter<void> = new EventEmitter(this, SbbDialogElement.events.didOpen);

  /** Emits whenever the `sbb-dialog` begins the closing transition. */
  private _willClose: EventEmitter = new EventEmitter(this, SbbDialogElement.events.willClose);

  /** Emits whenever the `sbb-dialog` is closed. */
  private _didClose: EventEmitter = new EventEmitter(this, SbbDialogElement.events.didClose);

  private _dialogTitleElement: SbbDialogTitleElement | null = null;
  private _dialogTitleHeight?: number;
  private _dialogContentElement: HTMLElement | null = null;
  private _dialogActionsElement: SbbDialogActionsElement | null = null;
  private _dialogCloseElement?: HTMLElement;
  private _dialogController!: AbortController;
  private _openDialogController!: AbortController;
  private _focusHandler = new FocusHandler();
  private _scrollHandler = new ScrollHandler();
  private _returnValue: any;
  private _isPointerDownEventOnDialog: boolean = false;
  private _overflows: boolean = false;
  private _lastScroll = 0;
  private _dialogId = `sbb-dialog-${nextId++}`;

  // Last element which had focus before the dialog was opened.
  private _lastFocusedElement?: HTMLElement;

  private _language = new LanguageController(this);

  /**
   * Opens the dialog element.
   */
  public open(): void {
    if (this._state !== 'closed') {
      return;
    }
    this._lastFocusedElement = document.activeElement as HTMLElement;

    // Initialize dialog elements
    this._dialogTitleElement = this.querySelector('sbb-dialog-title');
    this._dialogContentElement = this.querySelector('sbb-dialog-content')?.shadowRoot!
      .firstElementChild as HTMLElement;
    this._dialogActionsElement = this.querySelector('sbb-dialog-actions');

    this._syncNegative();

    if (!this._willOpen.emit()) {
      return;
    }
    this._state = 'opening';

    // Add this dialog to the global collection
    dialogRefs.push(this as SbbDialogElement);
    this._dialogContentResizeObserver.observe(this._dialogContentElement);

    // Disable scrolling for content below the dialog
    this._scrollHandler.disableScroll();
  }

  /**
   * Closes the dialog element.
   */
  public close(result?: any, target?: HTMLElement): any {
    if (this._state !== 'opened') {
      return;
    }

    this._returnValue = result;
    this._dialogCloseElement = target;
    const eventData = {
      returnValue: this._returnValue,
      closeTarget: this._dialogCloseElement,
    };

    if (!this._willClose.emit(eventData)) {
      return;
    }
    this._state = 'closing';
    this._removeAriaLiveRefContent();
  }

  // Closes the dialog on "Esc" key pressed.
  private _onKeydownEvent(event: KeyboardEvent): void {
    if (this._state !== 'opened') {
      return;
    }

    if (event.key === 'Escape') {
      dialogRefs[dialogRefs.length - 1].close();
      return;
    }
  }

  private _onContentScroll(): void {
    if (!this._dialogContentElement) {
      return;
    }

    const hasVisibleHeader = this.dataset.hideHeader === undefined;

    // Check whether hiding the header would make the scrollbar disappear
    // and prevent the hiding animation if so.
    if (
      hasVisibleHeader &&
      this._dialogContentElement.clientHeight + this._dialogTitleHeight! >=
        this._dialogContentElement.scrollHeight
    ) {
      return;
    }

    const currentScroll = this._dialogContentElement.scrollTop;
    if (
      Math.round(currentScroll + this._dialogContentElement.clientHeight) >=
      this._dialogContentElement.scrollHeight
    ) {
      return;
    }
    // Check whether is scrolling down or up.
    if (currentScroll > 0 && this._lastScroll < currentScroll) {
      // Scrolling down
      this._setHideHeaderDataAttribute(true);
    } else {
      // Scrolling up
      this._setHideHeaderDataAttribute(false);
    }
    // `currentScroll` can be negative, e.g. on mobile; this is not allowed.
    this._lastScroll = currentScroll <= 0 ? 0 : currentScroll;
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._state = this._state || 'closed';
    this._dialogController?.abort();
    this._dialogController = new AbortController();

    // Close dialog on backdrop click
    this.addEventListener('pointerdown', this._pointerDownListener, {
      signal: this._dialogController.signal,
    });
    this.addEventListener('pointerup', this._closeOnBackdropClick, {
      signal: this._dialogController.signal,
    });

    if (this._state === 'opened') {
      applyInertMechanism(this);
    }
  }

  protected override firstUpdated(): void {
    this._ariaLiveRef = this.shadowRoot!.querySelector('sbb-screenreader-only')!;

    // Synchronize the negative state before the first opening to avoid a possible color flash if it is negative.
    this._dialogTitleElement = this.querySelector('sbb-dialog-title')!;
    this._syncNegative();
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('negative')) {
      this._syncNegative();
    }
  }

  private _syncNegative(): void {
    if (this._dialogTitleElement) {
      this._dialogTitleElement.negative = this.negative;
    }

    if (this._dialogActionsElement) {
      this._dialogActionsElement.toggleAttribute('data-negative', this.negative);
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._dialogController?.abort();
    this._openDialogController?.abort();
    this._focusHandler.disconnect();
    this._dialogContentResizeObserver.disconnect();
    this._removeInstanceFromGlobalCollection();
    removeInertMechanism();
  }

  private _removeInstanceFromGlobalCollection(): void {
    dialogRefs.splice(dialogRefs.indexOf(this as SbbDialogElement), 1);
  }

  private _attachOpenDialogEvents(): void {
    this._openDialogController = new AbortController();
    // Remove dialog label as soon as it is not needed anymore to prevent accessing it with browse mode.
    window.addEventListener(
      'keydown',
      async (event: KeyboardEvent) => {
        this._removeAriaLiveRefContent();
        await this._onKeydownEvent(event);
      },
      {
        signal: this._openDialogController.signal,
      },
    );
    window.addEventListener('click', () => this._removeAriaLiveRefContent(), {
      signal: this._openDialogController.signal,
    });
    // If the content overflows, show/hide the dialog header on scroll.
    this._dialogContentElement?.addEventListener('scroll', () => this._onContentScroll(), {
      passive: true,
      signal: this._openDialogController.signal,
    });
    window.addEventListener('resize', () => this._setHideHeaderDataAttribute(false), {
      signal: this._openDialogController.signal,
    });
  }

  // Check if the pointerdown event target is triggered on the dialog.
  private _pointerDownListener = (event: PointerEvent): void => {
    if (this.backdropAction !== 'close') {
      return;
    }

    this._isPointerDownEventOnDialog = event
      .composedPath()
      .filter((e): e is HTMLElement => e instanceof window.HTMLElement)
      .some((target) => target.id === this._dialogId);
  };

  // Close dialog on backdrop click.
  private _closeOnBackdropClick = (event: PointerEvent): void => {
    if (this.backdropAction !== 'close') {
      return;
    }

    if (
      !this._isPointerDownEventOnDialog &&
      !event
        .composedPath()
        .filter((e): e is HTMLElement => e instanceof window.HTMLElement)
        .some((target) => target.id === this._dialogId)
    ) {
      this.close();
    }
  };

  // Close the dialog on click of any element that has the 'sbb-dialog-close' attribute.
  private _closeOnSbbDialogCloseClick(event: Event): void {
    const dialogCloseElement = event
      .composedPath()
      .filter((e): e is HTMLElement => e instanceof window.HTMLElement)
      .find(
        (target) =>
          target.hasAttribute('sbb-dialog-close') && !isValidAttribute(target, 'disabled'),
      );

    if (!dialogCloseElement) {
      return;
    }

    // Check if the target is a submission element within a form and return the form, if present
    const closestForm =
      dialogCloseElement.getAttribute('type') === 'submit'
        ? (hostContext('form', dialogCloseElement) as HTMLFormElement)
        : undefined;
    dialogRefs[dialogRefs.length - 1].close(closestForm, dialogCloseElement);
  }

  // Wait for dialog transition to complete.
  // In rare cases it can be that the animationEnd event is triggered twice.
  // To avoid entering a corrupt state, exit when state is not expected.
  private _onDialogAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'open' && this._state === 'opening') {
      this._state = 'opened';
      this._didOpen.emit();
      applyInertMechanism(this);
      this._attachOpenDialogEvents();
      this._setDialogFocus();
      // Use timeout to read label after focused element
      setTimeout(() => this._setAriaLiveRefContent());
      this._focusHandler.trap(this);
    } else if (event.animationName === 'close' && this._state === 'closing') {
      this._setHideHeaderDataAttribute(false);
      this._dialogContentElement?.scrollTo(0, 0);
      this._state = 'closed';
      removeInertMechanism();
      setModalityOnNextFocus(this._lastFocusedElement);
      // Manually focus last focused element
      this._lastFocusedElement?.focus();
      this._didClose.emit({
        returnValue: this._returnValue,
        closeTarget: this._dialogCloseElement,
      });
      this._openDialogController?.abort();
      this._focusHandler.disconnect();
      this._dialogContentResizeObserver.disconnect();
      this._removeInstanceFromGlobalCollection();
      // Enable scrolling for content below the dialog if no dialog is open
      !dialogRefs.length && this._scrollHandler.enableScroll();
    }
  }

  private _setAriaLiveRefContent(): void {
    this._ariaLiveRefToggle = !this._ariaLiveRefToggle;

    // Take accessibility label or current string in title section
    const label = this.accessibilityLabel || this._dialogTitleElement?.innerText.trim();

    // If the text content remains the same, on VoiceOver the aria-live region is not announced a second time.
    // In order to support reading on every opening, we toggle an invisible space.
    this._ariaLiveRef.textContent = `${i18nDialog[this._language.current]}${
      label ? `, ${label}` : ''
    }${this._ariaLiveRefToggle ? ' ' : ''}`;
  }

  private _removeAriaLiveRefContent(): void {
    this._ariaLiveRef.textContent = '';
  }

  // Set focus on the first focusable element.
  private _setDialogFocus(): void {
    const firstFocusable = getFirstFocusableElement(
      Array.from(this.children).filter((e): e is HTMLElement => e instanceof window.HTMLElement),
    );
    setModalityOnNextFocus(firstFocusable);
    firstFocusable?.focus();
  }

  private _setDialogHeaderHeight(): void {
    this._dialogTitleHeight = this._dialogTitleElement?.shadowRoot!.firstElementChild!.clientHeight;
    this.style.setProperty('--sbb-dialog-header-height', `${this._dialogTitleHeight}px`);
  }

  private _onContentResize(): void {
    this._setDialogHeaderHeight();
    // Check whether the content overflows and set the `overflows` attribute.
    this._overflows = this._dialogContentElement
      ? this._dialogContentElement?.scrollHeight > this._dialogContentElement?.clientHeight
      : false;
    this._setOverflowsDataAttribute();
  }

  private _setHideHeaderDataAttribute(value: boolean): void {
    const hideOnScroll = this._dialogTitleElement?.hideOnScroll ?? false;
    const hideHeader =
      typeof hideOnScroll === 'boolean'
        ? hideOnScroll
        : isBreakpoint('zero', hideOnScroll, { includeMaxBreakpoint: true });
    this.toggleAttribute('data-hide-header', !hideHeader ? false : value);
    this._dialogTitleElement &&
      this._dialogTitleElement.toggleAttribute('data-hide-header', !hideHeader ? false : value);
  }

  private _setOverflowsDataAttribute(): void {
    this.toggleAttribute('data-overflows', this._overflows);
    this._dialogTitleElement &&
      this._dialogTitleElement.toggleAttribute('data-overflows', this._overflows);
    if (this._dialogActionsElement) {
      this._dialogActionsElement.toggleAttribute('data-overflows', this._overflows);
    }
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-dialog__container">
        <div
          @animationend=${(event: AnimationEvent) => this._onDialogAnimationEnd(event)}
          class="sbb-dialog"
          id=${this._dialogId}
        >
          <div
            @click=${(event: Event) => this._closeOnSbbDialogCloseClick(event)}
            class="sbb-dialog__wrapper"
          >
            <slot name="title"></slot>
            <slot name="content"></slot>
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
      <sbb-screenreader-only
        aria-live="polite"
        ${ref((el?: Element) => (this._ariaLiveRef = el as HTMLElement))}
      ></sbb-screenreader-only>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-dialog': SbbDialogElement;
  }
}
