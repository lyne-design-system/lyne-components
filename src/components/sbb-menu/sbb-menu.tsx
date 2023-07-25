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
  getElementPosition,
  isEventOnElement,
  removeAriaOverlayTriggerAttributes,
  SbbOverlayState,
  // setAriaOverlayTriggerAttributes,
} from '../../global/overlay';
import {
  assignId,
  FocusTrap,
  getNextElementIndex,
  IS_FOCUSABLE_QUERY,
  isArrowKeyPressed,
  sbbInputModalityDetector,
  setModalityOnNextFocus,
} from '../../global/a11y';
import { isBreakpoint, isValidAttribute, ScrollHandler } from '../../global/dom';

const MENU_OFFSET = 8;
const INTERACTIVE_ELEMENTS = ['A', 'BUTTON', 'SBB-BUTTON', 'SBB-LINK'];

let nextId = 0;

/**
 * @slot unnamed - Use this slot to project any content inside the dialog.
 */
@Component({
  shadow: true,
  styleUrl: 'sbb-menu.scss',
  tag: 'sbb-menu',
})
export class SbbMenu implements ComponentInterface {
  /**
   * The element that will trigger the menu dialog.
   * Accepts both a string (id of an element) or an HTML element.
   */
  @Prop() public trigger: string | HTMLElement;

  /**
   * Whether the animation is enabled.
   */
  @Prop({ reflect: true }) public disableAnimation = false;

  /**
   * This will be forwarded as aria-label to the inner list.
   * Used only if the menu automatically renders the actions inside as a list.
   */
  @Prop() public listAccessibilityLabel?: string;

  /**
   * The state of the menu.
   */
  @State() private _state: SbbOverlayState = 'closed';

  /** Sbb-Link elements */
  @State() private _actions: HTMLSbbMenuActionElement[];

  /**
   * Emits whenever the menu starts the opening transition.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'will-open',
  })
  public willOpen: EventEmitter<void>;

  /**
   * Emits whenever the menu is opened.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'did-open',
  })
  public didOpen: EventEmitter<void>;

  /**
   * Emits whenever the menu begins the closing transition.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'will-close',
  })
  public willClose: EventEmitter<void>;

  /**
   * Emits whenever the menu is closed.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'did-close',
  })
  public didClose: EventEmitter<void>;

  private _popover: any;
  private _triggerElement: HTMLElement;
  private _menuContentElement: HTMLElement;
  private _isPointerDownEventOnMenu: boolean;
  private _menuController: AbortController;
  private _windowEventsController: AbortController;
  private _focusTrap = new FocusTrap();
  private _scrollHandler = new ScrollHandler();
  private _menuId = `sbb-menu-${++nextId}`;

  @Element() private _element!: HTMLElement | any;

  /**
   * Opens the menu on trigger click.
   */
  @Method()
  public async open(): Promise<void> {
    if (this._state === 'closing' || !this._popover) {
      return;
    }

    this.willOpen.emit();
    this._state = 'opening';
    this._setMenuPosition();
    this._element.showPopover();
    this._triggerElement?.setAttribute('aria-expanded', 'true');

    // Starting from breakpoint medium, disable scroll
    if (!isBreakpoint('medium')) {
      this._scrollHandler.disableScroll();
    }
  }

  /**
   * Closes the menu.
   */
  @Method()
  public async close(): Promise<void> {
    if (this._state === 'opening') {
      return;
    }

    this.willClose.emit();
    this._state = 'closing';
    this._triggerElement?.setAttribute('aria-expanded', 'false');
  }

  /**
   * Handles click and checks if its target is an sbb-menu-action.
   */
  @Listen('click')
  public async onClick(event: Event): Promise<void> {
    const target = event.target as HTMLElement | undefined;
    if (target?.tagName === 'SBB-MENU-ACTION') {
      await this.close();
    }
  }

  @Listen('keydown')
  public handleKeyDown(evt: KeyboardEvent): void {
    if (!isArrowKeyPressed(evt)) {
      return;
    }
    evt.preventDefault();

    const enabledActions = Array.from(this._element.querySelectorAll('SBB-MENU-ACTION')).filter(
      (e: HTMLElement) => e.tabIndex === 0,
    );

    const current = enabledActions.findIndex((e: Element) => e === evt.target);
    const nextIndex = getNextElementIndex(evt, current, enabledActions.length);

    (enabledActions[nextIndex] as HTMLElement).focus();
  }

  // Closes the menu on "Esc" key pressed and traps focus within the menu.
  private async _onKeydownEvent(event: KeyboardEvent): Promise<void> {
    if (this._state !== 'opened') {
      return;
    }

    if (event.key === 'Escape') {
      await this.close();
      return;
    }
  }

  // Removes trigger click listener on trigger change.
  @Watch('trigger')
  public removeTriggerClickListener(
    newValue: string | HTMLElement,
    oldValue: string | HTMLElement,
  ): void {
    if (newValue !== oldValue) {
      this._menuController?.abort();
      this._windowEventsController?.abort();
      this._configure(this.trigger);
    }
  }

  public connectedCallback(): void {
    // Validate trigger element and attach event listeners
    this._configure(this.trigger);
    this._readActions();
  }

  public disconnectedCallback(): void {
    this._menuController?.abort();
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

    // setAriaOverlayTriggerAttributes(
    //   this._triggerElement,
    //   'menu',
    //   this._element.id || this._menuId,
    //   this._state,
    // );
    this._triggerElement.setAttribute('popovertarget', this._menuId);
    this._element.setAttribute('popover', '');

    this._menuController = new AbortController();
    this._triggerElement.addEventListener('click', () => this.open(), {
      signal: this._menuController.signal,
    });
  }

  private _attachWindowEvents(): void {
    this._windowEventsController = new AbortController();
    document.addEventListener('scroll', () => this._setMenuPosition(), {
      passive: true,
      signal: this._windowEventsController.signal,
    });
    window.addEventListener('resize', () => this._setMenuPosition(), {
      passive: true,
      signal: this._windowEventsController.signal,
    });
    window.addEventListener('keydown', (event: KeyboardEvent) => this._onKeydownEvent(event), {
      signal: this._windowEventsController.signal,
    });

    // Close menu on backdrop click
    window.addEventListener('pointerdown', this._pointerDownListener, {
      signal: this._windowEventsController.signal,
    });
    window.addEventListener('pointerup', this._closeOnBackdropClick, {
      signal: this._windowEventsController.signal,
    });
  }

  // Close menu at any click on an interactive element inside the <sbb-menu> that bubbles to the container.
  private async _closeOnInteractiveElementClick(event: Event): Promise<void> {
    const target = event.target as HTMLElement;
    if (INTERACTIVE_ELEMENTS.includes(target.nodeName) && !isValidAttribute(target, 'disabled')) {
      await this.close();
    }
  }

  // Check if the pointerdown event target is triggered on the menu.
  private _pointerDownListener = (event: PointerEvent): void => {
    this._isPointerDownEventOnMenu = isEventOnElement(this._popover, event);
  };

  // Close menu on backdrop click.
  private _closeOnBackdropClick = async (event: PointerEvent): Promise<void> => {
    if (!this._isPointerDownEventOnMenu && !isEventOnElement(this._popover, event)) {
      await this.close();
    }
  };

  // Set menu position (x, y) to '0' once the menu is closed and the transition ended to prevent the
  // viewport from overflowing. And set the focus to the first focusable element once the menu is open.
  // In rare cases it can be that the animationEnd event is triggered twice.
  // To avoid entering a corrupt state, exit when state is not expected.
  private _onMenuAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'open' && this._state === 'opening') {
      this._state = 'opened';
      this.didOpen.emit();
      this._setDialogFocus();
      this._focusTrap.trap(this._element);
      this._attachWindowEvents();
    } else if (event.animationName === 'close' && this._state === 'closing') {
      this._state = 'closed';
      this._popover.firstElementChild.scrollTo(0, 0);
      setModalityOnNextFocus(this._triggerElement);
      this._element.hidePopover();
      // Manually focus last focused element in order to avoid showing outline in Safari
      this._triggerElement?.focus({
        // When inside the sbb-header, we prevent the scroll to avoid the snapping to the top of the page
        preventScroll: this._triggerElement.tagName === 'SBB-HEADER-ACTION',
      });
      this.didClose.emit();
      this._windowEventsController?.abort();
      this._focusTrap.disconnect();

      // Starting from breakpoint medium, enable scroll
      this._scrollHandler.enableScroll();
    }
  }

  // Set focus on the first focusable element.
  private _setDialogFocus(): void {
    const firstFocusable = this._element.querySelector(IS_FOCUSABLE_QUERY) as HTMLElement;

    if (sbbInputModalityDetector.mostRecentModality === 'keyboard') {
      firstFocusable.focus();
    } else {
      // Focusing sbb-menu__content in order to provide a consistent behavior in Safari where else
      // the focus-visible styles would be incorrectly applied
      this._menuContentElement.tabIndex = 0;
      this._menuContentElement.focus();
      this._element.addEventListener(
        'blur',
        () => this._menuContentElement.removeAttribute('tabindex'),
        {
          once: true,
        },
      );
    }
  }

  // Set menu position and max height if the breakpoint is medium-ultra.
  private _setMenuPosition(): void {
    // Starting from breakpoint medium
    if (
      !isBreakpoint('medium') ||
      !this._popover ||
      !this._triggerElement ||
      this._state === 'closing'
    ) {
      return;
    }

    const menuPosition = getElementPosition(this._menuContentElement, this._triggerElement, {
      verticalOffset: MENU_OFFSET,
    });

    this._element.style.setProperty('--sbb-menu-position-x', `${menuPosition.left}px`);
    this._element.style.setProperty('--sbb-menu-position-y', `${menuPosition.top}px`);
    this._element.style.setProperty('--sbb-menu-max-height', menuPosition.maxHeight);
  }

  /**
   * Create an array with only the sbb-menu-action children
   */
  private _readActions(): void {
    const actions = Array.from(this._element.children);
    // If the slotted actions have not changed, we can skip syncing and updating the actions.
    if (
      this._actions &&
      actions.length === this._actions.length &&
      this._actions.every((e, i) => actions[i] === e)
    ) {
      return;
    }

    if (actions.every((e) => (e as any).tagName === 'SBB-MENU-ACTION')) {
      this._actions = actions as HTMLSbbMenuActionElement[];
    } else {
      this._actions?.forEach((a) => a.removeAttribute('slot'));
      this._actions = undefined;
    }
  }

  public render(): JSX.Element {
    if (this._actions) {
      this._actions.forEach((action, index) => action.setAttribute('slot', `action-${index}`));
    }

    return (
      <Host data-state={this._state} ref={assignId(() => this._menuId)}>
        <div class="sbb-menu__container" ref={(popoverRef) => (this._popover = popoverRef)}>
          <div
            onAnimationEnd={(event: AnimationEvent) => this._onMenuAnimationEnd(event)}
            class="sbb-menu"
            role="presentation"
          >
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            <div
              onClick={(event: Event) => this._closeOnInteractiveElementClick(event)}
              ref={(menuContentRef) => (this._menuContentElement = menuContentRef)}
              class="sbb-menu__content"
            >
              {this._actions ? (
                [
                  <ul class="sbb-menu-list" aria-label={this.listAccessibilityLabel}>
                    {this._actions.map((_, index) => (
                      <li>
                        <slot
                          name={`action-${index}`}
                          onSlotchange={(): void => this._readActions()}
                        />
                      </li>
                    ))}
                  </ul>,
                  <span hidden>
                    <slot onSlotchange={(): void => this._readActions()} />
                  </span>,
                ]
              ) : (
                <slot onSlotchange={(): void => this._readActions()} />
              )}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
