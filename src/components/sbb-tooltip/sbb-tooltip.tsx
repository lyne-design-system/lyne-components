import { CSSResult, LitElement, PropertyValues, TemplateResult, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import {
  FocusTrap,
  IS_FOCUSABLE_QUERY,
  assignId,
  getFirstFocusableElement,
  sbbInputModalityDetector,
  setModalityOnNextFocus,
} from '../../global/a11y';
import { findReferencedElement, isValidAttribute, setAttribute } from '../../global/dom';
import {
  EventEmitter,
  HandlerRepository,
  composedPathHasAttribute,
  documentLanguage,
  languageChangeHandlerAspect,
} from '../../global/eventing';
import { i18nCloseTooltip } from '../../global/i18n';
import {
  Alignment,
  SbbOverlayState,
  getElementPosition,
  isEventOnElement,
  removeAriaOverlayTriggerAttributes,
  setAriaOverlayTriggerAttributes,
} from '../../global/overlay';
import '../sbb-button';
import Style from './sbb-tooltip.scss?lit&inline';

const VERTICAL_OFFSET = 16;
const HORIZONTAL_OFFSET = 32;

let nextId = 0;

const tooltipsRef = new Set<SbbTooltip>();

/**
 * @slot unnamed - Use this slot to project any content inside the tooltip.
 */
@customElement('sbb-tooltip')
export class SbbTooltip extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    willOpen: 'will-open',
    didOpen: 'did-open',
    willClose: 'will-close',
    didClose: 'did-close',
  };

  /**
   * The element that will trigger the tooltip dialog.
   * Accepts both a string (id of an element) or an HTML element.
   */
  @property() public trigger: string | HTMLElement;

  /**
   * Whether the close button should be hidden.
   */
  @property({ attribute: 'hide-close-button', type: Boolean }) public hideCloseButton?: boolean =
    false;

  /**
   * Whether the tooltip should be triggered on hover.
   */
  @property({ attribute: 'hover-trigger', type: Boolean }) public hoverTrigger?: boolean = false;

  /**
   * Open the tooltip after a certain delay.
   */
  @property({ attribute: 'open-delay' }) public openDelay? = 0;

  /**
   * Close the tooltip after a certain delay.
   */
  @property({ attribute: 'close-delay' }) public closeDelay? = 0;

  /**
   * Whether the animation is enabled.
   */
  @property({ attribute: 'disable-animation', reflect: true, type: Boolean })
  public disableAnimation = false;

  /**
   * This will be forwarded as aria-label to the close button element.
   */
  @property({ attribute: 'accessibility-close-label' }) public accessibilityCloseLabel:
    | string
    | undefined;

  /**
   * The state of the tooltip.
   */
  private set _state(state: SbbOverlayState) {
    this.dataset.state = state;
  }
  private get _state(): SbbOverlayState {
    return this.dataset.state as SbbOverlayState;
  }

  /**
   * The alignment of the tooltip relative to the trigger.
   */
  @state() private _alignment: Alignment;

  @state() private _currentLanguage = documentLanguage();

  /**
   * Emits whenever the tooltip starts the opening transition.
   */
  private _willOpen: EventEmitter<void> = new EventEmitter(this, SbbTooltip.events.willOpen);

  /**
   * Emits whenever the tooltip is opened.
   */
  private _didOpen: EventEmitter<void> = new EventEmitter(this, SbbTooltip.events.didOpen);

  /**
   * Emits whenever the tooltip begins the closing transition.
   */
  private _willClose: EventEmitter<{ closeTarget: HTMLElement }> = new EventEmitter(
    this,
    SbbTooltip.events.willClose,
  );

  /**
   * Emits whenever the tooltip is closed.
   */
  private _didClose: EventEmitter<{ closeTarget: HTMLElement }> = new EventEmitter(
    this,
    SbbTooltip.events.didClose,
  );

  private _dialog: HTMLDialogElement;
  private _triggerElement: HTMLElement;
  private _tooltipContentElement: HTMLElement;
  // The element which should receive focus after closing based on where in the backdrop the user clicks.
  private _nextFocusedElement?: HTMLElement;
  private _tooltipCloseElement: HTMLElement;
  private _isPointerDownEventOnTooltip: boolean;
  private _tooltipController: AbortController;
  private _windowEventsController: AbortController;
  private _focusTrap = new FocusTrap();
  private _hoverTrigger = false;
  private _openTimeout: ReturnType<typeof setTimeout>;
  private _closeTimeout: ReturnType<typeof setTimeout>;
  private _tooltipId = `sbb-tooltip-${++nextId}`;

  private _handlerRepository = new HandlerRepository(
    this,
    languageChangeHandlerAspect((l) => (this._currentLanguage = l)),
  );

  /**
   * Opens the tooltip on trigger click.
   */
  public open(): void {
    if ((this._state !== 'closed' && this._state !== 'closing') || !this._dialog) {
      return;
    }

    for (const tooltip of Array.from(tooltipsRef)) {
      const state = tooltip.getAttribute('data-state') as SbbOverlayState;
      if (state && (state === 'opened' || state === 'opening')) {
        tooltip.close();
      }
    }

    this._willOpen.emit();
    this._state = 'opening';
    this._setTooltipPosition();
    this._dialog.show();
    this._triggerElement?.setAttribute('aria-expanded', 'true');
    this._nextFocusedElement = undefined;
  }

  /**
   * Closes the tooltip.
   */
  public close(target?: HTMLElement): void {
    if (this._state !== 'opened' && this._state !== 'opening') {
      return;
    }

    this._tooltipCloseElement = target;
    this._willClose.emit({ closeTarget: this._tooltipCloseElement });
    this._state = 'closing';
    this._triggerElement?.setAttribute('aria-expanded', 'false');
  }

  // Closes the tooltip on "Esc" key pressed and traps focus within the tooltip.
  private _onKeydownEvent(event: KeyboardEvent): void {
    if (this._state !== 'opened') {
      return;
    }

    if (event.key === 'Escape') {
      this.close();
      return;
    }
  }

  // Removes trigger click listener on trigger change.
  private _removeTriggerClickListener(
    newValue: string | HTMLElement,
    oldValue: string | HTMLElement,
  ): void {
    if (newValue !== oldValue) {
      this._tooltipController?.abort();
      this._windowEventsController?.abort();
      this._configure(this.trigger);
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._handlerRepository.connect();
    // Validate trigger element and attach event listeners
    this._configure(this.trigger);
    this._state = 'closed';
    tooltipsRef.add(this as SbbTooltip);
  }

  public override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('trigger')) {
      this._removeTriggerClickListener(this.trigger, changedProperties.get('trigger'));
    }
  }

  protected override firstUpdated(): void {
    if (this._hoverTrigger) {
      this._dialog.addEventListener('mouseenter', () => this._onDialogMouseEnter());
      this._dialog.addEventListener('mouseleave', () => this._onDialogMouseLeave());
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._handlerRepository.disconnect();
    this._tooltipController?.abort();
    this._windowEventsController?.abort();
    this._focusTrap.disconnect();
    tooltipsRef.delete(this as SbbTooltip);
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
      'dialog',
      this.id || this._tooltipId,
      this._state,
    );

    // Check whether the trigger can be hovered. Some devices might interpret the media query (hover: hover) differently,
    // and not respect the fallback mechanism on the click. Therefore, the following is preferred to identify
    // all non-touchscreen devices.
    this._hoverTrigger = this.hoverTrigger && !window.matchMedia('(pointer: coarse)').matches;

    this._tooltipController = new AbortController();
    if (this._hoverTrigger) {
      this._triggerElement.addEventListener('mouseenter', this._onTriggerMouseEnter, {
        signal: this._tooltipController.signal,
      });

      this._triggerElement.addEventListener('mouseleave', this._onTriggerMouseLeave, {
        signal: this._tooltipController.signal,
      });

      this._triggerElement.addEventListener(
        'keydown',
        async (evt: KeyboardEvent) => {
          if (evt.code === 'Space' || evt.code === 'Enter') {
            this.open();
          }
        },
        {
          signal: this._tooltipController.signal,
        },
      );
    } else {
      this._triggerElement.addEventListener(
        'click',
        () => {
          this._state === 'closed' && this.open();
        },
        {
          signal: this._tooltipController.signal,
        },
      );
    }
  }

  private _attachWindowEvents(): void {
    this._windowEventsController = new AbortController();
    document.addEventListener('scroll', () => this._setTooltipPosition(), {
      passive: true,
      signal: this._windowEventsController.signal,
    });
    window.addEventListener('resize', () => this._setTooltipPosition(), {
      passive: true,
      signal: this._windowEventsController.signal,
    });
    window.addEventListener('keydown', (event: KeyboardEvent) => this._onKeydownEvent(event), {
      signal: this._windowEventsController.signal,
    });

    // Close tooltip on backdrop click
    window.addEventListener('pointerdown', this._pointerDownListener, {
      signal: this._windowEventsController.signal,
    });
    window.addEventListener('pointerup', this._closeOnBackdropClick, {
      signal: this._windowEventsController.signal,
    });
  }

  // Close the tooltip on click of any element that has the 'sbb-tooltip-close' attribute.
  private _closeOnSbbTooltipCloseClick(event: Event): void {
    const closeElement = composedPathHasAttribute(event, 'sbb-tooltip-close', this);

    if (closeElement && !isValidAttribute(closeElement, 'disabled')) {
      clearTimeout(this._closeTimeout);
      this.close(closeElement);
    }
  }

  // Check if the pointerdown event target is triggered on the tooltip.
  private _pointerDownListener = (event: PointerEvent): void => {
    this._isPointerDownEventOnTooltip = isEventOnElement(this._dialog, event);
  };

  // Close tooltip on backdrop click.
  private _closeOnBackdropClick = async (event: PointerEvent): Promise<void> => {
    if (!this._isPointerDownEventOnTooltip && !isEventOnElement(this._dialog, event)) {
      this._nextFocusedElement = event
        .composedPath()
        .filter((el) => el instanceof window.HTMLElement)
        .find((el) => (el as HTMLElement).matches(IS_FOCUSABLE_QUERY)) as HTMLElement;
      clearTimeout(this._closeTimeout);
      await this.close();
    }
  };

  private _onTriggerMouseEnter = (): void => {
    if (this._state === 'closed' || this._state === 'closing') {
      this._openTimeout = setTimeout(() => this.open(), this.openDelay);
    } else {
      clearTimeout(this._closeTimeout);
    }
  };

  private _onTriggerMouseLeave = (): void => {
    if (this._state === 'opened' || this._state === 'opening') {
      this._closeTimeout = setTimeout(() => this.close(), this.closeDelay);
    } else {
      clearTimeout(this._openTimeout);
    }
  };

  private _onDialogMouseEnter = (): void => {
    if (this._state !== 'opening') {
      clearTimeout(this._closeTimeout);
    }
  };

  private _onDialogMouseLeave = (): void => {
    if (this._state !== 'opening') {
      this._closeTimeout = setTimeout(() => this.close(), this.closeDelay);
    }
  };

  // Set tooltip position (x, y) to '0' once the tooltip is closed and the transition ended to prevent the
  // viewport from overflowing. And set the focus to the first focusable element once the tooltip is open.
  // In rare cases it can be that the animationEnd event is triggered twice.
  // To avoid entering a corrupt state, exit when state is not expected.
  private _onTooltipAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'open' && this._state === 'opening') {
      this._state = 'opened';
      this._didOpen.emit();
      this._setTooltipFocus();
      this._focusTrap.trap(this);
      this._attachWindowEvents();
    } else if (event.animationName === 'close' && this._state === 'closing') {
      this._state = 'closed';
      this._dialog.firstElementChild.scrollTo(0, 0);

      const elementToFocus = this._nextFocusedElement || this._triggerElement;

      setModalityOnNextFocus(elementToFocus);
      this._dialog.close();
      // To enable focusing other element than the trigger, we need to call focus() a second time.
      elementToFocus?.focus();
      this._didClose.emit({ closeTarget: this._tooltipCloseElement });
      this._windowEventsController?.abort();
      this._focusTrap.disconnect();
    }
  }

  // Set focus on the first focusable element.
  private _setTooltipFocus(): void {
    if (sbbInputModalityDetector.mostRecentModality === 'keyboard') {
      const firstFocusable =
        (this.shadowRoot.querySelector('[sbb-tooltip-close]') as HTMLElement) ||
        getFirstFocusableElement(
          Array.from(this.children).filter(
            (e): e is HTMLElement => e instanceof window.HTMLElement,
          ),
        );

      firstFocusable?.focus();
    } else {
      // Focusing sbb-tooltip__content in order to provide a consistent behavior in Safari where else
      // the focus-visible styles would be incorrectly applied
      this._tooltipContentElement.tabIndex = 0;
      this._tooltipContentElement.focus();
      this.addEventListener('blur', () => this._tooltipContentElement.removeAttribute('tabindex'), {
        once: true,
      });
    }
  }

  private _setTooltipPosition(): void {
    if (!this._dialog || !this._triggerElement) {
      return;
    }

    const tooltipPosition = getElementPosition(this._dialog, this._triggerElement, {
      verticalOffset: VERTICAL_OFFSET,
      horizontalOffset: HORIZONTAL_OFFSET,
      centered: true,
      responsiveHeight: true,
    });

    this._alignment = tooltipPosition.alignment;

    const arrowXPosition =
      this._triggerElement.getBoundingClientRect().left -
      tooltipPosition.left +
      this._triggerElement.clientWidth / 2 -
      8; // half the size of the tooltip arrow

    this.style.setProperty('--sbb-tooltip-position-x', `${tooltipPosition.left}px`);
    this.style.setProperty('--sbb-tooltip-position-y', `${tooltipPosition.top}px`);
    this.style.setProperty('--sbb-tooltip-arrow-position-x', `${arrowXPosition}px`);
  }

  protected override render(): TemplateResult {
    const closeButton = html`
      <span class="sbb-tooltip__close">
        <sbb-button
          aria-label=${this.accessibilityCloseLabel || i18nCloseTooltip[this._currentLanguage]}
          variant="secondary"
          size="m"
          type="button"
          icon-name="cross-small"
          sbb-tooltip-close
        ></sbb-button>
      </span>
    `;

    setAttribute(this, 'data-position', this._alignment?.vertical);
    assignId(() => this._tooltipId)(this);

    return html`
      <div class="sbb-tooltip__container">
        <dialog
          @animationend=${(event: AnimationEvent) => this._onTooltipAnimationEnd(event)}
          ${ref((dialogRef) => (this._dialog = dialogRef as HTMLDialogElement))}
          class="sbb-tooltip"
          role="tooltip"
        >
          <div
            @click=${(event: Event) => this._closeOnSbbTooltipCloseClick(event)}
            ${ref(
              (tooltipContentRef) =>
                (this._tooltipContentElement = tooltipContentRef as HTMLElement),
            )}
            class="sbb-tooltip__content"
          >
            <span>
              <slot>No content</slot>
            </span>
            ${!this.hideCloseButton && !this._hoverTrigger ? closeButton : nothing}
          </div>
        </dialog>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-tooltip': SbbTooltip;
  }
}
