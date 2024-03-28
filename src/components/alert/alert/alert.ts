import { spread } from '@open-wc/lit-helpers';
import { type CSSResultGroup, html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { LanguageController, type LinkTargetType } from '../../core/common-behaviors';
import { EventEmitter } from '../../core/eventing';
import { i18nCloseAlert, i18nFindOutMore } from '../../core/i18n';
import { SbbIconNameMixin } from '../../icon';
import type { SbbTitleLevel } from '../../title';

import style from './alert.scss?lit&inline';

import '../../button/transparent-button';
import '../../divider';
import '../../link';
import '../../title';

export type SbbAlertState = 'closed' | 'opening' | 'opened';

/**
 * It displays messages which require user's attention.
 *
 * @slot - Use the unnamed slot to add content to the `sbb-alert`.
 * @slot icon - Should be a `sbb-icon` which is displayed next to the title. Styling is optimized for icons of type HIM-CUS.
 * @slot title - Title content.
 * @event {CustomEvent<void>} willOpen - Emits when the fade in animation starts.
 * @event {CustomEvent<void>} didOpen - Emits when the fade in animation ends and the button is displayed.
 * @event {CustomEvent<void>} dismissalRequested - Emits when dismissal of an alert was requested.
 */
@customElement('sbb-alert')
export class SbbAlertElement extends SbbIconNameMixin(LitElement) {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    willOpen: 'willOpen',
    didOpen: 'didOpen',
    dismissalRequested: 'dismissalRequested',
  } as const;

  /**
   * Whether the alert is readonly.
   * In readonly mode, there is no dismiss button offered to the user.
   */
  @property({ reflect: true, type: Boolean }) public readonly = false;

  /** You can choose between `m` or `l` size. */
  @property({ reflect: true }) public size: 'm' | 'l' = 'm';

  /** Whether the fade in animation should be disabled. */
  @property({ attribute: 'disable-animation', type: Boolean }) public disableAnimation = false;

  /**
   * Name of the icon which will be forward to the nested `sbb-icon`.
   * Choose the icons from https://icons.app.sbb.ch.
   * Styling is optimized for icons of type HIM-CUS.
   */
  @property({ attribute: 'icon-name' }) public override iconName: string = 'info';

  /** Content of title. */
  @property({ attribute: 'title-content' }) public titleContent?: string;

  /** Level of title, will be rendered as heading tag (e.g. h3). Defaults to level 3. */
  @property({ attribute: 'title-level' }) public titleLevel: SbbTitleLevel = '3';

  /** Content of the link. */
  @property({ attribute: 'link-content' }) public linkContent?: string;

  /** The href value you want to link to. */
  @property() public href: string | undefined;

  /** Where to display the linked URL. */
  @property() public target: LinkTargetType | string | undefined;

  /** The relationship of the linked URL as space-separated link types. */
  @property() public rel: string | undefined;

  /** This will be forwarded as aria-label to the relevant nested element. */
  @property({ attribute: 'accessibility-label' }) public accessibilityLabel: string | undefined;

  /** The state of the alert. */
  private get _state(): SbbAlertState {
    return (this.getAttribute('data-state') as SbbAlertState | null) ?? 'closed';
  }
  private set _state(value: SbbAlertState) {
    this.setAttribute('data-state', value);
  }

  /** Emits when the fade in animation starts. */
  private _willOpen: EventEmitter<void> = new EventEmitter(this, SbbAlertElement.events.willOpen);

  /** Emits when the fade in animation ends and the button is displayed. */
  private _didOpen: EventEmitter<void> = new EventEmitter(this, SbbAlertElement.events.didOpen);

  /** Emits when dismissal of an alert was requested. */
  private _dismissalRequested: EventEmitter<void> = new EventEmitter(
    this,
    SbbAlertElement.events.dismissalRequested,
  );

  private _language = new LanguageController(this);

  protected override async firstUpdated(): Promise<void> {
    this._open();
  }

  /** Requests dismissal of the alert. */
  public requestDismissal(): void {
    this._dismissalRequested.emit();
  }

  /** Open the alert. */
  private _open(): void {
    this._state = 'opening';
    this._willOpen.emit();
  }

  private _onAnimationEnd(event: AnimationEvent): void {
    if (this._state === 'opening' && event.animationName === 'open-opacity') {
      this._state = 'opened';
      this._didOpen.emit();
    }
  }

  private _linkProperties(): Record<string, string | undefined> {
    return {
      ['aria-label']: this.accessibilityLabel,
      href: this.href,
      rel: this.rel,
      target: this.target,
    };
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-alert__transition-wrapper" @animationend=${this._onAnimationEnd}>
        <!-- sub wrapper needed to properly support fade in animation -->
        <div class="sbb-alert__transition-sub-wrapper">
          <div class="sbb-alert">
            <span class="sbb-alert__icon"> ${this.renderIconSlot()} </span>
            <span class="sbb-alert__content">
              <sbb-title
                class="sbb-alert__title"
                level=${this.titleLevel}
                visual-level=${this.size === 'l' ? '3' : '5'}
                negative
              >
                <slot name="title">${this.titleContent}</slot>
              </sbb-title>
              <p class="sbb-alert__content-slot">
                <slot></slot>
              </p>
              ${this.href
                ? html` <sbb-link ${spread(this._linkProperties())} negative>
                    ${this.linkContent ? this.linkContent : i18nFindOutMore[this._language.current]}
                  </sbb-link>`
                : nothing}
            </span>
            ${!this.readonly
              ? html`<span class="sbb-alert__close-button-wrapper">
                  <sbb-divider
                    orientation="vertical"
                    negative
                    class="sbb-alert__close-button-divider"
                  ></sbb-divider>
                  <sbb-transparent-button
                    negative
                    size="m"
                    icon-name="cross-small"
                    @click=${() => this.requestDismissal()}
                    aria-label=${i18nCloseAlert[this._language.current]}
                    class="sbb-alert__close-button"
                  ></sbb-transparent-button>
                </span>`
              : nothing}
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-alert': SbbAlertElement;
  }
}
