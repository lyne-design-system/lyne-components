import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { SbbLanguageController } from '../core/controllers.js';
import { slotState } from '../core/decorators.js';
import { EventEmitter } from '../core/eventing.js';
import { i18nCloseNotification } from '../core/i18n.js';
import type { SbbOpenedClosedState } from '../core/interfaces.js';
import { AgnosticResizeObserver } from '../core/observers.js';
import type { SbbTitleLevel } from '../title.js';

import style from './notification.scss?lit&inline';

import '../button/secondary-button.js';
import '../divider.js';
import '../icon.js';
import '../title.js';

const notificationTypes = new Map([
  ['info', 'circle-information-small'],
  ['success', 'circle-tick-small'],
  ['warn', 'circle-exclamation-point-small'],
  ['error', 'circle-cross-small'],
]);

const DEBOUNCE_TIME = 150;

/**
 * It displays messages which require a user's attention without interrupting its tasks.
 *
 * @slot - Use the unnamed slot to add content to the notification message.
 * @slot title - Use this to provide a notification title (optional).
 * @event {CustomEvent<void>} willOpen - Emits whenever the `sbb-notification` starts the opening transition.
 * @event {CustomEvent<void>} didOpen - Emits whenever the `sbb-notification` is opened.
 * @event {CustomEvent<void>} willClose - Emits whenever the `sbb-notification` begins the closing transition.
 * @event {CustomEvent<void>} didClose - Emits whenever the `sbb-notification` is closed.
 * @cssprop [--sbb-notification-margin=0] - Can be used to modify the margin in order to get a smoother animation.
 * See style section for more information.
 */
@customElement('sbb-notification')
@slotState()
export class SbbNotificationElement extends LitElement {
  // FIXME inheriting from SbbOpenCloseBaseElement requires: https://github.com/open-wc/custom-elements-manifest/issues/253
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    willOpen: 'willOpen',
    didOpen: 'didOpen',
    willClose: 'willClose',
    didClose: 'didClose',
  } as const;

  /** The type of the notification. */
  @property({ reflect: true }) public type: 'info' | 'success' | 'warn' | 'error' = 'info';

  /** Content of title. */
  @property({ attribute: 'title-content', reflect: true }) public titleContent?: string;

  /** Level of title, it will be rendered as heading tag (e.g. h3). Defaults to level 3. */
  @property({ attribute: 'title-level' }) public titleLevel: SbbTitleLevel = '3';

  /**
   * Whether the notification is readonly.
   * In readonly mode, there is no dismiss button offered to the user.
   */
  @property({ reflect: true, type: Boolean }) public readonly = false;

  /** Size variant, either s or m. */
  @property({ reflect: true }) public size: 'm' | 's' = 'm';

  /** The enabled animations. */
  @property({ reflect: true }) public animation: 'open' | 'close' | 'all' | 'none' = 'all';

  /** The state of the notification. */
  private set _state(state: SbbOpenedClosedState) {
    this.setAttribute('data-state', state);
  }
  private get _state(): SbbOpenedClosedState {
    return this.getAttribute('data-state') as SbbOpenedClosedState;
  }

  private _notificationElement!: HTMLElement;
  private _resizeObserverTimeout: ReturnType<typeof setTimeout> | null = null;
  private _language = new SbbLanguageController(this);
  private _notificationResizeObserver = new AgnosticResizeObserver(() =>
    this._onNotificationResize(),
  );

  /** Emits whenever the `sbb-notification` starts the opening transition. */
  private _willOpen: EventEmitter<void> = new EventEmitter(
    this,
    SbbNotificationElement.events.willOpen,
  );

  /** Emits whenever the `sbb-notification` is opened. */
  private _didOpen: EventEmitter<void> = new EventEmitter(
    this,
    SbbNotificationElement.events.didOpen,
  );

  /** Emits whenever the `sbb-notification` begins the closing transition. */
  private _willClose: EventEmitter<void> = new EventEmitter(
    this,
    SbbNotificationElement.events.willClose,
  );

  /** Emits whenever the `sbb-notification` is closed. */
  private _didClose: EventEmitter<void> = new EventEmitter(
    this,
    SbbNotificationElement.events.didClose,
  );

  private _open(): void {
    if (this._state === 'closed') {
      this._state = 'opening';
      this._willOpen.emit();
    }
  }

  public close(): void {
    if (this._state === 'opened') {
      this._state = 'closing';
      this._willClose.emit();
    }
  }

  public override connectedCallback(): void {
    this._state ||= 'closed';

    super.connectedCallback();
  }

  protected override async firstUpdated(changedProperties: PropertyValues<this>): Promise<void> {
    super.firstUpdated(changedProperties);

    this._notificationElement = this.shadowRoot?.querySelector(
      '.sbb-notification__wrapper',
    ) as HTMLElement;
    // We need to wait for the component's `updateComplete` in order to set the correct
    // height to the notification element.
    await this.updateComplete;
    this._setNotificationHeight();
    this._open();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._notificationResizeObserver.disconnect();
  }

  private _setNotificationHeight(): void {
    if (!this._notificationElement?.scrollHeight) {
      return;
    }
    const notificationHeight = `${this._notificationElement.scrollHeight}px`;
    this.style.setProperty('--sbb-notification-height', notificationHeight);
  }

  private _onNotificationResize(): void {
    if (this._state !== 'opened') {
      return;
    }

    if (this._resizeObserverTimeout) {
      clearTimeout(this._resizeObserverTimeout);
    }

    // Disable the animation when resizing the notification to avoid strange height transition effects.
    this.toggleAttribute('data-resize-disable-animation', true);
    this._resizeObserverTimeout = setTimeout(
      () => this.removeAttribute('data-resize-disable-animation'),
      DEBOUNCE_TIME,
    );

    // To avoid ResizeObserver loops, we set the height a tick later.
    setTimeout(() => this._setNotificationHeight());
  }

  private _onNotificationAnimationEnd(event: AnimationEvent): void {
    if (this._state === 'opening' && event.animationName === 'open') {
      this._handleOpening();
    }

    if (this._state === 'closing' && event.animationName === 'close-height') {
      this._handleClosing();
    }
  }

  private _handleOpening(): void {
    this._state = 'opened';
    this._didOpen.emit();
    this._notificationResizeObserver.observe(this._notificationElement);
  }

  private _handleClosing(): void {
    this._state = 'closed';
    this._didClose.emit();
    this._notificationResizeObserver.unobserve(this._notificationElement);
    setTimeout(() => this.remove());
  }

  protected override render(): TemplateResult {
    return html`
      <div
        class="sbb-notification__wrapper"
        @animationend=${(event: AnimationEvent) => this._onNotificationAnimationEnd(event)}
      >
        <div class="sbb-notification">
          <sbb-icon
            class="sbb-notification__icon"
            name=${notificationTypes.get(this.type)!}
          ></sbb-icon>

          <span class="sbb-notification__content">
            <sbb-title
              class="sbb-notification__title"
              level=${this.titleLevel}
              visual-level=${this.size === 'm' ? '5' : '6'}
            >
              <slot name="title">${this.titleContent}</slot>
            </sbb-title>
            <slot></slot>
          </span>

          ${!this.readonly
            ? html`<span class="sbb-notification__close-wrapper">
                <sbb-divider class="sbb-notification__divider" orientation="vertical"></sbb-divider>
                <sbb-secondary-button
                  size=${this.size}
                  icon-name="cross-small"
                  @click=${() => this.close()}
                  aria-label=${i18nCloseNotification[this._language.current]}
                  class="sbb-notification__close"
                ></sbb-secondary-button>
              </span>`
            : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-notification': SbbNotificationElement;
  }
}
