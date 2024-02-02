import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { LanguageController } from '../core/common-behaviors';
import type { Breakpoint } from '../core/dom';
import { setAttribute } from '../core/dom';
import { ConnectedAbortController, EventEmitter } from '../core/eventing';
import { i18nCloseDialog, i18nGoBack } from '../core/i18n';
import type { TitleLevel } from '../title';
import { SbbTitleElement } from '../title';
import '../button';

import style from './dialog-title.scss?lit&inline';

/**
 * It displays a title inside a dialog header.
 * @event {CustomEvent<any>} requestBackAction - TODO: Document this event
 */
@customElement('sbb-dialog-title')
export class SbbDialogTitleElement extends SbbTitleElement {
  public static override styles: CSSResultGroup = [SbbTitleElement.styles, style];
  public static readonly events: Record<string, string> = {
    backClick: 'requestBackAction',
  } as const;

  /**
   * Visual level for the title. Optional, if not set, the value of level will be used.
   */
  @property({ attribute: 'visual-level', reflect: true }) public override visualLevel?: TitleLevel =
    '3';

  /**
   * Whether a back button is displayed next to the title.
   */
  @property({ attribute: 'title-back-button', type: Boolean }) public titleBackButton = false;

  /**
   * This will be forwarded as aria-label to the close button element.
   */
  @property({ attribute: 'accessibility-close-label' }) public accessibilityCloseLabel:
    | string
    | undefined;

  /**
   * This will be forwarded as aria-label to the back button element.
   */
  @property({ attribute: 'accessibility-back-label' }) public accessibilityBackLabel:
    | string
    | undefined;

  /**
   * Whether to hide the title up to a certain breakpoint.
   */
  @property({ attribute: 'hide-on-scroll' })
  public set hideOnScroll(value: false | '' | Breakpoint) {
    this._hideOnScroll = value === '' ? 'ultra' : value;
  }
  public get hideOnScroll(): false | '' | Breakpoint {
    return this._hideOnScroll;
  }
  private _hideOnScroll: false | '' | Breakpoint = false;

  private _abort = new ConnectedAbortController(this);
  private _backClick: EventEmitter<any> = new EventEmitter(
    this,
    SbbDialogTitleElement.events.backClick,
  );
  private _language = new LanguageController(this);

  private _onClickFn(): void {
    this._backClick.emit();
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('click', () => this._onClickFn(), { signal });
    // do stuff
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    // do stuff
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'slot', 'title');

    const closeButton = html`
      <sbb-button
        class="sbb-dialog__close"
        aria-label=${this.accessibilityCloseLabel || i18nCloseDialog[this._language.current]}
        variant=${this.negative ? 'transparent' : 'secondary'}
        ?negative=${this.negative}
        size="m"
        type="button"
        icon-name="cross-small"
        sbb-dialog-close
      ></sbb-button>
    `;

    const backButton = html`
      <sbb-button
        class="sbb-dialog__back"
        aria-label=${this.accessibilityBackLabel || i18nGoBack[this._language.current]}
        variant=${this.negative ? 'transparent' : 'secondary'}
        ?negative=${this.negative}
        size="m"
        type="button"
        icon-name="chevron-small-left-small"
        @click=${() => this._backClick.emit()}
      ></sbb-button>
    `;

    return html`
      <div class="sbb-dialog__header">
        ${this.titleBackButton ? backButton : nothing} ${super.render()} ${closeButton}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-dialog-title': SbbDialogTitleElement;
  }
}
