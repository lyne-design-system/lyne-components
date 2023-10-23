import { assignId } from '../../global/a11y';
import { isSafari, isValidAttribute, isAndroid, toggleDatasetEntry } from '../../global/dom';
import {
  createNamedSlotState,
  HandlerRepository,
  namedSlotChangeHandlerAspect,
  EventEmitter,
  ConnectedAbortController,
} from '../../global/eventing';
import { AgnosticMutationObserver } from '../../global/observers';
import { CSSResult, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { setAttribute } from '../../global/dom';
import { classMap } from 'lit/directives/class-map.js';
import Style from './sbb-option.scss?lit&inline';
import '../sbb-visual-checkbox';

let nextId = 0;

/** Configuration for the attribute to look at if component is nested in a sbb-checkbox-group */
const optionObserverConfig: MutationObserverInit = {
  attributeFilter: ['data-group-disabled', 'data-negative'],
};

export type SbbOptionVariant = 'autocomplete' | 'select';

/**
 * @slot unnamed - Use this to provide the option label.
 * @slot icon - Use this slot to provide an icon. If `icon-name` is set, a sbb-icon will be used.
 */
@customElement('sbb-option')
export class SbbOption extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    selectionChange: 'option-selection-change',
    optionSelected: 'option-selected',
  };

  /** Value of the option. */
  @property() public value?: string;

  /**
   * The icon name we want to use, choose from the small icon variants
   * from the ui-icons category from here
   * https://icons.app.sbb.ch.
   */
  @property({ attribute: 'icon-name' }) public iconName?: string;

  /** Whether the option is currently active. */
  @property({ reflect: true, type: Boolean }) public active?: boolean;

  /** Whether the option is selected. */
  @property({ reflect: true, type: Boolean }) public selected = false;

  /** Whether the option is disabled. */
  @property({ type: Boolean }) public disabled?: boolean;

  /** Emits when the option selection status changes. */
  private _selectionChange: EventEmitter = new EventEmitter(this, SbbOption.events.selectionChange);

  /** Emits when an option was selected by user. */
  private _optionSelected: EventEmitter = new EventEmitter(this, SbbOption.events.optionSelected);

  /** Wheter to apply the negative styling */
  @state() private _negative = false;

  /** Whether the component must be set disabled due disabled attribute on sbb-checkbox-group. */
  @state() private _disabledFromGroup = false;

  /** State of listed named slots, by indicating whether any element for a named slot is defined. */
  @state() private _namedSlots = createNamedSlotState('icon');

  @state() private _label: string;

  /** The portion of the highlighted label. */
  @state() private _highlightString: string;

  /** Disable the highlight of the label. */
  @state() private _disableLabelHighlight: boolean;

  @state() private _groupLabel: string;

  private _optionId = `sbb-option-${++nextId}`;
  private _variant: SbbOptionVariant;
  private _abort = new ConnectedAbortController(this);

  /**
   * On Safari, the groups labels are not read by VoiceOver.
   * To solve the problem, we remove the role="group" and add an hidden span containing the group name
   * TODO: We should periodically check if it has been solved and, if so, remove the property.
   */
  private _inertAriaGroups = isSafari();

  private _handlerRepository = new HandlerRepository(
    this,
    namedSlotChangeHandlerAspect((m) => (this._namedSlots = m(this._namedSlots))),
  );

  /** MutationObserver on data attributes. */
  private _optionAttributeObserver = new AgnosticMutationObserver((mutationsList) =>
    this._onOptionAttributesChange(mutationsList),
  );

  private get _isAutocomplete(): boolean {
    return this._variant === 'autocomplete';
  }
  private get _isSelect(): boolean {
    return this._variant === 'select';
  }
  private get _isMultiple(): boolean {
    return this.closest('sbb-select')?.hasAttribute('multiple');
  }

  /**
   * Highlight the label of the option
   * @param value the highlighted portion of the label
   * @internal
   */
  public highlight(value: string): void {
    this._highlightString = value;
  }

  /**
   * Set the option group label (used for a11y)
   * @param value the label of the option group
   */
  public setGroupLabel(value: string): void {
    this._groupLabel = value;
  }

  /**
   * @internal
   */
  public setSelectedViaUserInteraction(selected: boolean): void {
    this.selected = selected;
    this._selectionChange.emit();
    if (this.selected) {
      this._optionSelected.emit();
    }
  }

  private _selectByClick(event): void {
    if (this.disabled || this._disabledFromGroup) {
      event.stopPropagation();
      return;
    }

    if (this._isMultiple) {
      event.stopPropagation();
      this.setSelectedViaUserInteraction(!this.selected);
    } else {
      this.setSelectedViaUserInteraction(true);
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this._handlerRepository.connect();
    const parentGroup = this.closest('sbb-optgroup');
    if (parentGroup) {
      this._disabledFromGroup = isValidAttribute(parentGroup, 'disabled');
    }
    this._optionAttributeObserver.observe(this, optionObserverConfig);

    this._negative = !!this.closest(
      // :is() selector not possible due to test environment
      `sbb-autocomplete[negative]:not([negative='false']),sbb-select[negative]:not([negative='false']),sbb-form-field[negative]:not([negative='false'])`,
    );
    toggleDatasetEntry(this, 'negative', this._negative);

    this._setVariantByContext();

    this.addEventListener('click', (e) => this._selectByClick(e), { signal, passive: true });
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._handlerRepository.disconnect();
    this._optionAttributeObserver.disconnect();
  }

  private _setVariantByContext(): void {
    if (this.closest('sbb-autocomplete')) {
      this._variant = 'autocomplete';
      return;
    }

    if (this.closest('sbb-select')) {
      this._variant = 'select';
    }
  }

  /** Observe changes on data attributes and set the appropriate values. */
  private _onOptionAttributesChange(mutationsList: MutationRecord[]): void {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'data-group-disabled') {
        this._disabledFromGroup = isValidAttribute(this, 'data-group-disabled');
      } else if (mutation.attributeName === 'data-negative') {
        this._negative = isValidAttribute(this, 'data-negative');
      }
    }
  }

  private _setupHighlightHandler(event): void {
    if (!this._isAutocomplete) {
      this._disableLabelHighlight = true;
      return;
    }

    const slotNodes = (event.target as HTMLSlotElement).assignedNodes();
    const labelNode = slotNodes.filter((el) => el.nodeType === Node.TEXT_NODE)[0] as Text;

    // Disable the highlight if the slot does not contain just a text node
    if (!labelNode || slotNodes.length !== 1) {
      this._disableLabelHighlight = true;
      return;
    }
    this._label = labelNode.wholeText;
  }

  private _getHighlightedLabel(): TemplateResult {
    if (!this._highlightString || !this._highlightString.trim()) {
      return html`${this._label}`;
    }

    const matchIndex = this._label.toLowerCase().indexOf(this._highlightString.toLowerCase());

    if (matchIndex === -1) {
      return html`${this._label}`;
    }

    const prefix = this._label.substring(0, matchIndex);
    const highlighted = this._label.substring(
      matchIndex,
      matchIndex + this._highlightString.length,
    );
    const postfix = this._label.substring(matchIndex + this._highlightString.length);

    return html`
      <span class="sbb-option__label--highlight">${prefix}</span><span>${highlighted}</span
      ><span class="sbb-option__label--highlight">${postfix}</span>
    `;
  }

  protected override render(): TemplateResult {
    const isMultiple = this._isMultiple;
    setAttribute(this, 'role', 'option');
    setAttribute(this, 'tabindex', isAndroid() && !this.disabled && 0);
    setAttribute(this, 'data-variant', this._variant);
    setAttribute(this, 'data-multiple', isMultiple);
    setAttribute(this, 'data-disable-highlight', this._disableLabelHighlight);
    setAttribute(this, 'aria-selected', `${this.selected}`);
    setAttribute(this, 'aria-disabled', `${this.disabled || this._disabledFromGroup}`);
    assignId(() => this._optionId)(this);

    return html`
      <div class="sbb-option__container">
        <div class="sbb-option">
          <!-- Icon -->
          ${!isMultiple
            ? html` <span
                class=${classMap({
                  'sbb-option__icon': true,
                  'sbb-option__icon--empty': !this._namedSlots.icon && !this.iconName,
                })}
              >
                <slot name="icon">
                  ${this.iconName ? html`<sbb-icon name=${this.iconName} />` : nothing}
                </slot>
              </span>`
            : nothing}

          <!-- Checkbox -->
          ${isMultiple
            ? html` <sbb-visual-checkbox
                ?checked=${this.selected}
                ?disabled=${this.disabled || this._disabledFromGroup}
                ?negative=${this._negative}
              ></sbb-visual-checkbox>`
            : nothing}

          <!-- Label -->
          <span class="sbb-option__label">
            <slot @slotchange=${this._setupHighlightHandler}></slot>

            <!-- Search highlight -->
            ${this._isAutocomplete && this._label && !this._disableLabelHighlight
              ? this._getHighlightedLabel()
              : nothing}
            ${this._inertAriaGroups && this._groupLabel
              ? html` <span class="sbb-option__group-label--visually-hidden">
                  (${this._groupLabel})</span
                >`
              : nothing}
          </span>

          <!-- Selected tick -->
          ${this._isSelect && !isMultiple && this.selected
            ? html`<sbb-icon name="tick-small"></sbb-icon>`
            : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-option': SbbOption;
  }
}
