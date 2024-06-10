import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { SbbTransparentButtonElement, SbbTransparentButtonLinkElement } from '../button.js';
import { SbbOpenCloseBaseElement } from '../core/base-elements.js';
import {
  SbbConnectedAbortController,
  SbbLanguageController,
  SbbSlotStateController,
} from '../core/controllers.js';
import { isFirefox } from '../core/dom.js';
import { composedPathHasAttribute } from '../core/eventing.js';
import { i18nCloseAlert } from '../core/i18n.js';
import { SbbIconNameMixin } from '../icon.js';
import type { SbbLinkButtonElement, SbbLinkElement, SbbLinkStaticElement } from '../link.js';
import '../button/transparent-button.js';

import style from './toast.scss?lit&inline';

type SbbToastPositionVertical = 'top' | 'bottom';
type SbbToastPositionHorizontal = 'left' | 'start' | 'center' | 'right' | 'end';
export type SbbToastPosition = `${SbbToastPositionVertical}-${SbbToastPositionHorizontal}`;

// A global collection of existing toasts
const toastRefs = new Set<SbbToastElement>();

/**
 * It displays a toast notification.
 *
 * @slot - Use the unnamed slot to add content to the `sbb-toast`.
 * @slot icon - Assign a custom icon via slot.
 * @slot action - Provide a custom action for this toast.
 * @event {CustomEvent<void>} willOpen - Emits whenever the `sbb-toast` starts the opening transition. Can be canceled.
 * @event {CustomEvent<void>} didOpen - Emits whenever the `sbb-toast` is opened.
 * @event {CustomEvent<void>} willClose - Emits whenever the `sbb-toast` begins the closing transition. Can be canceled.
 * @event {CustomEvent<void>} didClose - Emits whenever the `sbb-toast` is closed.
 * @cssprop [--sbb-toast-z-index=var(--sbb-overlay-default-z-index)] - To specify a custom stack order,
 * the `z-index` can be overridden by defining this CSS variable. The default `z-index` of the
 * component is set to `var(--sbb-overlay-default-z-index)` with a value of `1000`.
 */
@customElement('sbb-toast')
export class SbbToastElement extends SbbIconNameMixin(SbbOpenCloseBaseElement) {
  public static override styles: CSSResultGroup = style;

  /**
   * The length of time in milliseconds to wait before automatically dismissing the toast.
   * If 0, it stays open indefinitely.
   */
  @property({ type: Number }) public timeout = 6000;

  /** The position where to place the toast. */
  @property({ reflect: true }) public position: SbbToastPosition = 'bottom-center';

  /** Whether the toast has a close button. */
  @property({ type: Boolean, reflect: true }) public dismissible = false;

  /**
   * The ARIA politeness level.
   * Check https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions#live_regions for further info
   */
  @property() public politeness: 'polite' | 'assertive' | 'off' = 'polite';

  private _closeTimeout?: ReturnType<typeof setTimeout>;
  private _abort = new SbbConnectedAbortController(this);
  private _language = new SbbLanguageController(this);

  /**
   * Role of the live region. This is only for Firefox as there is a known issue where Firefox +
   * JAWS does not read out aria-live message.
   */
  private get _role(): 'status' | 'alert' | undefined {
    if (!isFirefox) {
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
    if (this.state !== 'closed') {
      return;
    }

    if (!this.willOpen.emit()) {
      return;
    }
    this.state = 'opening';
    this._closeOtherToasts();
  }

  /**
   * Close the toast.
   */
  public close(): void {
    if (this.state !== 'opened') {
      return;
    }

    if (!this.willClose.emit()) {
      return;
    }
    clearTimeout(this._closeTimeout);
    this.state = 'closing';
  }

  // Close the toast on click of any element that has the 'sbb-toast-close' attribute.
  private _onClick(event: Event): void {
    const closeElement = composedPathHasAttribute(event, 'sbb-toast-close', this);

    if (closeElement && !closeElement.hasAttribute('disabled')) {
      this.close();
    }
  }

  public constructor() {
    super();
    new SbbSlotStateController(this);
  }

  public override connectedCallback(): void {
    super.connectedCallback();

    const signal = this._abort.signal;
    this.addEventListener('click', (e) => this._onClick(e), { signal });

    // Add this toast to the global collection
    toastRefs.add(this);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._closeTimeout);

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
    const buttons: (SbbTransparentButtonElement | SbbTransparentButtonLinkElement)[] =
      slotNodes.filter(
        (el) =>
          el.nodeName === 'SBB-TRANSPARENT-BUTTON' || el.nodeName === 'SBB-TRANSPARENT-BUTTON-LINK',
      ) as (SbbTransparentButtonElement | SbbTransparentButtonLinkElement)[];
    buttons.forEach((btn: SbbTransparentButtonElement | SbbTransparentButtonLinkElement) => {
      btn.negative = true;
      btn.size = 'm';
    });

    // Force negative on inline slotted links
    const links = slotNodes.filter((el) =>
      ['SBB-LINK', 'SBB-LINK-BUTTON', 'SBB-LINK-STATIC'].includes(el.nodeName),
    ) as (SbbLinkElement | SbbLinkButtonElement | SbbLinkStaticElement)[];
    links.forEach((link) => {
      link.negative = true;
    });
  }

  // In rare cases it can be that the animationEnd event is triggered twice.
  // To avoid entering a corrupt state, exit when state is not expected.
  private _onToastAnimationEnd(event: AnimationEvent): void {
    // On toast opened
    if (event.animationName === 'open' && this.state === 'opening') {
      this.state = 'opened';
      this.didOpen.emit();

      // Start the countdown to close it
      if (this.timeout) {
        this._closeTimeout = setTimeout(() => this.close(), this.timeout);
      }
    }

    // On toast closed
    if (event.animationName === 'close' && this.state === 'closing') {
      this.state = 'closed';
      this.didClose.emit();
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
    return html`
      <div class="sbb-toast__overlay-container">
        <div
          class="sbb-toast"
          ${/* Firefox needs 'role' to enable screen readers */ ''}
          role=${this._role ?? nothing}
          @animationend=${this._onToastAnimationEnd}
        >
          <div class="sbb-toast__icon">${this.renderIconSlot()}</div>

          <div class="sbb-toast__content" aria-live=${this.politeness}>
            <slot @slotchange=${this._onContentSlotChange}></slot>
          </div>

          <div class="sbb-toast__action">
            <slot name="action" @slotchange=${this._onActionSlotChange}>
              ${this.dismissible
                ? html` <sbb-transparent-button
                    class="sbb-toast__action-button"
                    icon-name="cross-small"
                    negative
                    size="m"
                    aria-label=${i18nCloseAlert[this._language.current]}
                    sbb-toast-close
                  ></sbb-transparent-button>`
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
    'sbb-toast': SbbToastElement;
  }
}
