import { InterfaceSbbRadioButtonGroupAttributes } from './sbb-radio-button-group.custom';
import { RadioButtonStateChange } from '../sbb-radio-button/sbb-radio-button.custom';
import { isArrowKeyPressed, getNextElementIndex, interactivityChecker } from '../../global/a11y';
import { toggleDatasetEntry } from '../../global/dom';
import {
  createNamedSlotState,
  HandlerRepository,
  namedSlotChangeHandlerAspect,
  EventEmitter,
  ConnectedAbortController,
} from '../../global/eventing';
import { CSSResult, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { SbbRadioButton } from '../sbb-radio-button';
import { setAttribute } from '../../global/dom';
import Style from './sbb-radio-button-group.scss?lit&inline';

/**
 * @slot unnamed - Use this to provide radio buttons within the group.
 * @slot error - Use this to provide a `sbb-form-error` to show an error message.
 */
@customElement('sbb-radio-button-group')
export class SbbRadioButtonGroup extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    didChange: 'did-change',
    change: 'change',
    input: 'input',
  };
  /**
   * Whether the radios can be deselected.
   */
  @property({ attribute: 'allow-empty-selection', type: Boolean })
  public get allowEmptySelection(): boolean {
    return this._allowEmptySelection;
  }
  public set allowEmptySelection(value: boolean) {
    const oldValue = this._allowEmptySelection;
    this._allowEmptySelection = value;
    this._updateAllowEmptySelection();
    this.requestUpdate('allowEmptySelection', oldValue);
  }
  private _allowEmptySelection: boolean = false;

  /**
   * Whether the radio group is disabled.
   */
  @property({ type: Boolean })
  public get disabled(): boolean {
    return this._disabled;
  }
  public set disabled(value: boolean) {
    const oldValue = this._disabled;
    this._disabled = value;
    this._updateDisabled();
    this.requestUpdate('disabled', oldValue);
  }
  private _disabled: boolean = false;

  /**
   * Whether the radio group is required.
   */
  @property({ type: Boolean })
  public get required(): boolean {
    return this._required;
  }
  public set required(value: boolean) {
    const oldValue = this._required;
    this._required = value;
    this._updateRequired();
    this.requestUpdate('required', oldValue);
  }
  private _required: boolean = false;

  /**
   * The value of the radio group.
   */
  @property()
  public get value(): any | null | null {
    return this._value;
  }
  public set value(value: any | null | null) {
    const oldValue = this._value;
    this._value = value;
    this._valueChanged(this._value);
    this.requestUpdate('value', oldValue);
  }
  private _value: any | null | null = null;

  /**
   * Size variant, either m or s.
   */
  @property()
  public get size(): InterfaceSbbRadioButtonGroupAttributes['size'] {
    return this._size;
  }
  public set size(value: InterfaceSbbRadioButtonGroupAttributes['size']) {
    const oldValue = this._size;
    this._size = value;
    this._updateSize();
    this.requestUpdate('size', oldValue);
  }
  private _size: InterfaceSbbRadioButtonGroupAttributes['size'] = 'm';

  /**
   * Overrides the behaviour of `orientation` property.
   */
  @property({ attribute: 'horizontal-from', reflect: true })
  public horizontalFrom?: InterfaceSbbRadioButtonGroupAttributes['horizontalFrom'];

  /**
   * Radio group's orientation, either horizontal or vertical.
   */
  @property({ reflect: true })
  public orientation: InterfaceSbbRadioButtonGroupAttributes['orientation'] = 'horizontal';

  /**
   * State of listed named slots, by indicating whether any element for a named slot is defined.
   */
  @state() private _namedSlots = createNamedSlotState('error');

  private _hasSelectionPanel: boolean;
  private _abort = new ConnectedAbortController(this);

  private _valueChanged(value: any | undefined): void {
    for (const radio of this._radioButtons) {
      radio.checked = radio.value === value;
      radio.tabIndex = this._getRadioTabIndex(radio);
    }
    this._setFocusableRadio();
  }

  private _updateDisabled(): void {
    for (const radio of this._radioButtons) {
      toggleDatasetEntry(radio, 'groupDisabled', this.disabled);
      radio.tabIndex = this._getRadioTabIndex(radio);
    }
    this._setFocusableRadio();
  }

  private _updateRequired(): void {
    for (const radio of this._radioButtons) {
      toggleDatasetEntry(radio, 'groupRequired', this.required);
    }
  }

  private _updateSize(): void {
    for (const radio of this._radioButtons) {
      radio.size = this.size;
    }
  }

  private _updateAllowEmptySelection(): void {
    for (const radio of this._radioButtons) {
      radio.allowEmptySelection = this.allowEmptySelection;
    }
  }

  /**
   * Emits whenever the radio group value changes.
   * @deprecated only used for React. Will probably be removed once React 19 is available.
   */
  private _didChange: EventEmitter = new EventEmitter(this, SbbRadioButtonGroup.events.didChange);

  /**
   * Emits whenever the radio group value changes.
   */
  private _change: EventEmitter = new EventEmitter(this, SbbRadioButtonGroup.events.change);

  /**
   * Emits whenever the radio group value changes.
   */
  private _input: EventEmitter = new EventEmitter(this, SbbRadioButtonGroup.events.input);

  private _handlerRepository = new HandlerRepository(
    this,
    namedSlotChangeHandlerAspect((m) => (this._namedSlots = m(this._namedSlots))),
  );

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener(
      'state-change',
      (e: CustomEvent<RadioButtonStateChange>) => this._onRadioButtonSelect(e),
      {
        signal,
        passive: true,
      },
    );
    this.addEventListener('keydown', (e) => this._handleKeyDown(e), { signal });
    this._hasSelectionPanel = !!this.querySelector('sbb-selection-panel');
    toggleDatasetEntry(this, 'hasSelectionPanel', this._hasSelectionPanel);
    this._handlerRepository.connect();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._handlerRepository.disconnect();
  }

  private _onRadioButtonSelect(event: CustomEvent<RadioButtonStateChange>): void {
    event.stopPropagation();
    if (event.detail.type !== 'checked') {
      return;
    }

    if (event.detail.checked) {
      this.value = (event.target as HTMLInputElement).value;
      this._emitChange(this.value);
      return;
    }

    if (this.allowEmptySelection) {
      this._emitChange();
    }
  }

  private _emitChange(value?: string): void {
    this._change.emit({ value });
    this._input.emit({ value });
    this._didChange.emit({ value });
  }

  private _updateRadios(): void {
    const value = this.value ?? this._radioButtons.find((radio) => radio.checked)?.value;

    for (const radio of this._radioButtons) {
      radio.checked = radio.value === value;
      radio.size = this.size;
      radio.allowEmptySelection = this.allowEmptySelection;

      toggleDatasetEntry(radio, 'groupDisabled', this.disabled);
      toggleDatasetEntry(radio, 'groupRequired', this.required);

      radio.tabIndex = this._getRadioTabIndex(radio);
    }

    this._setFocusableRadio();
  }

  private get _radioButtons(): SbbRadioButton[] {
    return (Array.from(this.querySelectorAll('sbb-radio-button')) as SbbRadioButton[]).filter(
      (el) => el.closest('sbb-radio-button-group') === this,
    );
  }

  private get _enabledRadios(): SbbRadioButton[] | undefined {
    if (!this.disabled) {
      return this._radioButtons.filter((r) => !r.disabled && interactivityChecker.isVisible(r));
    }
  }

  private _setFocusableRadio(): void {
    const checked = this._radioButtons.find((radio) => radio.checked && !radio.disabled);

    const enabledRadios = this._enabledRadios;
    if (!checked && enabledRadios?.length) {
      enabledRadios[0].tabIndex = 0;
    }
  }

  private _getRadioTabIndex(radio: SbbRadioButton): number {
    return (radio.checked || this._hasSelectionPanel) && !radio.disabled && !this.disabled ? 0 : -1;
  }

  private _handleKeyDown(evt: KeyboardEvent): void {
    const enabledRadios: SbbRadioButton[] = this._enabledRadios;

    if (
      !enabledRadios ||
      !enabledRadios.length ||
      // don't trap nested handling
      ((evt.target as HTMLElement) !== this &&
        (evt.target as HTMLElement).parentElement !== this &&
        (evt.target as HTMLElement).parentElement.nodeName !== 'SBB-SELECTION-PANEL')
    ) {
      return;
    }

    if (!isArrowKeyPressed(evt)) {
      return;
    }

    let current: number;
    let nextIndex: number;

    if (this._hasSelectionPanel) {
      current = enabledRadios.findIndex((e: SbbRadioButton) => e === evt.target);
      nextIndex = getNextElementIndex(evt, current, enabledRadios.length);
    } else {
      const checked: number = enabledRadios.findIndex((radio: SbbRadioButton) => radio.checked);
      nextIndex = getNextElementIndex(evt, checked, enabledRadios.length);
      enabledRadios[nextIndex].select();
    }

    enabledRadios[nextIndex].focus();
    evt.preventDefault();
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'role', 'radiogroup');

    return html`
      <div class="sbb-radio-group">
        <slot @slotchange=${() => this._updateRadios()}></slot>
      </div>
      ${this._namedSlots.error
        ? html`<div class="sbb-radio-group__error">
            <slot name="error"></slot>
          </div>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-radio-button-group': SbbRadioButtonGroup;
  }
}
