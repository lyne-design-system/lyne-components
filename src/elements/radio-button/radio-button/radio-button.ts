import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import {
  SbbConnectedAbortController,
  SbbLanguageController,
  SbbSlotStateController,
} from '../../core/controllers.js';
import { hostAttributes } from '../../core/decorators.js';
import { setOrRemoveAttribute } from '../../core/dom.js';
import { EventEmitter, formElementHandlerAspect, HandlerRepository } from '../../core/eventing.js';
import { i18nCollapsed, i18nExpanded } from '../../core/i18n.js';
import type {
  SbbCheckedStateChange,
  SbbDisabledStateChange,
  SbbStateChange,
} from '../../core/interfaces.js';
import { SbbUpdateSchedulerMixin } from '../../core/mixins.js';
import type { SbbSelectionPanelElement } from '../../selection-panel.js';
import type { SbbRadioButtonGroupElement } from '../radio-button-group.js';

import style from './radio-button.scss?lit&inline';

export type SbbRadioButtonStateChange = Extract<
  SbbStateChange,
  SbbDisabledStateChange | SbbCheckedStateChange
>;

export type SbbRadioButtonSize = 's' | 'm';

/**
 * It displays a radio button enhanced with the SBB Design.
 *
 * @slot - Use the unnamed slot to add content to the radio label.
 * @slot subtext - Slot used to render a subtext under the label (only visible within a `sbb-selection-panel`).
 * @slot suffix - Slot used to render additional content after the label (only visible within a `sbb-selection-panel`).
 */
@customElement('sbb-radio-button')
@hostAttributes({
  role: 'radio',
})
export class SbbRadioButtonElement extends SbbUpdateSchedulerMixin(LitElement) {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    stateChange: 'stateChange',
    radioButtonLoaded: 'radioButtonLoaded',
  } as const;

  /**
   * Whether the radio can be deselected.
   */
  @property({ attribute: 'allow-empty-selection', type: Boolean })
  public set allowEmptySelection(value: boolean) {
    this._allowEmptySelection = Boolean(value);
  }
  public get allowEmptySelection(): boolean {
    return this._allowEmptySelection || (this.group?.allowEmptySelection ?? false);
  }
  private _allowEmptySelection = false;

  /**
   * Value of radio button.
   */
  @property() public value?: string;

  /**
   * Whether the radio button is disabled.
   */
  @property({ reflect: true, type: Boolean })
  public set disabled(value: boolean) {
    this._disabled = Boolean(value);
  }
  public get disabled(): boolean {
    return this._disabled || (this.group?.disabled ?? false);
  }
  private _disabled = false;

  /**
   * Whether the radio button is required.
   */
  @property({ reflect: true, type: Boolean })
  public set required(value: boolean) {
    this._required = Boolean(value);
  }
  public get required(): boolean {
    return this._required || (this.group?.required ?? false);
  }
  private _required = false;

  /**
   * Reference to the connected radio button group.
   */
  public get group(): SbbRadioButtonGroupElement | null {
    return this._group;
  }
  private _group: SbbRadioButtonGroupElement | null = null;

  /**
   * Whether the radio button is checked.
   */
  @property({ reflect: true, type: Boolean })
  public set checked(value: boolean) {
    this._checked = Boolean(value);
  }
  public get checked(): boolean {
    return this._checked;
  }
  private _checked = false;

  /**
   * Label size variant, either m or s.
   */
  @property({ reflect: true })
  public set size(value: SbbRadioButtonSize) {
    this._size = value;
  }
  public get size(): SbbRadioButtonSize {
    return this.group?.size ?? this._size;
  }
  private _size: SbbRadioButtonSize = 'm';

  /**
   * Whether the input is the main input of a selection panel.
   * @internal
   */
  public get isSelectionPanelInput(): boolean {
    return this._isSelectionPanelInput;
  }
  @state() private _isSelectionPanelInput = false;

  /**
   * The label describing whether the selection panel is expanded (for screen readers only).
   */
  @state() private _selectionPanelExpandedLabel?: string;

  private _selectionPanelElement: SbbSelectionPanelElement | null = null;
  private _abort = new SbbConnectedAbortController(this);
  private _language = new SbbLanguageController(this);

  /**
   * @internal
   * Internal event that emits whenever the state of the radio option
   * in relation to the parent selection panel changes.
   */
  private _stateChange: EventEmitter<SbbRadioButtonStateChange> = new EventEmitter(
    this,
    SbbRadioButtonElement.events.stateChange,
    { bubbles: true },
  );

  /**
   * @internal
   * Internal event that emits when the radio button is loaded.
   */
  private _radioButtonLoaded: EventEmitter<void> = new EventEmitter(
    this,
    SbbRadioButtonElement.events.radioButtonLoaded,
    { bubbles: true },
  );
  private _handleClick(event: Event): void {
    event.preventDefault();
    this.select();
  }

  public select(): void {
    if (this.disabled) {
      return;
    }

    if (this.allowEmptySelection) {
      this.checked = !this.checked;
    } else if (!this.checked) {
      this.checked = true;
    }
  }

  private _handlerRepository = new HandlerRepository(this, formElementHandlerAspect);

  public constructor() {
    super();
    new SbbSlotStateController(this);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._group = this.closest('sbb-radio-button-group') as SbbRadioButtonGroupElement;
    // We can use closest here, as we expect the parent sbb-selection-panel to be in light DOM.
    this._selectionPanelElement = this.closest('sbb-selection-panel');
    this._isSelectionPanelInput =
      !!this._selectionPanelElement && !this.closest('sbb-selection-panel [slot="content"]');
    this.toggleAttribute('data-is-selection-panel-input', this._isSelectionPanelInput);

    const signal = this._abort.signal;
    this.addEventListener('click', (e) => this._handleClick(e), { signal });
    this.addEventListener('keydown', (e) => this._handleKeyDown(e), { signal });
    this._handlerRepository.connect();
    this._radioButtonLoaded.emit();

    // We need to call requestUpdate to update the reflected attributes
    ['disabled', 'required', 'size'].forEach((p) => this.requestUpdate(p));
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('checked')) {
      this.setAttribute('aria-checked', `${this.checked}`);
      if (this.checked !== changedProperties.get('checked')!) {
        this._stateChange.emit({ type: 'checked', checked: this.checked });
        this.isSelectionPanelInput && this._updateExpandedLabel();
      }
    }
    if (changedProperties.has('disabled')) {
      setOrRemoveAttribute(this, 'aria-disabled', this.disabled ? 'true' : null);
      if (this.disabled !== changedProperties.get('disabled')!) {
        this._stateChange.emit({ type: 'disabled', disabled: this.disabled });
      }
    }
    if (changedProperties.has('required')) {
      this.setAttribute('aria-required', `${this.required}`);
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    // We need to wait for the selection-panel to be fully initialized
    this.startUpdate();
    setTimeout(() => {
      this.isSelectionPanelInput && this._updateExpandedLabel();
      this.completeUpdate();
    });
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._handlerRepository.disconnect();
  }

  private _handleKeyDown(evt: KeyboardEvent): void {
    if (evt.code === 'Space') {
      this.select();
    }
  }

  private _updateExpandedLabel(): void {
    if (!this._selectionPanelElement?.hasContent) {
      this._selectionPanelExpandedLabel = '';
      return;
    }

    this._selectionPanelExpandedLabel = this.checked
      ? ', ' + i18nExpanded[this._language.current]
      : ', ' + i18nCollapsed[this._language.current];
  }

  protected override render(): TemplateResult {
    return html`
      <label class="sbb-radio-button">
        <input
          type="radio"
          aria-hidden="true"
          tabindex="-1"
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?checked=${this.checked}
          value=${this.value || nothing}
          class="sbb-screen-reader-only"
        />
        <span class="sbb-radio-button__label-slot">
          <slot></slot>
          ${this._selectionPanelElement ? html`<slot name="suffix"></slot>` : nothing}
        </span>
        ${this._selectionPanelElement ? html`<slot name="subtext"></slot>` : nothing}
        ${this.isSelectionPanelInput && this._selectionPanelExpandedLabel
          ? html`<span class="sbb-screen-reader-only"> ${this._selectionPanelExpandedLabel} </span>`
          : nothing}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-radio-button': SbbRadioButtonElement;
  }
}
