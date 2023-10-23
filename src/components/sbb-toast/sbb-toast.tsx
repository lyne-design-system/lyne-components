import { isFirefox, isValidAttribute } from '../../global/dom';
import {
  createNamedSlotState,
  documentLanguage,
  HandlerRepository,
  languageChangeHandlerAspect,
  namedSlotChangeHandlerAspect,
  composedPathHasAttribute,
  EventEmitter,
  ConnectedAbortController,
} from '../../global/eventing';
import { i18nCloseAlert } from '../../global/i18n';
import { SbbToastPosition, SbbToastAriaPoliteness, SbbToastAriaRole } from './sbb-toast.custom';
import { CSSResult, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { setAttribute } from '../../global/dom';
import Style from './sbb-toast.scss?lit&inline';
import { SbbOverlayState } from '../../global/overlay';
import { SbbButton } from '../sbb-button';
import { SbbLink } from '../sbb-link';
import '../sbb-link';
import '../sbb-button';

// A global collection of existing toasts
const toastRefs = new Set<SbbToast>();

/**
 * @slot unnamed - Use this to document a slot.
 */
@customElement('sbb-toast')
export class SbbToast extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    willOpen: 'will-open',
    didOpen: 'did-open',
    willClose: 'will-close',
    didClose: 'did-close',
  };

  /**
   * The length of time in milliseconds to wait before automatically dismissing the toast.
   * If 0, it stays open indefinitely.
   */
  @property({ type: Number }) public timeout = 6000;

  /**
   * The name of the icon, choose from the small icon variants
   * from the ui-icons category from here
   * https://icons.app.sbb.ch.
   */
  @property({ attribute: 'icon-name' }) public iconName?: string;

  /** The position where to place the toast. */
  @property({ reflect: true }) public position: SbbToastPosition = 'bottom-center';

  /** Whether the toast has a close button. */
  @property({ type: Boolean }) public dismissible = false;

  /**
   * The ARIA politeness level.
   * Check https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions#live_regions for further info
   */
  @property() public politeness: SbbToastAriaPoliteness = 'polite';

  /** Whether the animation is disabled. */
  @property({ attribute: 'disable-animation', reflect: true, type: Boolean })
  public disableAnimation = false;

  /** The state of the autocomplete. */
  @state() private _state: SbbOverlayState = 'closed';

  @state() private _namedSlots = createNamedSlotState('icon', 'action');

  @state() private _currentLanguage = documentLanguage();

  /** Emits whenever the autocomplete starts the opening transition. */

  private _willOpen: EventEmitter<void> = new EventEmitter(this, SbbToast.events.willOpen, {
    bubbles: true,
    composed: true,
  });

  /** Emits whenever the autocomplete is opened. */

  private _didOpen: EventEmitter<void> = new EventEmitter(this, SbbToast.events.didOpen, {
    bubbles: true,
    composed: true,
  });

  /** Emits whenever the autocomplete begins the closing transition. */

  private _willClose: EventEmitter<void> = new EventEmitter(this, SbbToast.events.willClose, {
    bubbles: true,
    composed: true,
  });

  /** Emits whenever the autocomplete is closed. */

  private _didClose: EventEmitter<void> = new EventEmitter(this, SbbToast.events.didClose, {
    bubbles: true,
    composed: true,
  });

  private _handlerRepository = new HandlerRepository(
    this,
    languageChangeHandlerAspect((l) => (this._currentLanguage = l)),
    namedSlotChangeHandlerAspect((m) => (this._namedSlots = m(this._namedSlots))),
  );

  private _closeTimeout: ReturnType<typeof setTimeout>;
  private _abort = new ConnectedAbortController(this);

  /**
   * Role of the live region. This is only for Firefox as there is a known issue where Firefox +
   * JAWS does not read out aria-live message.
   */
  private get _role(): SbbToastAriaRole {
    if (!isFirefox()) {
      return;
    }

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
  public open(): void {
    if (this._state !== 'closed') {
      return;
    }

    this._closeOtherToasts();

    this._state = 'opening';
    this._willOpen.emit();
  }

  /**
   * Close the toast.
   */
  public close(): void {
    if (this._state !== 'opened') {
      return;
    }

    clearTimeout(this._closeTimeout);

    this._state = 'closing';
    this._willClose.emit();
  }

  // Close the tooltip on click of any element that has the 'sbb-toast-close' attribute.
  private _onClick(event: Event): void {
    const closeElement = composedPathHasAttribute(event, 'sbb-toast-close', this);

    if (closeElement && !isValidAttribute(closeElement, 'disabled')) {
      this.close();
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('click', (e) => this._onClick(e), { signal });
    this._handlerRepository.connect();

    // Add this toast to the global collection
    toastRefs.add(this);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._closeTimeout);
    this._handlerRepository.disconnect();

    // Remove this instance
    toastRefs.delete(this);
  }

  /**
   * Slotted text nodes are not read correctly by screen readers on Chrome.
   * To address the problem, if there is at least a root text node,
   * we wrap the whole content in a <span> tag
   */
  private _onContentSlotChange(event: Event): void {
    const slotNodes = (event.target as HTMLSlotElement).assignedNodes();

    if (slotNodes.some((el) => el.nodeType === Node.TEXT_NODE)) {
      const span = document.createElement('span');
      this.appendChild(span);
      span.append(...slotNodes);
    }
  }

  private _onActionSlotChange(event: Event): void {
    const slotNodes = (event.target as HTMLSlotElement).assignedNodes();

    // Force the visual state on slotted buttons
    slotNodes
      .filter((el) => el.nodeName === 'SBB-BUTTON')
      .forEach((btn: SbbButton) => {
        btn.variant = 'transparent';
        btn.negative = true;
        btn.size = 'm';
      });

    // Force the visual state on slotted links
    slotNodes
      .filter((el) => el.nodeName === 'SBB-LINK')
      .forEach((link: SbbLink) => {
        link.variant = 'inline';
        link.negative = true;
      });
  }

  // In rare cases it can be that the animationEnd event is triggered twice.
  // To avoid entering a corrupt state, exit when state is not expected.
  private _onToastAnimationEnd(event: AnimationEvent): void {
    // On toast opened
    if (event.animationName === 'open' && this._state === 'opening') {
      this._state = 'opened';
      this._didOpen.emit();

      // Start the countdown to close it
      if (this.timeout) {
        this._closeTimeout = setTimeout(() => this.close(), this.timeout);
      }
    }

    // On toast closed
    if (event.animationName === 'close' && this._state === 'closing') {
      this._state = 'closed';
      this._didClose.emit();
    }
  }

  /**
   * Since we do not stack toasts, we force the closing on other existing opened ones
   */
  private _closeOtherToasts(): void {
    toastRefs.forEach((t) => {
      if (t.getAttribute('data-state') === 'opened') {
        t.close();
      }
    });
  }

  protected override render(): TemplateResult {
    // ## Host attributes ##
    setAttribute(this, 'data-state', this._state);
    setAttribute(this, 'data-has-icon', this._namedSlots['icon'] || !!this.iconName);
    setAttribute(this, 'data-has-action', this._namedSlots['action'] || this.dismissible);
    // ####

    return html`
      <div class="sbb-toast__overlay-container">
        <div
          class="sbb-toast"
          ${/* Firefox needs 'role' to enable screen readers */ ''}
          role=${this._role ?? nothing}
          @animationend=${this._onToastAnimationEnd}
        >
          <div class="sbb-toast__icon">
            <slot name="icon">
              ${this.iconName ? html`<sbb-icon name=${this.iconName} />` : nothing}
            </slot>
          </div>

          <div class="sbb-toast__content" aria-live=${this.politeness}>
            <slot @slotchange=${this._onContentSlotChange}></slot>
          </div>

          <div class="sbb-toast__action">
            <slot name="action" @slotchange=${this._onActionSlotChange}>
              ${this.dismissible
                ? html` <sbb-button
                    class="sbb-toast__action-button"
                    icon-name="cross-small"
                    variant="transparent"
                    negative
                    size="m"
                    aria-label=${i18nCloseAlert[this._currentLanguage]}
                    sbb-toast-close
                  ></sbb-button>`
                : nothing}
            </slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-toast': SbbToast;
  }
}
