import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { getElementPosition } from '../../global/helpers/position';
import { isBreakpoint } from '../../global/helpers/breakpoint';

const MENU_OFFSET = 8;

const INTERACTIVE_COMPONENTS = ['SBB-BUTTON', 'SBB-LINK', 'SBB-MENU-ACTION'];

const IS_FOCUSABLE_QUERY = `
  button:not([disabled]),
  [href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  details:not([disabled]),
  summary:not(:disabled),
  [tabindex]:not([tabindex="-1"]):not([disabled]),
  sbb-button:not([disabled]),
  sbb-link:not([disabled]),
  sbb-menu-action:not([disabled])`;

/**
 * @slot unnamed - Use this slot to project any content inside the dialog.
 */
@Component({
  shadow: true,
  styleUrl: 'sbb-menu.scss',
  tag: 'sbb-menu',
})
export class SbbMenu implements ComponentInterface {
  @Element() public el!: HTMLElement;

  /**
   * The element that will trigger the menu dialog.
   * Accepts both a string (id of an element) or an HTML element.
   */
  @Prop() public trigger: string | HTMLElement;

  /**
   * Whether the menu is open.
   */
  @State() private _open = false;

  /**
   * Whether the menu is closing.
   */
  @State() private _isDismissing = false;

  /**
   * Emits whenever the menu starts the opening transition.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'sbb-menu_will-open',
  })
  public willOpen: EventEmitter<void>;

  /**
   * Emits whenever the menu is opened.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'sbb-menu_did-open',
  })
  public didOpen: EventEmitter<void>;

  /**
   * Emits whenever the menu begins the closing transition.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'sbb-menu_will-close',
  })
  public willClose: EventEmitter<void>;

  /**
   * Emits whenever the menu is closed.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'sbb-menu_did-close',
  })
  public didClose: EventEmitter<void>;

  /**
   * Opens the menu on trigger click.
   */
  @Method()
  public async openMenu(): Promise<void> {
    this.willOpen.emit();
    this._setMenuPosition();
    this._dialog.showModal();
  }

  /**
   * Closes the menu.
   */
  @Method()
  @Listen('sbb-menu-action_click')
  public async closeMenu(): Promise<void> {
    this.willClose.emit();
    this._isDismissing = true;
  }

  // Resets position on window resize.
  @Listen('resize', { target: 'window', passive: true })
  public onResizeWindowEvent(): void {
    if (this._open) {
      this._setMenuPosition();
    }
  }

  // Closes the menu on "Esc" key pressed.
  @Listen('keydown', { target: 'window' })
  public onEscAction(event: KeyboardEvent): void {
    if (this._open && event.key === 'Escape') {
      event.preventDefault();
      this.closeMenu();
    }
  }

  // Removes trigger click listener on trigger change.
  @Watch('trigger')
  public removeTriggerClickListener(
    newValue: string | HTMLElement,
    oldValue: string | HTMLElement
  ): void {
    if (newValue !== oldValue) {
      this._triggerController.abort();
    }
  }

  // Returns true if it is a DOM element.
  private static _isElement(o: string | HTMLElement): boolean {
    return o instanceof window.Element;
  }

  // TODO: improve dialog element type check (https://github.com/microsoft/TypeScript/issues/48267)
  private _dialog: HTMLDialogElement | any;

  // The element that triggers the open of the sbb-menu.
  private _triggerEl: HTMLElement;

  // Controller used to abort the open of the abb-menu on trigger change.
  private _triggerController: AbortController;

  public componentDidLoad(): void {
    this._dialog = this.el.shadowRoot.querySelector('dialog');

    // validate trigger element and attach click event
    this._configureTriggerElement(this.trigger);

    // close menu on interactive elements click
    this._dismissOnInteractiveElementClick();

    // close menu on backdrop click
    this._dismissOnBackdropClick();

    // listen for menu animation to end
    this._dialog.onanimationend = (event: AnimationEvent) => this._onMenuAnimationEnd(event);
  }

  // Check if the trigger is valid and attach click event listener.
  private _configureTriggerElement(trigger: string | HTMLElement): void {
    if (!trigger) {
      return;
    }

    // check whether it's a string or an HTMLElement
    if (typeof trigger === 'string') {
      this._triggerEl = document.getElementById(trigger);
    } else if (SbbMenu._isElement(trigger)) {
      this._triggerEl = trigger;
    }

    if (this._triggerEl) {
      this._triggerController = new AbortController();
      this._triggerEl.addEventListener('click', () => this.openMenu(), {
        signal: this._triggerController.signal,
      });
    }
  }

  // Close menu at any click on an interactive element inside the <sbb-menu> that bubbles to the container.
  private _dismissOnInteractiveElementClick(): void {
    // TODO: improve the query once "https://github.com/ionic-team/stencil/issues/3588" has been solved
    const interactiveElements = this.el.querySelectorAll('[href], button, sbb-button, sbb-link');
    interactiveElements.forEach((el: Element) => {
      if (!el.hasAttribute('disabled')) {
        el.addEventListener('click', () => this.closeMenu());
      }
    });
  }

  // Close menu on backdrop clicked.
  private _dismissOnBackdropClick(): void {
    this._dialog.addEventListener('click', (event: MouseEvent) => {
      const rect = this._dialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        this.closeMenu();
      }
    });
  }

  // Set menu position (x, y) to '0' once the menu is closed and the transition ended to prevent the
  // viewport from overflowing. And set the focus to the first focusable element once the menu is open.
  private _onMenuAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'show') {
      this._open = true;
      this.didOpen.emit();
      this._setDialogFocus();
    }

    if (event.animationName === 'hide') {
      this._isDismissing = false;
      this._open = false;
      this._dialog.scrollTo(0, 0);
      this._dialog.close();
      this.didClose.emit();
    }
  }

  // Set focus on the first focusable element.
  private _setDialogFocus(): void {
    const firstFocusable = Array.from(
      this.el.querySelectorAll(IS_FOCUSABLE_QUERY)
    )[0] as HTMLElement;
    if (INTERACTIVE_COMPONENTS.includes(firstFocusable.nodeName)) {
      (Array.from(this.el.querySelectorAll(IS_FOCUSABLE_QUERY))[0] as HTMLElement).focus();
    } else {
      firstFocusable.focus();
    }
  }

  // Set menu position and max height if the breakpoint is medium-ultra.
  private _setMenuPosition(): void {
    if (!isBreakpoint('medium') || !this._dialog || !this._triggerEl) {
      return;
    }

    const menuPosition = getElementPosition(this._dialog, this._triggerEl, {
      elementOffset: MENU_OFFSET,
    });

    this.el.style.setProperty('--sbb-menu-position-x', `${menuPosition.left}px`);
    this.el.style.setProperty('--sbb-menu-position-y', `${menuPosition.top}px`);
    this.el.style.setProperty('--sbb-menu-max-height', menuPosition.maxHeight);
  }

  public render(): JSX.Element {
    return (
      <dialog
        class={{
          'sbb-menu': true,
          'sbb-menu--open': this._open,
          'sbb-menu--dismissing': this._isDismissing,
        }}
      >
        <div class="sbb-menu__content">
          <slot></slot>
        </div>
      </dialog>
    );
  }
}
