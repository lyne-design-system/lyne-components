import { InterfaceSbbAlertGroupAttributes } from './sbb-alert-group.custom';
import { TitleLevel } from '../sbb-title';
import { CSSResult, LitElement, nothing, TemplateResult } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';
import { customElement, property, state } from 'lit/decorators.js';
import { EventEmitter, ConnectedAbortController } from '../../global/eventing';
import { SbbAlert } from '../sbb-alert';
import { setAttribute } from '../../global/dom';
import Style from './sbb-alert-group.scss?lit&inline';

/**
 * @slot unnamed - content slot, should be filled with `sbb-alert` items.
 * @slot accessibility-title - title for this sbb-alert-group which is only visible for screen reader users.
 */

@customElement('sbb-alert-group')
export class SbbAlertGroup extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    didDismissAlert: 'did-dismiss-alert',
    empty: 'empty',
  };

  /**
   * The role attribute defines how to announce alerts to the user.
   *
   * 'status': sets aria-live to polite and aria-atomic to true.
   * 'alert': sets aria-live to assertive and aria-atomic to true.
   */
  @property({ reflect: true })
  public override role: InterfaceSbbAlertGroupAttributes['role'] = 'status';

  /** Title for this alert group which is only visible for screen reader users. */
  @property({ attribute: 'accessibility-title' }) public accessibilityTitle: string;

  /** Level of the accessibility title, will be rendered as heading tag (e.g. h2). Defaults to level 2. */
  @property({ attribute: 'accessibility-title-level' })
  public accessibilityTitleLevel: TitleLevel = '2';

  /** Whether the group currently has any alerts. */
  @state() private _hasAlerts: boolean;

  /** Emits when an alert was removed from DOM. */
  private _didDismissAlert: EventEmitter<SbbAlert> = new EventEmitter(
    this,
    SbbAlertGroup.events.didDismissAlert,
  );

  /** Emits when `sbb-alert-group` becomes empty. */
  private _empty: EventEmitter<void> = new EventEmitter(this, SbbAlertGroup.events.empty);

  private _abort = new ConnectedAbortController(this);

  private _removeAlert(event: Event): void {
    const target = event.target as SbbAlert;
    const hasFocusInsideAlertGroup = document.activeElement === target;

    target.parentNode.removeChild(target);
    this._didDismissAlert.emit(target);

    // Restore focus
    if (hasFocusInsideAlertGroup) {
      // Set tabindex to 0 the make it focusable and afterwards focus it.
      // This is done to not completely lose focus after removal of an alert.
      // Once the sbb-alert-group was blurred, make the alert group not focusable again.
      this.tabIndex = 0;
      this.focus();
      this.addEventListener('blur', () => this.removeAttribute('tabindex'), {
        once: true,
      });
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('dismissal-requested', (e) => this._removeAlert(e), { signal });
  }

  private _slotChanged(event: Event): void {
    const hadAlerts = this._hasAlerts;
    this._hasAlerts = (event.target as HTMLSlotElement).assignedElements().length > 0;
    if (!this._hasAlerts && hadAlerts) {
      this._empty.emit();
    }
  }

  protected override render(): TemplateResult {
    const TITLE_TAG_NAME = `h${this.accessibilityTitleLevel}`;

    setAttribute(this, 'class', !this._hasAlerts ? 'sbb-alert-group-empty' : null);

    /* eslint-disable lit/binding-positions */
    return html`
      <div class="sbb-alert-group">
        ${this._hasAlerts
          ? html`<${unsafeStatic(TITLE_TAG_NAME)} class="sbb-alert-group__title">
              <slot name="accessibility-title">${this.accessibilityTitle}</slot>
            </${unsafeStatic(TITLE_TAG_NAME)}>`
          : nothing}
        <slot @slotchange=${(event: Event) => this._slotChanged(event)}></slot>
      </div>
    `;
    /* eslint-disable lit/binding-positions */
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-alert-group': SbbAlertGroup;
  }
}
