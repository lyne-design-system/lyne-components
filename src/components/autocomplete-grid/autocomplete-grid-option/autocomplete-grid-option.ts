import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { assignId } from '../../core/a11y';
import {
  hostAttributes,
  NamedSlotStateController,
  SbbDisabledMixin,
  SbbIconNameMixin,
} from '../../core/common-behaviors';
import { isSafari, isValidAttribute, isAndroid, setAttribute } from '../../core/dom';
import { EventEmitter, ConnectedAbortController } from '../../core/eventing';
import { AgnosticMutationObserver } from '../../core/observers';

import style from './autocomplete-grid-option.scss?lit&inline';
import '../../icon';

let nextId = 0;

/** Configuration for the attribute to look at if component is nested in a sbb-optgroup */
const optionObserverConfig: MutationObserverInit = {
  attributeFilter: ['data-group-disabled', 'data-negative'],
};

/**
 * It displays on option item which can be used in `sbb-autocomplete-grid`.
 *
 * @slot - Use the unnamed slot to add content to the option label.
 * @slot icon - Use this slot to provide an icon. If `icon-name` is set, a sbb-icon will be used.
 * @event {CustomEvent<void>} autocompleteOptionSelectionChange - Emits when the option selection status changes.
 * @event {CustomEvent<void>} autocompleteOptionSelected - Emits when an option was selected by user.
 * @cssprop [--sbb-option-icon-container-display=none] - Can be used to reserve space even
 * when preserve-icon-space on autocomplete is not set or iconName is not set.
 */
@customElement('sbb-autocomplete-grid-option')
@hostAttributes({
  role: 'gridcell',
})
export class SbbAutocompleteGridOptionElement extends SbbDisabledMixin(
  SbbIconNameMixin(LitElement),
) {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    selectionChange: 'autocompleteOptionSelectionChange',
    optionSelected: 'autocompleteOptionSelected',
  } as const;

  /** Value of the option. */
  @property() public value?: string;

  /** Whether the option is currently active. */
  @property({ reflect: true, type: Boolean }) public active?: boolean;

  /** Whether the option is selected. */
  @property({ reflect: true, type: Boolean }) public selected = false;

  /** Emits when the option selection status changes. */
  private _selectionChange: EventEmitter = new EventEmitter(
    this,
    SbbAutocompleteGridOptionElement.events.selectionChange,
  );

  /** Emits when an option was selected by user. */
  private _optionSelected: EventEmitter = new EventEmitter(
    this,
    SbbAutocompleteGridOptionElement.events.optionSelected,
  );

  /** Whether to apply the negative styling */
  @state() private _negative = false;

  /** Whether the component must be set disabled due disabled attribute on sbb-optgroup. */
  @state() private _disabledFromGroup = false;

  @state() private _label?: string;

  /** The portion of the highlighted label. */
  @state() private _highlightString: string | null = null;

  /** Disable the highlight of the label. */
  @state() private _disableLabelHighlight: boolean = false;

  @state() private _groupLabel: string | null = null;

  private _optionId = `sbb-autocomplete-grid-option-${++nextId}`;
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

  private _selectByClick(event: MouseEvent): void {
    if (this.disabled || this._disabledFromGroup) {
      event.stopPropagation();
      return;
    }

    this.setSelectedViaUserInteraction(true);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    const parentGroup = this.closest?.('sbb-autocomplete-grid-optgroup');
    if (parentGroup) {
      this._disabledFromGroup = parentGroup.disabled;
    }
    this._optionAttributeObserver.observe(this, optionObserverConfig);

    this._negative = !!this.closest?.(
      // :is() selector not possible due to test environment
      `sbb-autocomplete-grid[negative],sbb-form-field[negative]`,
    );
    this.toggleAttribute('data-negative', this._negative);

    this.addEventListener('click', (e: MouseEvent) => this._selectByClick(e), {
      signal,
      passive: true,
    });
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._optionAttributeObserver.disconnect();
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
    const slotNodes = (event.target as HTMLSlotElement).assignedNodes();
    const labelNodes = slotNodes.filter((el) => el.nodeType === Node.TEXT_NODE) as Text[];

    // Disable the highlight if the slot contain more than just text nodes
    if (labelNodes.length === 0 || slotNodes.length !== labelNodes.length) {
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
    setAttribute(this, 'tabindex', isAndroid() && !this.disabled && 0);
    setAttribute(this, 'data-disable-highlight', this._disableLabelHighlight);
    setAttribute(this, 'aria-selected', `${this.selected}`); // fixme check this on keynav
    setAttribute(this, 'aria-disabled', `${this.disabled || this._disabledFromGroup}`);
    assignId(() => this._optionId)(this);

    return html`
      <div class="sbb-option__container">
        <div class="sbb-option">
          <span class="sbb-option__icon"> ${this.renderIconSlot()} </span>

          <span class="sbb-option__label">
            <slot @slotchange=${this._setupHighlightHandler}></slot>

            ${this._label && !this._disableLabelHighlight ? this._getHighlightedLabel() : nothing}
            ${this._inertAriaGroups && this._groupLabel
              ? html`
                  <span class="sbb-option__group-label--visually-hidden">
                    (${this._groupLabel})
                  </span>
                `
              : nothing}
          </span>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-autocomplete-grid-option': SbbAutocompleteGridOptionElement;
  }

  interface GlobalEventHandlersEventMap {
    autocompleteOptionSelectionChange: CustomEvent<void>;
  }
}
