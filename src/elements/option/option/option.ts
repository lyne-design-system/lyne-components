import {
  type CSSResultGroup,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { SbbConnectedAbortController, SbbSlotStateController } from '../../core/controllers.js';
import { hostAttributes } from '../../core/decorators.js';
import { isAndroid, isSafari, setOrRemoveAttribute } from '../../core/dom.js';
import { EventEmitter } from '../../core/eventing.js';
import { SbbDisabledMixin } from '../../core/mixins.js';
import { AgnosticMutationObserver } from '../../core/observers.js';
import { SbbIconNameMixin } from '../../icon.js';

import style from './option.scss?lit&inline';

import '../../screen-reader-only.js';
import '../../visual-checkbox.js';

/**
 * On Safari, the groups labels are not read by VoiceOver.
 * To solve the problem, we remove the role="group" and add an hidden span containing the group name
 * TODO: We should periodically check if it has been solved and, if so, remove the property.
 */
const inertAriaGroups = isSafari;

let nextId = 0;

/** Configuration for the attribute to look at if component is nested in a sbb-checkbox-group */
const optionObserverConfig: MutationObserverInit = {
  attributeFilter: ['data-group-disabled', 'data-negative'],
};

export type SbbOptionVariant = 'autocomplete' | 'select';

/**
 * It displays on option item which can be used in `sbb-select` or `sbb-autocomplete`.
 *
 * @slot - Use the unnamed slot to add content to the option label.
 * @slot icon - Use this slot to provide an icon. If `icon-name` is set, a sbb-icon will be used.
 * @event {CustomEvent<void>} optionSelectionChange - Emits when the option selection status changes.
 * @event {CustomEvent<void>} optionSelected - Emits when an option was selected by user.
 * @cssprop [--sbb-option-icon-container-display=none] - Can be used to reserve space even
 * when preserve-icon-space on autocomplete is not set or iconName is not set.
 */
@customElement('sbb-option')
@hostAttributes({
  role: 'option',
})
export class SbbOptionElement extends SbbDisabledMixin(SbbIconNameMixin(LitElement)) {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    selectionChange: 'optionSelectionChange',
    optionSelected: 'optionSelected',
  } as const;

  /**
   * Value of the option.
   *
   * @description Developer note: In this case updating the attribute must be synchronous.
   * Due to this it is implemented as a getter/setter and the attributeChangedCallback() handles the diff check.
   */
  @property()
  public set value(value: string) {
    this.setAttribute('value', `${value}`);
  }
  public get value(): string {
    return this.getAttribute('value') ?? '';
  }

  /** Whether the option is currently active. */
  @property({ reflect: true, type: Boolean }) public active?: boolean;

  /** Whether the option is selected. */
  @property({ type: Boolean })
  public set selected(value: boolean) {
    this.toggleAttribute('selected', value);
    this._updateAriaSelected();
  }
  public get selected(): boolean {
    return this.hasAttribute('selected');
  }

  /** Emits when the option selection status changes. */
  private _selectionChange: EventEmitter = new EventEmitter(
    this,
    SbbOptionElement.events.selectionChange,
  );

  /** Emits when an option was selected by user. */
  private _optionSelected: EventEmitter = new EventEmitter(
    this,
    SbbOptionElement.events.optionSelected,
  );

  /** Whether to apply the negative styling */
  @state() private _negative = false;

  /** Whether the component must be set disabled due disabled attribute on sbb-checkbox-group. */
  @state() private _disabledFromGroup = false;

  @state() private _label?: string;

  /** The portion of the highlighted label. */
  @state() private _highlightString: string | null = null;

  /** Disable the highlight of the label. */
  @state() private _disableLabelHighlight: boolean = false;

  private set _variant(state: SbbOptionVariant) {
    this.setAttribute('data-variant', state);
  }
  private get _variant(): SbbOptionVariant {
    return this.getAttribute('data-variant') as SbbOptionVariant;
  }

  private _abort = new SbbConnectedAbortController(this);

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
    return !!this.closest?.('sbb-select[multiple]');
  }

  public constructor() {
    super();
    new SbbSlotStateController(this);
  }

  public override attributeChangedCallback(
    name: string,
    old: string | null,
    value: string | null,
  ): void {
    if (name !== 'value' || old !== value) {
      super.attributeChangedCallback(name, old, value);
    }
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
   * @internal
   */
  public setSelectedViaUserInteraction(selected: boolean): void {
    this.selected = selected;
    this._selectionChange.emit();
    if (this.selected) {
      this._optionSelected.emit();
    }
  }

  private _updateDisableHighlight(disabled: boolean): void {
    this._disableLabelHighlight = disabled;
    this.toggleAttribute('data-disable-highlight', disabled);
  }

  private _selectByClick(event: MouseEvent): void {
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

    this.id ||= `sbb-option-${nextId++}`;

    const signal = this._abort.signal;
    const parentGroup = this.closest?.('sbb-optgroup');
    if (parentGroup) {
      this._disabledFromGroup = parentGroup.disabled;
      this._updateAriaDisabled();
    }
    this._optionAttributeObserver.observe(this, optionObserverConfig);

    this._negative = !!this.closest?.(
      // :is() selector not possible due to test environment
      `sbb-autocomplete[negative],sbb-select[negative],sbb-form-field[negative]`,
    );
    this.toggleAttribute('data-negative', this._negative);

    this._setVariantByContext();
    // We need to check highlight state both on slot change, but also when connecting
    // the element to the DOM. The slot change events might be swallowed when using declarative
    // shadow DOM with SSR or if the DOM is changed when disconnected.
    this._handleHighlightState();

    this.toggleAttribute('data-multiple', this._isMultiple);

    this.addEventListener('click', (e: MouseEvent) => this._selectByClick(e), {
      signal,
      passive: true,
    });
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has('disabled')) {
      setOrRemoveAttribute(this, 'tabindex', isAndroid && !this.disabled && 0);
      this._updateAriaDisabled();
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    // Init first select state because false would not call setter of selected property.
    this._updateAriaSelected();
  }

  private _updateAriaDisabled(): void {
    setOrRemoveAttribute(
      this,
      'aria-disabled',
      this.disabled || this._disabledFromGroup ? 'true' : null,
    );
  }

  private _updateAriaSelected(): void {
    this.setAttribute('aria-selected', `${this.selected}`);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._optionAttributeObserver.disconnect();
  }

  private _setVariantByContext(): void {
    if (this.closest?.('sbb-autocomplete')) {
      this._variant = 'autocomplete';
    } else if (this.closest?.('sbb-select')) {
      this._variant = 'select';
    }
  }

  /** Observe changes on data attributes and set the appropriate values. */
  private _onOptionAttributesChange(mutationsList: MutationRecord[]): void {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'data-group-disabled') {
        this._disabledFromGroup = this.hasAttribute('data-group-disabled');
        this._updateAriaDisabled();
      } else if (mutation.attributeName === 'data-negative') {
        this._negative = this.hasAttribute('data-negative');
      }
    }
  }

  private _handleHighlightState(): void {
    if (!this._isAutocomplete) {
      this._updateDisableHighlight(true);
      return;
    }

    const slotNodes = Array.from(this.childNodes ?? []).filter(
      (n) => !(n instanceof Element) || n.slot !== 'icon',
    );
    const labelNodes = slotNodes.filter((el) => el.nodeType === Node.TEXT_NODE) as Text[];

    // Disable the highlight if the slot contain more than just text nodes.
    // We need to ignore template elements, as SSR adds a declarative shadow DOM
    // in the form of a template element.
    if (
      labelNodes.length === 0 ||
      slotNodes.filter((n) => !(n instanceof Element) || n.localName !== 'template').length !==
        labelNodes.length
    ) {
      this._updateDisableHighlight(true);
      return;
    }
    this._label = labelNodes
      .map((l) => l.wholeText)
      .filter((l) => l.trim())
      .join();
  }

  private _getHighlightedLabel(): TemplateResult {
    if (!this._highlightString || !this._highlightString.trim()) {
      return html`${this._label}`;
    }

    const matchIndex = this._label!.toLowerCase().indexOf(this._highlightString.toLowerCase());

    if (matchIndex === -1) {
      return html`${this._label}`;
    }

    const prefix = this._label!.substring(0, matchIndex);
    const highlighted = this._label!.substring(
      matchIndex,
      matchIndex + this._highlightString.length,
    );
    const postfix = this._label!.substring(matchIndex + this._highlightString.length);

    return html`
      <span class="sbb-option__label--highlight">${prefix}</span><span>${highlighted}</span
      ><span class="sbb-option__label--highlight">${postfix}</span>
    `;
  }

  protected override render(): TemplateResult {
    const isMultiple = this._isMultiple;

    return html`
      <div class="sbb-option__container">
        <div class="sbb-option">
          <!-- Icon -->
          ${!isMultiple
            ? html` <span class="sbb-option__icon"> ${this.renderIconSlot()} </span>`
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
            <slot @slotchange=${this._handleHighlightState}></slot>

            <!-- Search highlight -->
            ${this._isAutocomplete && this._label && !this._disableLabelHighlight
              ? this._getHighlightedLabel()
              : nothing}
            ${inertAriaGroups && this.getAttribute('data-group-label')
              ? html` <sbb-screen-reader-only>
                  (${this.getAttribute('data-group-label')})</sbb-screen-reader-only
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
    'sbb-option': SbbOptionElement;
  }

  interface GlobalEventHandlersEventMap {
    optionSelectionChange: CustomEvent<void>;
  }
}
