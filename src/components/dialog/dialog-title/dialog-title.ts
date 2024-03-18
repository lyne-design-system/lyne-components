import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';

import { FocusVisibleWithinController } from '../../core/a11y';
import { LanguageController, hostAttributes } from '../../core/common-behaviors';
import type { Breakpoint } from '../../core/dom';
import { EventEmitter } from '../../core/eventing';
import { i18nCloseDialog, i18nGoBack } from '../../core/i18n';
import { SbbTitleElement } from '../../title';
import '../../button';

import style from './dialog-title.scss?lit&inline';

/**
 * It displays a title inside a dialog header.
 *
 * @event {CustomEvent<void>} requestBackAction - Emits whenever the back button is clicked.
 */
@customElement('sbb-dialog-title')
@hostAttributes({
  slot: 'title',
})
export class SbbDialogTitleElement extends SbbTitleElement {
  public static override styles: CSSResultGroup = [SbbTitleElement.styles, style];
  public static readonly events: Record<string, string> = {
    backClick: 'requestBackAction',
  } as const;

  /**
   * Whether a back button is displayed next to the title.
   */
  @property({ attribute: 'back-button', type: Boolean }) public backButton = false;

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
  public set hideOnScroll(value: '' | Breakpoint | boolean) {
    this._hideOnScroll = value === '' ? true : value;
  }
  public get hideOnScroll(): Breakpoint | boolean {
    return this._hideOnScroll;
  }
  private _hideOnScroll: Breakpoint | boolean = false;

  private _backClick: EventEmitter<any> = new EventEmitter(
    this,
    SbbDialogTitleElement.events.backClick,
  );
  private _language = new LanguageController(this);

  public constructor() {
    super();
    this.level = '2';
    this.visualLevel = '3';
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    new FocusVisibleWithinController(this);
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('backButton') || changedProperties.has('accessibilityBackLabel')) {
      this.backButton = !this.backButton && !!this.accessibilityBackLabel ? true : this.backButton;
    }
  }

  protected override render(): TemplateResult {
    const TAG_NAME = this.negative ? 'sbb-transparent-button' : 'sbb-secondary-button';

    /* eslint-disable lit/binding-positions */
    const closeButton = html`
      <${unsafeStatic(TAG_NAME)}
        class="sbb-dialog__close"
        aria-label=${this.accessibilityCloseLabel || i18nCloseDialog[this._language.current]}
        ?negative=${this.negative}
        size="m"
        type="button"
        icon-name="cross-small"
        sbb-dialog-close
      ></${unsafeStatic(TAG_NAME)}>
    `;

    const backButton = html`
      <${unsafeStatic(TAG_NAME)}
        class="sbb-dialog__back"
        aria-label=${this.accessibilityBackLabel || i18nGoBack[this._language.current]}
        ?negative=${this.negative}
        size="m"
        type="button"
        icon-name="chevron-small-left-small"
        @click=${() => this._backClick.emit()}
      ></${unsafeStatic(TAG_NAME)}>
    `;
    /* eslint-enable lit/binding-positions */

    return html`
      <div class="sbb-dialog__header">
        ${this.backButton ? backButton : nothing} ${super.render()} ${closeButton}
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
