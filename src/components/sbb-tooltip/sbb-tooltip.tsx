import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  JSX,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { Alignment, getElementPosition, isEventOnElement } from '../../global/helpers/position';
import {
  IS_FOCUSABLE_QUERY,
  FocusTrap,
  SbbFocusOrigin,
  detectFocusOrigin,
} from '../../global/helpers/focus';
import { i18nCloseTooltip } from '../../global/i18n';
import { isValidAttribute } from '../../global/helpers/is-valid-attribute';
import { assignId } from '../../global/helpers/assign-id';
import {
  setAriaOverlayTriggerAttributes,
  removeAriaOverlayTriggerAttributes,
} from '../../global/helpers/overlay-trigger-attributes';
import {
  documentLanguage,
  HandlerRepository,
  languageChangeHandlerAspect,
} from '../../global/helpers';
import { OverlayDOMController } from '../../global/helpers/overlay-dom';

type SbbTooltipState = 'closed' | 'opening' | 'opened' | 'closing';

const VERTICAL_OFFSET = 16;
const HORIZONTAL_OFFSET = 32;

let nextId = 0;

/**
 * @slot unnamed - Use this slot to project any content inside the tooltip.
 */
@Component({
  shadow: true,
  styleUrl: 'sbb-tooltip.scss',
  tag: 'sbb-tooltip',
})
export class SbbTooltip implements ComponentInterface {
  /**
   * The element that will trigger the tooltip dialog.
   * Accepts both a string (id of an element) or an HTML element.
   */
  @Prop() public trigger: string | HTMLElement;

  /**
   * Whether the close button should be hidden.
   */
  @Prop() public hideCloseButton?: boolean = false;

  /**
   * Whether the tooltip should be triggered on hover.
   */
  @Prop() public hoverTrigger?: boolean = false;

  /**
   * Open the tooltip after a certain delay.
   */
  @Prop() public openDelay? = 0;

  /**
   * Close the tooltip after a certain delay.
   */
  @Prop() public closeDelay? = 0;

  /**
   * Whether the animation is enabled.
   */
  @Prop({ reflect: true }) public disableAnimation = false;

  /**
   * This will be forwarded as aria-label to the close button element.
   */
  @Prop() public accessibilityCloseLabel: string | undefined;

  /**
   * The state of the tooltip.
   */
  private set _state(state: SbbTooltipState) {
    this._element.dataset.state = state;
  }
  private get _state(): SbbTooltipState {
    return this._element.dataset.state as SbbTooltipState;
  }

  /**
   * The alignment of the tooltip relative to the trigger.
   */
  @State() private _alignment: Alignment;

  @State() private _currentLanguage = documentLanguage();

  /**
   * Emits whenever the tooltip starts the opening transition.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'will-open',
  })
  public willOpen: EventEmitter<void>;

  /**
   * Emits whenever the tooltip is opened.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'did-open',
  })
  public didOpen: EventEmitter<void>;

  /**
   * Emits whenever the tooltip begins the closing transition.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'will-close',
  })
  public willClose: EventEmitter<{ closeTarget: HTMLElement }>;

  /**
   * Emits whenever the tooltip is closed.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'did-close',
  })
  public didClose: EventEmitter<{ closeTarget: HTMLElement }>;

  private _dialog: HTMLDialogElement;
  private _triggerElement: HTMLElement;
  private _tooltipContentElement: HTMLElement;
  // The element which should receive focus after closing based on where in the backdrop the user clicks.
  private _nextFocusedElement?: HTMLElement;
  private _firstFocusable: HTMLElement;
  private _tooltipCloseElement: HTMLElement;
  private _isPointerDownEventOnTooltip: boolean;
  private _tooltipController: AbortController;
  private _windowEventsController: AbortController;
  private _overlayDOMController = new OverlayDOMController();
  private _focusTrap = new FocusTrap();
  private _openedByKeyboard = false;
  private _closedByFocusOrigin: SbbFocusOrigin = null;
  private _hoverTrigger = false;
  private _openTimeout: ReturnType<typeof setTimeout>;
  private _closeTimeout: ReturnType<typeof setTimeout>;
  private _tooltipId = `sbb-tooltip-${++nextId}`;

  @Element() private _element!: HTMLElement;

  private _handlerRepository = new HandlerRepository(
    this._element,
    languageChangeHandlerAspect((l) => (this._currentLanguage = l))
  );

  /**
   * Opens the tooltip on trigger click.
   */
  @Method()
  public async open(focusOrigin?: SbbFocusOrigin): Promise<void> {
    if ((this._state !== 'closed' && this._state !== 'closing') || !this._dialog) {
      return;
    }
    this._overlayDOMController.attachViewToDom(this._element);

    this._openedByKeyboard = focusOrigin === 'keyboard';
    this.willOpen.emit();
    this._state = 'opening';
    this._setTooltipPosition();
    this._dialog.show();
    this._triggerElement?.setAttribute('aria-expanded', 'true');
    this._nextFocusedElement = undefined;
  }

  /**
   * Closes the tooltip.
   */
  @Method()
  public async close(
    closedByFocusOrigin: SbbFocusOrigin = null,
    target?: HTMLElement
  ): Promise<void> {
    if (this._state !== 'opened' && this._state !== 'opening') {
      return;
    }
    this._overlayDOMController.removeViewFromDom();

    this._tooltipCloseElement = target;
    this._closedByFocusOrigin = closedByFocusOrigin;
    this.willClose.emit({ closeTarget: this._tooltipCloseElement });
    this._state = 'closing';
    this._openedByKeyboard = false;
    this._triggerElement?.setAttribute('aria-expanded', 'false');
  }

  // Closes the tooltip on "Esc" key pressed and traps focus within the tooltip.
  private async _onKeydownEvent(event: KeyboardEvent): Promise<void> {
    if (this._state !== 'opened') {
      return;
    }

    if (event.key === 'Escape') {
      await this.close('keyboard');
      return;
    }
  }

  // Removes trigger click listener on trigger change.
  @Watch('trigger')
  public removeTriggerClickListener(
    newValue: string | HTMLElement,
    oldValue: string | HTMLElement
  ): void {
    if (newValue !== oldValue) {
      this._tooltipController?.abort();
      this._windowEventsController?.abort();
      this._configure(this.trigger);
    }
  }

  public connectedCallback(): void {
    this._handlerRepository.connect();
    // Validate trigger element and attach event listeners
    this._configure(this.trigger);
    this._state = 'closed';
  }

  public componentDidLoad(): void {
    if (this._hoverTrigger) {
      this._dialog.addEventListener('mouseenter', () => this._onDialogMouseEnter());
      this._dialog.addEventListener('mouseleave', () => this._onDialogMouseLeave());
    }
  }

  public disconnectedCallback(): void {
    this._handlerRepository.disconnect();
    this._tooltipController?.abort();
    this._windowEventsController?.abort();
    this._focusTrap.disconnect();
  }

  // Check if the trigger is valid and attach click event listeners.
  private _configure(trigger: string | HTMLElement): void {
    removeAriaOverlayTriggerAttributes(this._triggerElement);

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

    setAriaOverlayTriggerAttributes(
      this._triggerElement,
      'dialog',
      this._element.id || this._tooltipId,
      this._state
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
            await this.open('keyboard');
          }
        },
        {
          signal: this._tooltipController.signal,
        }
      );
    } else {
      this._triggerElement.addEventListener(
        'click',
        (event) => {
          this._state === 'closed' && this.open(detectFocusOrigin(event));
        },
        {
          signal: this._tooltipController.signal,
        }
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
  private async _closeOnSbbTooltipCloseClick(event: Event): Promise<void> {
    const closeElement = event
      .composedPath()
      .find(
        (e) => e instanceof window.HTMLElement && e.hasAttribute('sbb-tooltip-close')
      ) as HTMLElement;
    if (closeElement && !isValidAttribute(closeElement, 'disabled')) {
      clearTimeout(this._closeTimeout);
      await this.close(detectFocusOrigin(event), closeElement);
    }
  }

  // Check if the pointerdown event target is triggered on the tooltip.
  private _pointerDownListener = (event: PointerEvent): void => {
    this._isPointerDownEventOnTooltip = isEventOnElement(this._dialog, event);
  };

  // Close tooltip on backdrop click.
  private _closeOnBackdropClick = async (event: PointerEvent): Promise<void> => {
    if (!this._isPointerDownEventOnTooltip && !isEventOnElement(this._dialog, event)) {
      this._nextFocusedElement = document.activeElement as HTMLElement;
      clearTimeout(this._closeTimeout);
      await this.close(detectFocusOrigin(event));
    }
  };

  private _onTriggerMouseEnter = (): void => {
    if (this._state === 'closed' || this._state === 'closing') {
      this._openTimeout = setTimeout(() => this.open('mouse'), this.openDelay);
    } else {
      clearTimeout(this._closeTimeout);
    }
  };

  private _onTriggerMouseLeave = (): void => {
    if (this._state === 'opened' || this._state === 'opening') {
      this._closeTimeout = setTimeout(() => this.close('mouse'), this.closeDelay);
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
      this._closeTimeout = setTimeout(() => this.close('mouse'), this.closeDelay);
    }
  };

  // Set tooltip position (x, y) to '0' once the tooltip is closed and the transition ended to prevent the
  // viewport from overflowing. And set the focus to the first focusable element once the tooltip is open.
  private _onTooltipAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'open' && this._state === 'opening') {
      this._state = 'opened';
      this.didOpen.emit();
      this._setTooltipFocus();
      this._focusTrap.trap(this._element);
      this._attachWindowEvents();
    } else if (event.animationName === 'close' && this._state === 'closing') {
      this._state = 'closed';
      this._dialog.firstElementChild.scrollTo(0, 0);

      const elementToFocus = this._nextFocusedElement?.matches(IS_FOCUSABLE_QUERY)
        ? this._nextFocusedElement
        : this._triggerElement;

      // Set focus origin to element which should receive focus
      if (elementToFocus && this._closedByFocusOrigin !== null) {
        elementToFocus.addEventListener(
          'focus',
          () => {
            (elementToFocus.dataset.focusOrigin as SbbFocusOrigin) = this._closedByFocusOrigin;
            elementToFocus.addEventListener(
              'blur',
              () => delete elementToFocus.dataset.focusOrigin,
              { once: true }
            );
          },
          { once: true }
        );
      }
      this._dialog.close();
      // To enable focusing other element than the trigger, we need to call focus() a second time.
      elementToFocus?.focus();
      this.didClose.emit({ closeTarget: this._tooltipCloseElement });
      this._windowEventsController?.abort();
      this._focusTrap.disconnect();
    }
  }

  // Set focus on the first focusable element.
  private _setTooltipFocus(): void {
    this._firstFocusable =
      this._element.shadowRoot.querySelector('[sbb-tooltip-close]') ||
      this._element.querySelector(IS_FOCUSABLE_QUERY);

    if (this._openedByKeyboard) {
      this._firstFocusable?.focus();
    } else {
      // Focusing sbb-tooltip__content in order to provide a consistent behavior in Safari where else
      // the focus-visible styles would be incorrectly applied
      this._tooltipContentElement.tabIndex = 0;
      this._tooltipContentElement.focus();
      this._element.addEventListener(
        'blur',
        () => this._tooltipContentElement.removeAttribute('tabindex'),
        {
          once: true,
        }
      );
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

    this._element.style.setProperty('--sbb-tooltip-position-x', `${tooltipPosition.left}px`);
    this._element.style.setProperty('--sbb-tooltip-position-y', `${tooltipPosition.top}px`);
    this._element.style.setProperty('--sbb-tooltip-arrow-position-x', `${arrowXPosition}px`);
  }

  public render(): JSX.Element {
    const closeButton = (
      <span class="sbb-tooltip__close">
        <sbb-button
          aria-label={this.accessibilityCloseLabel || i18nCloseTooltip[this._currentLanguage]}
          variant="secondary"
          size="m"
          type="button"
          iconName="cross-small"
          sbb-tooltip-close
        ></sbb-button>
      </span>
    );

    return (
      <Host data-position={this._alignment?.vertical} ref={assignId(() => this._tooltipId)}>
        <div class="sbb-tooltip__container">
          <dialog
            onAnimationEnd={(event: AnimationEvent) => this._onTooltipAnimationEnd(event)}
            ref={(dialogRef) => (this._dialog = dialogRef)}
            class="sbb-tooltip"
          >
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            <div
              onClick={(event: Event) => this._closeOnSbbTooltipCloseClick(event)}
              ref={(tooltipContentRef) => (this._tooltipContentElement = tooltipContentRef)}
              class="sbb-tooltip__content"
            >
              <span>
                <slot>No content</slot>
              </span>
              {!this.hideCloseButton && !this._hoverTrigger && closeButton}
            </div>
          </dialog>
        </div>
      </Host>
    );
  }
}
