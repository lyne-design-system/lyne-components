import { TitleLevel } from '../sbb-title';
import { i18nCloseDialog, i18nGoBack } from '../../global/i18n';
import { SbbOverlayState } from '../../global/overlay';
import {
  FocusTrap,
  IS_FOCUSABLE_QUERY,
  sbbInputModalityDetector,
  setModalityOnNextFocus,
} from '../../global/a11y';
import {
  ScrollHandler,
  toggleDatasetEntry,
  isValidAttribute,
  hostContext,
  setAttribute,
} from '../../global/dom';
import {
  createNamedSlotState,
  documentLanguage,
  HandlerRepository,
  languageChangeHandlerAspect,
  namedSlotChangeHandlerAspect,
  EventEmitter,
} from '../../global/eventing';
import { AgnosticResizeObserver } from '../../global/observers';
import { CSSResult, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { spread } from '@open-wc/lit-helpers';
import { ref } from 'lit/directives/ref.js';
import Style from './sbb-dialog.scss?lit&inline';

// A global collection of existing dialogs
const dialogRefs: SbbDialog[] = [];
let nextId = 0;

/**
 * @slot unnamed - Use this slot to provide the dialog content.
 * @slot title - Use this slot to provide a title.
 * @slot action-group - Use this slot to display an action group in the footer.
 */
@customElement('sbb-dialog')
export class SbbDialog extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    willOpen: 'will-open',
    didOpen: 'did-open',
    willClose: 'will-close',
    didClose: 'did-close',
    backClick: 'request-back-action',
  };

  /**
   * Dialog title.
   */
  @property({ attribute: 'title-content' }) public titleContent: string;

  /**
   * Level of title, will be rendered as heading tag (e.g. h1). Defaults to level 1.
   */
  @property({ attribute: 'title-level' }) public titleLevel: TitleLevel = '1';

  /**
   * Whether a back button is displayed next to the title.
   */
  @property({ attribute: 'title-back-button', type: Boolean }) public titleBackButton = false;

  /**
   * Backdrop click action.
   */
  @property({ attribute: 'backdrop-action' }) public backdropAction: 'close' | 'none' = 'close';

  /**
   * Negative coloring variant flag.
   */
  @property({ reflect: true, type: Boolean }) public negative = false;

  /**
   * This will be forwarded as aria-label to the relevant nested element.
   */
  @property({ attribute: 'accessibility-label' }) public accessibilityLabel: string | undefined;

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
   * Whether the animation is enabled.
   */
  @property({ attribute: 'disable-animation', reflect: true, type: Boolean })
  public disableAnimation = false;

  /**
   * State of listed named slots, by indicating whether any element for a named slot is defined.
   */
  @state() private _namedSlots = createNamedSlotState('title', 'action-group');

  @state() private _currentLanguage = documentLanguage();

  /*
   * The state of the dialog.
   */
  private set _state(state: SbbOverlayState) {
    this.dataset.state = state;
  }
  private get _state(): SbbOverlayState {
    return this.dataset.state as SbbOverlayState;
  }

  private _dialogContentResizeObserver = new AgnosticResizeObserver(() =>
    this._setOverflowAttribute(),
  );

  /**
   * Emits whenever the dialog starts the opening transition.
   */
  private _willOpen: EventEmitter<void> = new EventEmitter(this, SbbDialog.events.willOpen);

  /**
   * Emits whenever the dialog is opened.
   */
  private _didOpen: EventEmitter<void> = new EventEmitter(this, SbbDialog.events.didOpen);

  /**
   * Emits whenever the dialog begins the closing transition.
   */
  private _willClose: EventEmitter = new EventEmitter(this, SbbDialog.events.willClose);

  /**
   * Emits whenever the dialog is closed.
   */
  private _didClose: EventEmitter = new EventEmitter(this, SbbDialog.events.didClose);

  /**
   * Emits whenever the back button is clicked.
   */
  private _backClick: EventEmitter<void> = new EventEmitter(this, SbbDialog.events.backClick);

  private _dialog: HTMLDialogElement;
  private _dialogWrapperElement: HTMLElement;
  private _dialogContentElement: HTMLElement;
  private _dialogCloseElement: HTMLElement;
  private _dialogController: AbortController;
  private _windowEventsController: AbortController;
  private _focusTrap = new FocusTrap();
  private _scrollHandler = new ScrollHandler();
  private _returnValue: any;
  private _isPointerDownEventOnDialog: boolean;
  private _dialogId = `sbb-dialog-${nextId++}`;

  // Last element which had focus before the dialog was opened.
  private _lastFocusedElement?: HTMLElement;

  private _handlerRepository = new HandlerRepository(
    this,
    languageChangeHandlerAspect((l) => (this._currentLanguage = l)),
    namedSlotChangeHandlerAspect((m) => (this._namedSlots = m(this._namedSlots))),
  );

  /**
   * Opens the dialog element.
   */

  public open(): void {
    if (this._state !== 'closed' || !this._dialog) {
      return;
    }
    this._lastFocusedElement = document.activeElement as HTMLElement;
    this._willOpen.emit();
    this._state = 'opening';
    this._dialog.show();
    // Add this dialog to the global collection
    dialogRefs.push(this as SbbDialog);
    this._setOverflowAttribute();
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
    this._willClose.emit({ returnValue: this._returnValue, closeTarget: this._dialogCloseElement });
    this._state = 'closing';
  }

  // Closes the dialog on "Esc" key pressed.
  private _onKeydownEvent(event: KeyboardEvent): Promise<void> {
    if (this._state !== 'opened') {
      return;
    }

    if (event.key === 'Escape') {
      dialogRefs[dialogRefs.length - 1].close();
      return;
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._handlerRepository.connect();
    this._state = 'closed';
    this._dialogController = new AbortController();

    // Close dialog on backdrop click
    this.addEventListener('pointerdown', this._pointerDownListener, {
      signal: this._dialogController.signal,
    });
    this.addEventListener('pointerup', this._closeOnBackdropClick, {
      signal: this._dialogController.signal,
    });
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._handlerRepository.disconnect();
    this._dialogController?.abort();
    this._windowEventsController?.abort();
    this._focusTrap.disconnect();
    this._dialogContentResizeObserver.disconnect();
    this._removeInstanceFromGlobalCollection();
  }

  private _removeInstanceFromGlobalCollection(): void {
    dialogRefs.splice(dialogRefs.indexOf(this as SbbDialog), 1);
  }

  private _attachWindowEvents(): void {
    this._windowEventsController = new AbortController();
    window.addEventListener('keydown', (event: KeyboardEvent) => this._onKeydownEvent(event), {
      signal: this._windowEventsController.signal,
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
      .some((target) => target.tagName === this._dialogId);
  };

  // Close dialog on backdrop click.
  private _closeOnBackdropClick = (event: PointerEvent): Promise<void> => {
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
    const target = event.target as HTMLElement;

    if (target.hasAttribute('sbb-dialog-close') && !isValidAttribute(target, 'disabled')) {
      // Check if the target is a submission element within a form and return the form, if present
      const closestForm =
        target.getAttribute('type') === 'submit'
          ? (hostContext('form', target) as HTMLFormElement)
          : undefined;
      this.close(closestForm, target);
    }
  }

  // Wait for dialog transition to complete.
  // In rare cases it can be that the animationEnd event is triggered twice.
  // To avoid entering a corrupt state, exit when state is not expected.
  private _onDialogAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'open' && this._state === 'opening') {
      this._state = 'opened';
      this._didOpen.emit();
      this._setDialogFocus();
      this._focusTrap.trap(this);
      this._dialogContentResizeObserver.observe(this._dialogContentElement);
      this._attachWindowEvents();
    } else if (event.animationName === 'close' && this._state === 'closing') {
      this._state = 'closed';
      this._dialogWrapperElement.querySelector('.sbb-dialog__content').scrollTo(0, 0);
      setModalityOnNextFocus(this._lastFocusedElement);
      this._dialog.close();
      // Manually focus last focused element in order to avoid showing outline in Safari
      this._lastFocusedElement?.focus();
      this._didClose.emit({
        returnValue: this._returnValue,
        closeTarget: this._dialogCloseElement,
      });
      this._windowEventsController?.abort();
      this._focusTrap.disconnect();
      this._dialogContentResizeObserver.disconnect();
      this._removeInstanceFromGlobalCollection();
      // Enable scrolling for content below the dialog if no dialog is open
      !dialogRefs.length && this._scrollHandler.enableScroll();
    }
  }

  // Set focus on the first focusable element.
  private _setDialogFocus(): void {
    const firstFocusable = this.shadowRoot.querySelector(IS_FOCUSABLE_QUERY) as HTMLElement;

    if (sbbInputModalityDetector.mostRecentModality === 'keyboard') {
      firstFocusable.focus();
    } else {
      // Focusing sbb-dialog__wrapper in order to provide a consistent behavior in Safari where else
      // the focus-visible styles would be incorrectly applied
      this._dialogWrapperElement.tabIndex = 0;
      this._dialogWrapperElement.focus();

      this._dialogWrapperElement.addEventListener(
        'blur',
        () => this._dialogWrapperElement.removeAttribute('tabindex'),
        { once: true },
      );
    }
  }

  private _setOverflowAttribute(): void {
    toggleDatasetEntry(
      this,
      'overflows',
      this._dialogContentElement.scrollHeight > this._dialogContentElement.clientHeight,
    );
  }

  protected override render(): TemplateResult {
    const hasTitle = !!this.titleContent || this._namedSlots['title'];
    const hasActionGroup = this._namedSlots['action-group'] && hasTitle;

    const closeButton = html`
      <sbb-button
        class="sbb-dialog__close"
        aria-label=${this.accessibilityCloseLabel || i18nCloseDialog[this._currentLanguage]}
        variant=${this.negative ? 'transparent' : 'secondary'}
        ?negative=${this.negative}
        size="m"
        type="button"
        icon-name="cross-small"
        sbb-dialog-close
      ></sbb-button>
    `;

    const backButton = html`
      <sbb-button
        class="sbb-dialog__back"
        aria-label=${this.accessibilityBackLabel || i18nGoBack[this._currentLanguage]}
        variant=${this.negative ? 'transparent' : 'secondary'}
        ?negative=${this.negative}
        size="m"
        type="button"
        icon-name="chevron-small-left-small"
        @click=${() => this._backClick.emit()}
      ></sbb-button>
    `;

    const dialogHeader = html`
      <div class="sbb-dialog__header">
        ${this.titleBackButton ? backButton : nothing}
        ${hasTitle
          ? html`<sbb-title
              class="sbb-dialog__title"
              level=${this.titleLevel}
              visual-level="3"
              ?negative=${this.negative}
              id="title"
            >
              <slot name="title">${this.titleContent}</slot>
            </sbb-title>`
          : nothing}
        ${closeButton}
      </div>
    `;

    const dialogFooter = html`
      <div class="sbb-dialog__footer">
        <slot name="action-group"></slot>
      </div>
    `;

    // Accessibility label should win over aria-labelledby
    let accessibilityAttributes: Record<string, string> = { 'aria-labelledby': 'title' };
    if (this.accessibilityLabel) {
      accessibilityAttributes = { 'aria-label': this.accessibilityLabel };
    }

    setAttribute(this, 'data-fullscreen', !hasTitle);

    return html`
      <div class="sbb-dialog__container">
        <dialog
          ${ref((dialogRef) => (this._dialog = dialogRef as HTMLDialogElement))}
          @animationend=${(event: AnimationEvent) => this._onDialogAnimationEnd(event)}
          class="sbb-dialog"
          role="group"
          id=${this._dialogId}
          ${spread(accessibilityAttributes)}
        >
          <div
            @click=${(event: Event) => this._closeOnSbbDialogCloseClick(event)}
            ${ref(
              (dialogWrapperRef) => (this._dialogWrapperElement = dialogWrapperRef as HTMLElement),
            )}
            class="sbb-dialog__wrapper"
          >
            ${dialogHeader}
            <div
              class="sbb-dialog__content"
              ${ref((dialogContent) => (this._dialogContentElement = dialogContent as HTMLElement))}
            >
              <slot></slot>
            </div>
            ${hasActionGroup ? dialogFooter : nothing}
          </div>
        </dialog>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-dialog': SbbDialog;
  }
}
