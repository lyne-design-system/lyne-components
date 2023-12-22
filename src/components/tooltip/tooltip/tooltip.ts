import { CSSResultGroup, LitElement, PropertyValues, TemplateResult, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import {
  FocusTrap,
  IS_FOCUSABLE_QUERY,
  assignId,
  getFirstFocusableElement,
  setModalityOnNextFocus,
} from '../../core/a11y';
import { LanguageController } from '../../core/common-behaviors';
import { findReferencedElement, isValidAttribute, setAttribute } from '../../core/dom';
import { EventEmitter, composedPathHasAttribute } from '../../core/eventing';
import { i18nCloseTooltip } from '../../core/i18n';
import {
  Alignment,
  SbbOverlayState,
  getElementPosition,
  isEventOnElement,
  removeAriaOverlayTriggerAttributes,
  setAriaOverlayTriggerAttributes,
} from '../../core/overlay';
import '../../button';

import style from './tooltip.scss?lit&inline';

const VERTICAL_OFFSET = 16;
const HORIZONTAL_OFFSET = 32;

let nextId = 0;

const tooltipsRef = new Set<SbbTooltipElement>();

/**
 * It displays contextual information within a tooltip.
 *
 * @slot - Use the unnamed slot to add content into the tooltip.
 * @event {CustomEvent<void>} willOpen - Emits whenever the `sbb-tooltip` starts the opening transition. Can be canceled.
 * @event {CustomEvent<void>} didOpen - Emits whenever the `sbb-tooltip` is opened.
 * @event {CustomEvent<{ closeTarget: HTMLElement }>} willClose - Emits whenever the `sbb-tooltip` begins the closing transition. Can be canceled.
 * @event {CustomEvent<{ closeTarget: HTMLElement }>} didClose - Emits whenever the `sbb-tooltip` is closed.
 */
@customElement('sbb-tooltip')
export class SbbTooltipElement extends LitElement {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    willOpen: 'willOpen',
    didOpen: 'didOpen',
    willClose: 'willClose',
    didClose: 'didClose',
  } as const;

  /**
   * The element that will trigger the tooltip overlay.
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
  @property({ attribute: 'open-delay', type: Number }) public openDelay? = 0;

  /**
   * Close the tooltip after a certain delay.
   */
  @property({ attribute: 'close-delay', type: Number }) public closeDelay? = 0;

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
    if (!this.dataset) {
      return;
    }
    this.dataset.state = state;
  }
  private get _state(): SbbOverlayState {
    return this.dataset.state as SbbOverlayState;
  }

  /**
   * The alignment of the tooltip relative to the trigger.
   */
  @state() private _alignment: Alignment;

  /** Emits whenever the `sbb-tooltip` starts the opening transition. */
  private _willOpen: EventEmitter<void> = new EventEmitter(this, SbbTooltipElement.events.willOpen);

  /** Emits whenever the `sbb-tooltip` is opened. */
  private _didOpen: EventEmitter<void> = new EventEmitter(this, SbbTooltipElement.events.didOpen);

  /** Emits whenever the `sbb-tooltip` begins the closing transition. */
  private _willClose: EventEmitter<{ closeTarget: HTMLElement }> = new EventEmitter(
    this,
    SbbTooltipElement.events.willClose,
  );

  /** Emits whenever the `sbb-tooltip` is closed. */
  private _didClose: EventEmitter<{ closeTarget: HTMLElement }> = new EventEmitter(
    this,
    SbbTooltipElement.events.didClose,
  );

  private _overlay: HTMLDivElement;
  private _triggerElement: HTMLElement;
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
  private _language = new LanguageController(this);

  /**
   * Opens the tooltip on trigger click.
   */
  public open(): void {
    if ((this._state !== 'closed' && this._state !== 'closing') || !this._overlay) {
      return;
    }

    if (!this._willOpen.emit()) {
      return;
    }

    // Close the other tooltips
    for (const tooltip of Array.from(tooltipsRef)) {
      const state = tooltip.getAttribute('data-state') as SbbOverlayState;
      if (state && (state === 'opened' || state === 'opening')) {
        tooltip.close();
      }
    }

    this._state = 'opening';
    this.inert = true;
    this._setTooltipPosition();
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
    if (!this._willClose.emit({ closeTarget: target })) {
      return;
    }

    this._state = 'closing';
    this.inert = true;
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
    // Validate trigger element and attach event listeners
    this._configure(this.trigger);
    this._state = 'closed';
    tooltipsRef.add(this as SbbTooltipElement);
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('trigger')) {
      this._removeTriggerClickListener(this.trigger, changedProperties.get('trigger'));
    }
  }

  protected override firstUpdated(): void {
    if (this._hoverTrigger) {
      this._overlay.addEventListener('mouseenter', () => this._onOverlayMouseEnter());
      this._overlay.addEventListener('mouseleave', () => this._onOverlayMouseLeave());
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._tooltipController?.abort();
    this._windowEventsController?.abort();
    this._focusTrap.disconnect();
    tooltipsRef.delete(this as SbbTooltipElement);
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

    this._tooltipController?.abort();
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
        (evt: KeyboardEvent) => {
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
    this._isPointerDownEventOnTooltip = isEventOnElement(this._overlay, event);
  };

  // Close tooltip on backdrop click.
  private _closeOnBackdropClick = (event: PointerEvent): void => {
    if (!this._isPointerDownEventOnTooltip && !isEventOnElement(this._overlay, event)) {
      this._nextFocusedElement = event
        .composedPath()
        .filter((el) => el instanceof window.HTMLElement)
        .find((el) => (el as HTMLElement).matches(IS_FOCUSABLE_QUERY)) as HTMLElement;
      clearTimeout(this._closeTimeout);
      this.close();
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

  private _onOverlayMouseEnter = (): void => {
    if (this._state !== 'opening') {
      clearTimeout(this._closeTimeout);
    }
  };

  private _onOverlayMouseLeave = (): void => {
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
      this.inert = false;
      this._setTooltipFocus();
      this._focusTrap.trap(this);
      this._attachWindowEvents();
    } else if (event.animationName === 'close' && this._state === 'closing') {
      this._state = 'closed';
      this._overlay.firstElementChild.scrollTo(0, 0);

      const elementToFocus = this._nextFocusedElement || this._triggerElement;

      setModalityOnNextFocus(elementToFocus);
      // To enable focusing other element than the trigger, we need to call focus() a second time.
      elementToFocus?.focus();
      this._didClose.emit({ closeTarget: this._tooltipCloseElement });
      this._windowEventsController?.abort();
      this._focusTrap.disconnect();
    }
  }

  // Set focus on the first focusable element.
  private _setTooltipFocus(): void {
    const firstFocusable =
      (this.shadowRoot.querySelector('[sbb-tooltip-close]') as HTMLElement) ||
      getFirstFocusableElement(
        Array.from(this.children).filter((e): e is HTMLElement => e instanceof window.HTMLElement),
      );
    if (firstFocusable) {
      setModalityOnNextFocus(firstFocusable);
      firstFocusable.focus();
    }
  }

  private _setTooltipPosition(): void {
    if (!this._overlay || !this._triggerElement) {
      return;
    }

    const tooltipPosition = getElementPosition(
      this._overlay,
      this._triggerElement,
      this.shadowRoot.querySelector('.sbb-tooltip__container'),
      {
        verticalOffset: VERTICAL_OFFSET,
        horizontalOffset: HORIZONTAL_OFFSET,
        centered: true,
        responsiveHeight: true,
      },
    );

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
          aria-label=${this.accessibilityCloseLabel || i18nCloseTooltip[this._language.current]}
          variant="secondary"
          size="m"
          type="button"
          icon-name="cross-small"
          sbb-tooltip-close
        ></sbb-button>
      </span>
    `;

    setAttribute(this, 'data-position', this._alignment?.vertical);
    setAttribute(this, 'role', 'tooltip');
    assignId(() => this._tooltipId)(this);

    return html`
      <div class="sbb-tooltip__container">
        <div
          @animationend=${(event: AnimationEvent) => this._onTooltipAnimationEnd(event)}
          class="sbb-tooltip"
          popover="manual"
          ${ref((el) => (this._overlay = el as HTMLDivElement))}
        >
          <div
            @click=${(event: Event) => this._closeOnSbbTooltipCloseClick(event)}
            class="sbb-tooltip__content"
          >
            <span>
              <slot>No content</slot>
            </span>
            ${!this.hideCloseButton && !this._hoverTrigger ? closeButton : nothing}
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-tooltip': SbbTooltipElement;
  }
}
