import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { assignId } from '../../core/a11y';
import {
  hostAttributes,
  NamedSlotStateController,
  SbbDisabledMixin,
} from '../../core/common-behaviors';
import { isSafari, isValidAttribute, isAndroid, setAttribute } from '../../core/dom';
import { EventEmitter, ConnectedAbortController } from '../../core/eventing';
import { AgnosticMutationObserver } from '../../core/observers';
import { SbbIconNameMixin } from '../../icon';

import style from './option.scss?lit&inline';

import '../../screen-reader-only';
import '../../visual-checkbox';

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

  /** Value of the option. */
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

  /** Wheter to apply the negative styling */
  @state() private _negative = false;

  /** Whether the component must be set disabled due disabled attribute on sbb-checkbox-group. */
  @state() private _disabledFromGroup = false;

  @state() private _label?: string;

  /** The portion of the highlighted label. */
  @state() private _highlightString: string | null = null;

  /** Disable the highlight of the label. */
  @state() private _disableLabelHighlight: boolean = false;

  private _optionId = `sbb-option-${++nextId}`;
  private _variant!: SbbOptionVariant;
  private _abort = new ConnectedAbortController(this);

  /**
   * On Safari, the groups labels are not read by VoiceOver.
   * To solve the problem, we remove the role="group" and add an hidden span containing the group name
   * TODO: We should periodically check if it has been solved and, if so, remove the property.
   */
  private _inertAriaGroups = isSafari();

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
    return !!this.closest?.('sbb-select')?.hasAttribute('multiple');
  }

  public constructor() {
    super();
    new NamedSlotStateController(this);
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
    const signal = this._abort.signal;
    const parentGroup = this.closest?.('sbb-optgroup');
    if (parentGroup) {
      this._disabledFromGroup = parentGroup.disabled;
    }
    this._optionAttributeObserver.observe(this, optionObserverConfig);

    this._negative = !!this.closest?.(
      // :is() selector not possible due to test environment
      `sbb-autocomplete[negative],sbb-select[negative],sbb-form-field[negative]`,
    );
    this.toggleAttribute('data-negative', this._negative);

    this._setVariantByContext();

    this.addEventListener('click', (e: MouseEvent) => this._selectByClick(e), {
      signal,
      passive: true,
    });
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
        this._disabledFromGroup = isValidAttribute(this, 'data-group-disabled');
      } else if (mutation.attributeName === 'data-negative') {
        this._negative = isValidAttribute(this, 'data-negative');
      }
    }
  }

  private _setupHighlightHandler(event: Event): void {
    if (!this._isAutocomplete) {
      this._disableLabelHighlight = true;
      return;
    }

    const slotNodes = (event.target as HTMLSlotElement).assignedNodes();
    const labelNodes = slotNodes.filter((el) => el.nodeType === Node.TEXT_NODE) as Text[];

    // Disable the highlight if the slot contain more than just text nodes
    if (
      labelNodes.length === 0 ||
      slotNodes.filter((n) => !(n instanceof Element) || n.localName !== 'template').length !==
        labelNodes.length
    ) {
      this._disableLabelHighlight = true;
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
            <slot @slotchange=${this._setupHighlightHandler}></slot>

            <!-- Search highlight -->
            ${this._isAutocomplete && this._label && !this._disableLabelHighlight
              ? this._getHighlightedLabel()
              : nothing}
            ${this._inertAriaGroups && this.getAttribute('data-group-label')
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
