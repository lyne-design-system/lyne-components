import { i18nCollapsed, i18nExpanded } from '../../global/i18n';
import { isValidAttribute } from '../../global/dom';
import {
  createNamedSlotState,
  documentLanguage,
  HandlerRepository,
  languageChangeHandlerAspect,
  namedSlotChangeHandlerAspect,
  formElementHandlerAspect,
  EventEmitter,
  ConnectedAbortController,
} from '../../global/eventing';
import { AgnosticMutationObserver } from '../../global/observers';
import {
  InterfaceSbbRadioButtonAttributes,
  RadioButtonStateChange,
} from './sbb-radio-button.custom';
import { CSSResult, html, LitElement, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { setAttributes } from '../../global/dom';
import Style from './sbb-radio-button.scss?lit&inline';
import { SbbRadioButtonGroup } from '../sbb-radio-button-group/sbb-radio-button-group';

/** Configuration for the attribute to look at if component is nested in a sbb-radio-button-group */
const radioButtonObserverConfig: MutationObserverInit = {
  attributeFilter: ['data-group-required', 'data-group-disabled'],
};

/**
 * @slot unnamed - Use this slot to provide the radio label.
 * @slot subtext - Slot used to render a subtext under the label (only visible within a selection panel).
 * @slot suffix - Slot used to render additional content after the label (only visible within a selection panel).
 */
@customElement('sbb-radio-button')
export class SbbRadioButton extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    stateChange: 'state-change',
  };

  /**
   * Whether the radio can be deselected.
   */
  @property({ attribute: 'allow-empty-selection', type: Boolean }) public allowEmptySelection =
    false;

  /**
   * Value of radio button.
   */
  @property() public value: string;

  /**
   * Whether the radio button is disabled.
   */
  @property({ reflect: true, type: Boolean }) public disabled = false;

  /**
   * Whether the radio button is required.
   */
  @property({ type: Boolean }) public required = false;

  /**
   * Whether the radio button is checked.
   */
  @property({ reflect: true, type: Boolean }) public checked = false;

  /**
   * Label size variant, either m or s.
   */
  @property({ reflect: true }) public size: InterfaceSbbRadioButtonAttributes['size'] = 'm';

  /**
   * Whether the component must be set disabled due disabled attribute on sbb-radio-button-group.
   */
  @state() private _disabledFromGroup = false;

  /**
   * Whether the component must be set required due required attribute on sbb-radio-button-group.
   */
  @state() private _requiredFromGroup = false;

  /**
   * State of listed named slots, by indicating whether any element for a named slot is defined.
   */
  @state() private _namedSlots = createNamedSlotState('subtext', 'suffix');

  /**
   * Whether the input is the main input of a selection panel.
   */
  @state() private _isSelectionPanelInput = false;

  /**
   * The label describing whether the selection panel is expanded (for screen readers only).
   */
  @state() private _selectionPanelExpandedLabel: string;

  @state() private _currentLanguage = documentLanguage();

  private _selectionPanelElement: HTMLElement;
  private _abort = new ConnectedAbortController(this);
  private _radioButtonAttributeObserver = new AgnosticMutationObserver(
    this._onRadioButtonAttributesChange.bind(this),
  );

  /**
   * Internal event that emits whenever the state of the radio option
   * in relation to the parent selection panel changes.
   */
  private _stateChange: EventEmitter<RadioButtonStateChange> = new EventEmitter(
    this,
    SbbRadioButton.events.stateChange,
    { bubbles: true },
  );

  private _handleCheckedChange(currentValue: boolean, previousValue: boolean): void {
    if (currentValue !== previousValue) {
      this._stateChange.emit({ type: 'checked', checked: currentValue });
      this._isSelectionPanelInput && this._updateExpandedLabel();
    }
  }

  private _handleDisabledChange(currentValue: boolean, previousValue: boolean): void {
    if (currentValue !== previousValue) {
      this._stateChange.emit({ type: 'disabled', disabled: currentValue });
    }
  }

  private _handleClick(event: Event): void {
    event.preventDefault();
    this.select();
  }

  public select(): void {
    if (this.disabled || this._disabledFromGroup) {
      return;
    }

    if (this.allowEmptySelection) {
      this.checked = !this.checked;
    } else if (!this.checked) {
      this.checked = true;
    }
  }

  private _handlerRepository = new HandlerRepository(
    this,
    languageChangeHandlerAspect((l) => (this._currentLanguage = l)),
    namedSlotChangeHandlerAspect((m) => (this._namedSlots = m(this._namedSlots))),
    formElementHandlerAspect,
  );

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('click', (e) => this._handleClick(e), { signal });
    this.addEventListener('keydown', (e) => this._handleKeyDown(e), { signal });
    this._handlerRepository.connect();
    // We can use closest here, as we expect the parent sbb-selection-panel to be in light DOM.
    this._selectionPanelElement = this.closest('sbb-selection-panel');
    this._isSelectionPanelInput =
      !!this._selectionPanelElement && !this.closest('sbb-selection-panel [slot="content"]');
    this._setupInitialStateAndAttributeObserver();
  }

  public override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('checked')) {
      this._handleCheckedChange(this.checked, changedProperties.get('checked'));
    }
    if (changedProperties.has('disabled')) {
      this._handleDisabledChange(this.disabled, changedProperties.get('disabled'));
    }
  }

  protected override firstUpdated(): void {
    this._isSelectionPanelInput && this._updateExpandedLabel();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._handlerRepository.disconnect();
    this._radioButtonAttributeObserver.disconnect();
  }

  private _handleKeyDown(evt: KeyboardEvent): void {
    if (evt.code === 'Space') {
      this.select();
    }
  }

  // Set up the initial disabled/required values and start observe attributes changes.
  private _setupInitialStateAndAttributeObserver(): void {
    const parentGroup = this.closest('sbb-radio-button-group') as SbbRadioButtonGroup;
    if (parentGroup) {
      this._requiredFromGroup = isValidAttribute(parentGroup, 'required');
      this._disabledFromGroup = isValidAttribute(parentGroup, 'disabled');
      this.size = parentGroup.size;
    }
    this._radioButtonAttributeObserver.observe(this, radioButtonObserverConfig);
  }

  /** Observe changes on data attributes and set the appropriate values. */
  private _onRadioButtonAttributesChange(mutationsList: MutationRecord[]): void {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'data-group-disabled') {
        this._disabledFromGroup = !!isValidAttribute(this, 'data-group-disabled');
      }
      if (mutation.attributeName === 'data-group-required') {
        this._requiredFromGroup = !!isValidAttribute(this, 'data-group-required');
      }
    }
  }

  private _updateExpandedLabel(): void {
    if (!this._selectionPanelElement.hasAttribute('data-has-content')) {
      this._selectionPanelExpandedLabel = '';
      return;
    }

    this._selectionPanelExpandedLabel = this.checked
      ? ', ' + i18nExpanded[this._currentLanguage]
      : ', ' + i18nCollapsed[this._currentLanguage];
  }

  protected override render(): TemplateResult {
    const attributes = {
      role: 'radio',
      'aria-checked': this.checked?.toString() ?? 'false',
      'aria-required': (this.required || this._requiredFromGroup).toString(),
      'aria-disabled': (this.disabled || this._disabledFromGroup).toString(),
      'data-is-selection-panel-input': this._isSelectionPanelInput,
    };
    setAttributes(this, attributes);

    return html`
      <label class="sbb-radio-button">
        <input
          type="radio"
          aria-hidden="true"
          tabindex="-1"
          ?disabled=${this.disabled || this._disabledFromGroup}
          ?required=${this.required || this._requiredFromGroup}
          ?checked=${this.checked}
          value=${this.value}
          class="sbb-radio-button__input"
        />
        <span class="sbb-radio-button__label-slot">
          <slot></slot>
          ${!!this._selectionPanelElement && this._namedSlots['suffix']
            ? html`<slot name="suffix"></slot>`
            : nothing}
        </span>
        ${!!this._selectionPanelElement && this._namedSlots['subtext']
          ? html`<slot name="subtext"></slot>`
          : nothing}
        ${this._isSelectionPanelInput && this._selectionPanelExpandedLabel
          ? html`<span class="sbb-radio-button__expanded-label">
              ${this._selectionPanelExpandedLabel}
            </span>`
          : nothing}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-radio-button': SbbRadioButton;
  }
}
