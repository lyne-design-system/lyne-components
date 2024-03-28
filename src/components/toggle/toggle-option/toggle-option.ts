import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { hostAttributes, NamedSlotStateController } from '../../core/common-behaviors';
import { setAttribute } from '../../core/dom';
import { ConnectedAbortController, EventEmitter } from '../../core/eventing';
import { SbbIconNameMixin } from '../../icon';
import type { SbbToggleElement, SbbToggleStateChange } from '../toggle';

import style from './toggle-option.scss?lit&inline';

/**
 * It displays a toggle option within a `sbb-toggle`.
 *
 * @slot - Use the unnamed slot to add content to the label of the toggle option.
 * @slot icon - Slot used to render the `sbb-icon`.
 */
@customElement('sbb-toggle-option')
@hostAttributes({
  role: 'radio',
})
export class SbbToggleOptionElement extends SbbIconNameMixin(LitElement) {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    stateChange: 'stateChange',
  } as const;

  /**
   * Whether the toggle-option is checked.
   */
  @property({ reflect: true, type: Boolean })
  public set checked(value: boolean) {
    const oldValue = this.checked;
    if (value !== oldValue) {
      this._checked = value;
      this._handleCheckedChange(this.checked, oldValue);
    }
  }
  public get checked(): boolean {
    return this._checked;
  }
  private _checked = false;

  /**
   * Whether the toggle option is disabled.
   */
  @property({ reflect: true, type: Boolean })
  public set disabled(value: boolean) {
    this._disabled = value;
    this._handleDisabledChange(this._disabled);
  }
  public get disabled(): boolean {
    return this._disabled;
  }
  private _disabled: boolean = false;

  /**
   * Value of toggle-option.
   */
  @property()
  public set value(value: string | null) {
    const oldValue = this._value;
    this._value = value;
    this._handleValueChange(this._value, oldValue);
  }
  public get value(): string | null {
    return this._value;
  }
  private _value: string | null = null;

  private _toggle?: SbbToggleElement;

  /**
   * @internal
   * Internal event that emits whenever the state of the toggle option
   * in relation to the parent toggle changes.
   */
  private _stateChange: EventEmitter<SbbToggleStateChange> = new EventEmitter(
    this,
    SbbToggleOptionElement.events.stateChange,
    { bubbles: true },
  );

  private _abort = new ConnectedAbortController(this);

  public constructor() {
    super();
    new NamedSlotStateController(this);
  }

  private _handleCheckedChange(currentValue: boolean, previousValue: boolean): void {
    if (currentValue !== previousValue) {
      this._stateChange.emit({ type: 'checked', checked: currentValue });
      this._verifyTabindex();
    }
  }

  private _handleValueChange(currentValue: string | null, previousValue: string | null): void {
    if (this.checked && currentValue !== previousValue) {
      this._stateChange.emit({ type: 'value', value: currentValue });
    }
  }

  private _handleDisabledChange(currentValue: boolean): void {
    // Enforce disabled state from parent.
    if (!this._toggle) {
      // Ignore illegal state. Our expectation  is that a sbb-toggle-option
      // always has a parent sbb-toggle.
    } else if (this._toggle.disabled && !currentValue) {
      this.disabled = true;
    } else if (!this._toggle.disabled && currentValue) {
      this.disabled = false;
    }
    this._verifyTabindex();
  }

  private _handleInput(): void {
    if (this.checked || this.disabled) {
      return;
    }
    this.checked = true;
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('input', () => this._handleInput(), { signal });
    this.addEventListener('click', () => this.shadowRoot!.querySelector('label')?.click(), {
      signal,
    });
    // We can use closest here, as we expect the parent sbb-toggle to be in light DOM.
    const toggle = this.closest?.('sbb-toggle');
    if (toggle) {
      this._toggle = toggle;
    }
    this._verifyTabindex();
  }

  private _verifyTabindex(): void {
    this.tabIndex = this.checked && !this.disabled ? 0 : -1;
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'aria-checked', (!!this.checked).toString());
    setAttribute(this, 'aria-disabled', this.disabled);

    return html`
      <input
        type="radio"
        id="sbb-toggle-option-id"
        aria-hidden="true"
        tabindex="-1"
        ?disabled=${this.disabled}
        .checked=${this.checked || nothing}
        .value=${this.value || nothing}
        @click=${(event: PointerEvent) => event.stopPropagation()}
      />
      <label class="sbb-toggle-option" for="sbb-toggle-option-id">
        ${this.renderIconSlot()}
        <span class="sbb-toggle-option__label">
          <slot></slot>
        </span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-toggle-option': SbbToggleOptionElement;
  }
}
