import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { getNextElementIndex, isArrowKeyPressed } from '../../core/a11y.js';
import { SbbConnectedAbortController, SbbSlotStateController } from '../../core/controllers.js';
import { hostAttributes } from '../../core/decorators.js';
import { EventEmitter } from '../../core/eventing.js';
import type { SbbHorizontalFrom, SbbOrientation, SbbStateChange } from '../../core/interfaces.js';
import { SbbDisabledMixin } from '../../core/mixins.js';
import type { SbbSelectionPanelElement } from '../../selection-panel.js';
import type {
  SbbRadioButtonElement,
  SbbRadioButtonSize,
  SbbRadioButtonStateChange,
} from '../radio-button.js';

import style from './radio-button-group.scss?lit&inline';

export type SbbRadioButtonGroupEventDetail = {
  value: any | null;
  radioButton: SbbRadioButtonElement;
};

/**
 * It can be used as a container for one or more `sbb-radio-button`.
 *
 * @slot - Use the unnamed slot to add `sbb-radio-button` elements to the `sbb-radio-button-group`.
 * @slot error - Use this to provide a `sbb-form-error` to show an error message.
 * @event {CustomEvent<SbbRadioButtonGroupEventDetail>} didChange - Deprecated. Only used for React. Will probably be removed once React 19 is available. Emits whenever the `sbb-radio-group` value changes.
 * @event {CustomEvent<SbbRadioButtonGroupEventDetail>} change - Emits whenever the `sbb-radio-group` value changes.
 * @event {CustomEvent<SbbRadioButtonGroupEventDetail>} input - Emits whenever the `sbb-radio-group` value changes.
 */
@customElement('sbb-radio-button-group')
@hostAttributes({
  role: 'radiogroup',
})
export class SbbRadioButtonGroupElement extends SbbDisabledMixin(LitElement) {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    didChange: 'didChange',
    change: 'change',
    input: 'input',
  } as const;

  /**
   * Whether the radios can be deselected.
   */
  @property({ attribute: 'allow-empty-selection', type: Boolean })
  public allowEmptySelection: boolean = false;

  /**
   * Whether the radio group is required.
   */
  @property({ type: Boolean }) public required: boolean = false;

  /**
   * The value of the radio group.
   */
  @property() public value?: any | null;

  /**
   * Size variant, either m or s.
   */
  @property() public size: SbbRadioButtonSize = 'm';

  /**
   * Overrides the behaviour of `orientation` property.
   */
  @property({ attribute: 'horizontal-from', reflect: true })
  public horizontalFrom?: SbbHorizontalFrom;

  /**
   * Radio group's orientation, either horizontal or vertical.
   */
  @property({ reflect: true })
  public orientation: SbbOrientation = 'horizontal';

  /**
   * List of contained radio buttons.
   */
  public get radioButtons(): SbbRadioButtonElement[] {
    return (
      Array.from(this.querySelectorAll?.('sbb-radio-button') ?? []) as SbbRadioButtonElement[]
    ).filter((el) => el.closest?.('sbb-radio-button-group') === this);
  }

  private get _enabledRadios(): SbbRadioButtonElement[] | undefined {
    if (!this.disabled) {
      return this.radioButtons.filter((r) => !r.disabled);
    }
  }

  private _hasSelectionPanel: boolean = false;
  private _didLoad = false;
  private _abort = new SbbConnectedAbortController(this);

  private _valueChanged(value: any | undefined): void {
    for (const radio of this.radioButtons) {
      radio.checked = radio.value === value;
      radio.tabIndex = this._getRadioTabIndex(radio);
    }
    this._setFocusableRadio();
  }

  /**
   * Emits whenever the `sbb-radio-group` value changes.
   * @deprecated only used for React. Will probably be removed once React 19 is available.
   */
  private _didChange: EventEmitter = new EventEmitter<SbbRadioButtonGroupEventDetail>(
    this,
    SbbRadioButtonGroupElement.events.didChange,
  );

  /**
   * Emits whenever the `sbb-radio-group` value changes.
   */
  private _change: EventEmitter = new EventEmitter<SbbRadioButtonGroupEventDetail>(
    this,
    SbbRadioButtonGroupElement.events.change,
  );

  /**
   * Emits whenever the `sbb-radio-group` value changes.
   */
  private _input: EventEmitter = new EventEmitter<SbbRadioButtonGroupEventDetail>(
    this,
    SbbRadioButtonGroupElement.events.input,
  );

  public constructor() {
    super();
    new SbbSlotStateController(this);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener(
      'stateChange',
      (e: CustomEvent<SbbStateChange>) =>
        this._onRadioButtonSelect(e as CustomEvent<SbbRadioButtonStateChange>),
      {
        signal,
        passive: true,
      },
    );
    this.addEventListener('keydown', (e) => this._handleKeyDown(e), { signal });
    this._hasSelectionPanel = !!this.querySelector?.('sbb-selection-panel');
    this.toggleAttribute('data-has-selection-panel', this._hasSelectionPanel);
    this._updateRadios(this.value);
  }

  public override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('value')) {
      this._valueChanged(this.value);
    }
    if (changedProperties.has('disabled')) {
      for (const radio of this.radioButtons) {
        radio.tabIndex = this._getRadioTabIndex(radio);
        radio.requestUpdate?.('disabled');
      }
      this._setFocusableRadio();
    }
    if (changedProperties.has('required')) {
      this.radioButtons.forEach((r) => r.requestUpdate?.('required'));
    }
    if (changedProperties.has('size')) {
      this.radioButtons.forEach((r) => r.requestUpdate?.('size'));
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    this._didLoad = true;
    this._updateRadios(this.value);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  private _onRadioButtonSelect(event: CustomEvent<SbbRadioButtonStateChange>): void {
    event.stopPropagation();
    if (event.detail.type !== 'checked' || !this._didLoad) {
      return;
    }

    const radioButton = event.target as SbbRadioButtonElement;

    if (event.detail.checked) {
      this.value = radioButton.value;
      this._emitChange(radioButton, this.value);
    } else if (this.allowEmptySelection) {
      this.value = this.radioButtons.find((radio) => radio.checked)?.value;
      if (!this.value) {
        this._emitChange(radioButton);
      }
    }
  }

  private _emitChange(radioButton: SbbRadioButtonElement, value?: string): void {
    this._change.emit({ value, radioButton });
    this._input.emit({ value, radioButton });
    this._didChange.emit({ value, radioButton });
  }

  private _updateRadios(initValue?: string): void {
    if (!this._didLoad) {
      return;
    }

    const radioButtons = this.radioButtons;

    this.value = initValue ?? radioButtons.find((radio) => radio.checked)?.value ?? this.value;

    for (const radio of radioButtons) {
      radio.checked = radio.value === this.value;
      radio.tabIndex = this._getRadioTabIndex(radio);
    }

    this._setFocusableRadio();
  }

  private _setFocusableRadio(): void {
    const checked = this.radioButtons.find((radio) => radio.checked && !radio.disabled);

    const enabledRadios = this._enabledRadios;
    if (!checked && enabledRadios?.length) {
      enabledRadios[0].tabIndex = 0;
    }
  }

  private _getRadioTabIndex(radio: SbbRadioButtonElement): number {
    const isSelected: boolean = radio.checked && !radio.disabled && !this.disabled;
    const isParentPanelWithContent: boolean =
      radio.parentElement?.nodeName === 'SBB-SELECTION-PANEL' &&
      (radio.parentElement as SbbSelectionPanelElement).hasContent;

    return isSelected || (this._hasSelectionPanel && isParentPanelWithContent) ? 0 : -1;
  }

  private _handleKeyDown(evt: KeyboardEvent): void {
    const enabledRadios = this._enabledRadios;

    if (
      !enabledRadios ||
      !enabledRadios.length ||
      // don't trap nested handling
      ((evt.target as HTMLElement) !== this &&
        (evt.target as HTMLElement).parentElement !== this &&
        (evt.target as HTMLElement).parentElement?.nodeName !== 'SBB-SELECTION-PANEL')
    ) {
      return;
    }

    if (!isArrowKeyPressed(evt)) {
      return;
    }

    const current: number = enabledRadios.findIndex((e: SbbRadioButtonElement) => e === evt.target);
    const nextIndex: number = getNextElementIndex(evt, current, enabledRadios.length);

    // Selection on arrow keypress is allowed only if all the selection-panels have no content.
    const allPanelsHaveNoContent: boolean = (
      Array.from(this.querySelectorAll?.('sbb-selection-panel')) || []
    ).every((e: SbbSelectionPanelElement) => !e.hasContent);
    if (!this._hasSelectionPanel || (this._hasSelectionPanel && allPanelsHaveNoContent)) {
      enabledRadios[nextIndex].select();
    }

    enabledRadios[nextIndex].focus();
    evt.preventDefault();
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-radio-group">
        <slot @slotchange=${() => this._updateRadios()}></slot>
      </div>
      <div class="sbb-radio-group__error">
        <slot name="error"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-radio-button-group': SbbRadioButtonGroupElement;
  }
}
