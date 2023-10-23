import { TitleLevel } from '../sbb-title';
import { i18nCloseNotification } from '../../global/i18n';
import {
  createNamedSlotState,
  documentLanguage,
  HandlerRepository,
  languageChangeHandlerAspect,
  namedSlotChangeHandlerAspect,
  EventEmitter,
} from '../../global/eventing';
import { AgnosticResizeObserver } from '../../global/observers';
import { InterfaceNotificationAttributes } from './sbb-notification.custom';
import { toggleDatasetEntry } from '../../global/dom';
import { CSSResult, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { setAttribute } from '../../global/dom';
import { ref } from 'lit/directives/ref.js';
import Style from './sbb-notification.scss?lit&inline';
import '../sbb-title';

const notificationTypes = new Map([
  ['info', 'circle-information-small'],
  ['success', 'circle-tick-small'],
  ['warn', 'circle-exclamation-point-small'],
  ['error', 'circle-cross-small'],
]);

/**
 * @slot title - Use this to provide a notification title (optional).
 * @slot unnamed - Use this to provide the notification message.
 */
@customElement('sbb-notification')
export class SbbNotification extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    willOpen: 'will-open',
    didOpen: 'did-open',
    willClose: 'will-close',
    didClose: 'did-close',
  };

  /**
   * The type of the notification.
   */
  @property({ reflect: true }) public type?: InterfaceNotificationAttributes['type'] = 'info';

  /**
   * Content of title.
   */
  @property({ attribute: 'title-content' }) public titleContent?: string;

  /**
   * Level of title, it will be rendered as heading tag (e.g. h3). Defaults to level 3.
   */
  @property({ attribute: 'title-level' }) public titleLevel: TitleLevel = '3';

  /**
   * Whether the notification is readonly.
   * In readonly mode, there is no dismiss button offered to the user.
   */
  @property({ reflect: true, type: Boolean }) public readonly = false;

  /**
   * Whether the animation is enabled.
   */
  @property({ attribute: 'disable-animation', reflect: true, type: Boolean })
  public disableAnimation = false;

  /**
   * State of listed named slots, by indicating whether any element for a named slot is defined.
   */
  @state() private _namedSlots = createNamedSlotState('title');

  /**
   * The state of the notification.
   */
  @state() private _state: 'closed' | 'opening' | 'opened' | 'closing' = 'opened';

  @state() private _currentLanguage = documentLanguage();

  private _notificationElement: HTMLElement;
  private _resizeObserverTimeout: ReturnType<typeof setTimeout> | null = null;
  private _notificationResizeObserver = new AgnosticResizeObserver(() =>
    this._onNotificationResize(),
  );

  /**
   * Emits whenever the notification starts the opening transition.
   */
  private _willOpen: EventEmitter<void> = new EventEmitter(this, SbbNotification.events.willOpen);

  /**
   * Emits whenever the notification is opened.
   */
  private _didOpen: EventEmitter<void> = new EventEmitter(this, SbbNotification.events.didOpen);

  /**
   * Emits whenever the notification begins the closing transition.
   */
  private _willClose: EventEmitter<void> = new EventEmitter(this, SbbNotification.events.willClose);

  /**
   * Emits whenever the notification is closed.
   */
  private _didClose: EventEmitter<void> = new EventEmitter(this, SbbNotification.events.didClose);

  public close(): void {
    if (this._state === 'opened') {
      this._state = 'closing';
      this._willClose.emit();
      this.disableAnimation && this._handleClosing();
    }
  }

  private _handlerRepository = new HandlerRepository(
    this,
    languageChangeHandlerAspect((l) => (this._currentLanguage = l)),
    namedSlotChangeHandlerAspect((m) => (this._namedSlots = m(this._namedSlots))),
  );

  public override connectedCallback(): void {
    super.connectedCallback();
    this._handlerRepository.connect();
    this._setInlineLinks();
  }

  protected override firstUpdated(): void {
    this._willOpen.emit();
    this._setNotificationHeight();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._handlerRepository.disconnect();
    this._notificationResizeObserver.disconnect();
  }

  private _setInlineLinks(): void {
    this.querySelectorAll('sbb-link')?.forEach((link) => (link.variant = 'inline'));
  }

  private _setNotificationHeight(): void {
    const notificationHeight =
      this._notificationElement.scrollHeight && !this.disableAnimation
        ? `${this._notificationElement.scrollHeight}px`
        : 'auto';
    this.style.setProperty('--sbb-notification-height', notificationHeight);
  }

  private _onNotificationResize(): void {
    if (this._state !== 'opened') {
      return;
    }

    clearTimeout(this._resizeObserverTimeout);

    toggleDatasetEntry(this, 'resizeDisableAnimation', true);
    this._setNotificationHeight();

    // Disable the animation when resizing the notification to avoid strange height transition effects.
    this._resizeObserverTimeout = setTimeout(
      () => toggleDatasetEntry(this, 'resizeDisableAnimation', false),
      150,
    );
  }

  private _onNotificationTransitionEnd(event: TransitionEvent): void {
    if (this._state === 'closing' && event.propertyName === 'max-height') {
      this._handleClosing();
    }
  }

  private _onNotificationAnimationEnd(event: AnimationEvent): void {
    if (this._state === 'opened' && event.animationName === 'open') {
      this._handleOpening();
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
    this.remove();
  }

  protected override render(): TemplateResult {
    const hasTitle = !!this.titleContent || this._namedSlots['title'];

    setAttribute(this, 'data-state', this._state);
    setAttribute(this, 'data-has-title', hasTitle);

    return html`
      <div
        class="sbb-notification__wrapper"
        ${ref((el) => (this._notificationElement = el as HTMLElement))}
        @transitionend=${(event: TransitionEvent) => this._onNotificationTransitionEnd(event)}
        @animationend=${(event: AnimationEvent) => this._onNotificationAnimationEnd(event)}
      >
        <div class="sbb-notification">
          <sbb-icon
            class="sbb-notification__icon"
            name=${notificationTypes.get(this.type)}
          ></sbb-icon>

          <span class="sbb-notification__content">
            ${hasTitle
              ? html`<sbb-title
                  class="sbb-notification__title"
                  level=${this.titleLevel}
                  visual-level="5"
                >
                  <slot name="title">${this.titleContent}</slot>
                </sbb-title>`
              : nothing}
            <slot @slotchange=${() => this._setInlineLinks()}></slot>
          </span>

          ${!this.readonly
            ? html`<span class="sbb-notification__close-wrapper">
                <sbb-divider class="sbb-notification__divider" orientation="vertical"></sbb-divider>
                <sbb-button
                  variant="secondary"
                  size="m"
                  icon-name="cross-small"
                  @click=${() => this.close()}
                  aria-label=${i18nCloseNotification[this._currentLanguage]}
                  class="sbb-notification__close"
                ></sbb-button>
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
    'sbb-notification': SbbNotification;
  }
}
