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
} from '@stencil/core';
import {
  createNamedSlotState,
  documentLanguage,
  HandlerRepository,
  languageChangeHandlerAspect,
  namedSlotChangeHandlerAspect,
  SbbOverlayState,
} from '../../global/helpers';
import { AriaPoliteness, ToastAriaRole, ToastPosition } from './sbb-toast.custom';
// import { isFirefox } from '../../global/helpers/platform';
import { i18nCloseDialog } from '../../global/i18n';

/**
 * @slot unnamed - Use this to document a slot.
 */
@Component({
  shadow: true,
  styleUrl: 'sbb-toast.scss',
  tag: 'sbb-toast',
})
export class SbbToast implements ComponentInterface {
  /** The length of time in milliseconds to wait before automatically dismissing the toast. */
  @Prop() public timeout = 6000;

  /**
   * The icon name we want to use, choose from the small icon variants from the ui-icons category from here
   * https://lyne.sbb.ch/tokens/icons/.
   */
  @Prop() public iconName?: string;

  /** The position where to place the toast. */
  @Prop({ reflect: true }) public position: ToastPosition = 'bottom-center';

  /** Whether the toast has a close button. */
  @Prop() public dismissible = false;

  /**
   * The ARIA politeness level.
   * Check https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions#live_regions for further info
   */
  @Prop() public politeness: AriaPoliteness = 'assertive';

  /** Whether the animation is disabled. */
  @Prop({ reflect: true }) public disableAnimation = false;

  /** The state of the autocomplete. */
  @State() private _state: SbbOverlayState = 'closed';

  @State() private _namedSlots = createNamedSlotState('icon', 'action');

  @State() private _currentLanguage = documentLanguage();

  /** Emits whenever the autocomplete starts the opening transition. */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'will-open',
  })
  public willOpen: EventEmitter<void>;

  /** Emits whenever the autocomplete is opened. */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'did-open',
  })
  public didOpen: EventEmitter<void>;

  /** Emits whenever the autocomplete begins the closing transition. */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'will-close',
  })
  public willClose: EventEmitter<void>;

  /** Emits whenever the autocomplete is closed. */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'did-close',
  })
  public didClose: EventEmitter<void>;

  @Element() private _element!: HTMLElement;

  private _handlerRepository = new HandlerRepository(
    this._element,
    languageChangeHandlerAspect((l) => (this._currentLanguage = l)),
    namedSlotChangeHandlerAspect((m) => (this._namedSlots = m(this._namedSlots)))
  );

  private _closeTimeout: ReturnType<typeof setTimeout>;

  /**
   * Role of the live region. This is only for Firefox as there is a known issue where Firefox +
   * JAWS does not read out aria-live message.
   */
  private get _role(): ToastAriaRole {
    // if (!isFirefox()) {
    //   return;
    // }

    if (this.politeness === 'polite') {
      return 'status';
    } else if (this.politeness === 'assertive') {
      return 'alert';
    }
  }

  /**
   * Open the toast.
   * If there are other opened toasts in the page, close them first.
   */
  @Method() public async open(): Promise<void> {
    if (this._state !== 'closed') {
      return;
    }

    this._closeOtherToasts();

    this._state = 'opening';
    this.willOpen.emit();
  }

  /**
   * Close the toast.
   */
  @Method() public async close(): Promise<void> {
    if (this._state !== 'opened') {
      return;
    }

    clearTimeout(this._closeTimeout);

    this._state = 'closing';
    this.willClose.emit();
  }

  @Method() public async getState(): Promise<SbbOverlayState> {
    return this._state;
  }

  public connectedCallback(): void {
    this._handlerRepository.connect();
  }

  public disconnectedCallback(): void {
    clearTimeout(this._closeTimeout);
    this._handlerRepository.disconnect();
  }

  private _onActionSlotChange(event: Event): void {
    const slotNodes = (event.target as HTMLSlotElement).assignedNodes();

    // Force the visual state on slotted buttons
    slotNodes
      .filter((el) => el.nodeName === 'SBB-BUTTON')
      .forEach((btn: HTMLSbbButtonElement) => {
        btn.variant = 'transparent';
        btn.negative = true;
        btn.size = 'm';
      });

    // Force the visual state on slotted links
    slotNodes
      .filter((el) => el.nodeName === 'SBB-LINK')
      .forEach((link: HTMLSbbLinkElement) => {
        link.variant = 'inline';
        link.negative = true;
      });
  }

  private _onToastAnimationEnd(event: AnimationEvent): void {
    // On toast opened
    if (event.animationName === 'open') {
      this._state = 'opened';
      this.didOpen.emit();

      // Start the countdown to close it
      if (this.timeout) {
        this._closeTimeout = setTimeout(() => this.close(), this.timeout);
      }
    }

    // On toast closed
    if (event.animationName === 'close') {
      this._state = 'closed';
      this.didClose.emit();
    }
  }

  /**
   * Since we do not stack toasts, we force the closing on other existing opened toasts
   */
  private async _closeOtherToasts(): Promise<void> {
    document.querySelectorAll('sbb-toast').forEach(async (t) => {
      if ((await t.getState()) === 'opened') {
        t.close();
      }
    });
  }

  public render(): JSX.Element {
    return (
      <Host
        data-state={this._state}
        data-has-icon={this._namedSlots['icon'] || !!this.iconName}
        data-has-action={this._namedSlots['action'] || this.dismissible}
        aria-live={this.politeness}
        role={this._role}
      >
        <div class="sbb-toast__overlay-container">
          <div
            class="sbb-toast"
            onAnimationEnd={(event: AnimationEvent) => this._onToastAnimationEnd(event)}
          >
            <div class="sbb-toast__icon">
              <slot name="icon">{this.iconName && <sbb-icon name={this.iconName} />}</slot>
            </div>

            <div class="sbb-toast__content">
              <slot />
            </div>

            <div class="sbb-toast__action">
              <slot name="action" onSlotchange={(event) => this._onActionSlotChange(event)}>
                {this.dismissible && (
                  <sbb-button
                    class="sbb-toast__action-button"
                    icon-name="cross-small"
                    variant="transparent"
                    negative={true}
                    size="m"
                    aria-label={i18nCloseDialog[this._currentLanguage]}
                    onClick={() => this.close()}
                  ></sbb-button>
                )}
              </slot>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
