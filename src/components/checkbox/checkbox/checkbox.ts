import { CSSResultGroup, html, LitElement, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import { setAttributes } from '../../core/dom';
import {
  createNamedSlotState,
  documentLanguage,
  HandlerRepository,
  languageChangeHandlerAspect,
  namedSlotChangeHandlerAspect,
  formElementHandlerAspect,
  getEventTarget,
  forwardEventToHost,
  EventEmitter,
  ConnectedAbortController,
} from '../../core/eventing';
import { i18nCollapsed, i18nExpanded } from '../../core/i18n';
import {
  SbbIconPlacement,
  SbbStateChange,
  SbbCheckedStateChange,
  SbbDisabledStateChange,
} from '../../core/interfaces';
import '../../visual-checkbox';
import '../../icon';
import type { SbbCheckboxGroup } from '../checkbox-group';

import style from './checkbox.scss?lit&inline';

export type SbbCheckboxStateChange = Extract<
  SbbStateChange,
  SbbDisabledStateChange | SbbCheckedStateChange
>;

export type SbbCheckboxSize = 's' | 'm';

/**
 * It displays a checkbox enhanced with the SBB Design.
 *
 * @slot - Use the unnamed slot to add content to the `sbb-checkbox`.
 * @slot icon - Slot used to render the checkbox icon (disabled inside a selection panel).
 * @slot subtext - Slot used to render a subtext under the label (only visible within a selection panel).
 * @slot suffix - Slot used to render additional content after the label (only visible within a selection panel).
 * @event {CustomEvent<void>} didChange - Deprecated. used for React. Will probably be removed once React 19 is available.
 */
@customElement('sbb-checkbox')
export class SbbCheckboxElement extends LitElement {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    didChange: 'didChange',
    stateChange: 'stateChange',
    checkboxLoaded: 'checkboxLoaded',
  } as const;

  /** Value of checkbox. */
  @property() public value?: string;

  /** Whether the checkbox is disabled. */
  @property({ reflect: true, type: Boolean })
  public set disabled(value: boolean) {
    this._disabled = value;
  }
  public get disabled(): boolean {
    return this._disabled || (this.group?.disabled ?? false);
  }
  private _disabled = false;

  /** Whether the checkbox is required. */
  @property({ reflect: true, type: Boolean })
  public set required(value: boolean) {
    this._required = value;
  }
  public get required(): boolean {
    return this._required || (this.group?.required ?? false);
  }
  private _required = false;

  /** Reference to the connected checkbox group. */
  public get group(): SbbCheckboxGroup | null {
    return this._group;
  }
  private _group: SbbCheckboxGroup | null;

  /** Whether the checkbox is indeterminate. */
  @property({ reflect: true, type: Boolean }) public indeterminate = false;

  /**
   * The icon name we want to use, choose from the small icon variants from the ui-icons category
   * from https://icons.app.sbb.ch (optional).
   */
  @property({ attribute: 'icon-name' }) public iconName?: string;

  /** The label position relative to the labelIcon. Defaults to end */
  @property({ attribute: 'icon-placement', reflect: true })
  public iconPlacement: SbbIconPlacement = 'end';

  /** Whether the checkbox is checked. */
  @property({ reflect: true, type: Boolean }) public checked = false;

  /** Label size variant, either m or s. */
  @property({ reflect: true })
  public set size(value: SbbCheckboxSize) {
    this._size = value;
  }
  public get size(): SbbCheckboxSize {
    return this.group?.size ?? this._size;
  }
  private _size: SbbCheckboxSize = 'm';

  /** State of listed named slots, by indicating whether any element for a named slot is defined. */
  @state() private _namedSlots = createNamedSlotState('icon', 'subtext', 'suffix');

  @state() private _currentLanguage = documentLanguage();

  /** Whether the input is the main input of a selection panel. */
  @state() private _isSelectionPanelInput = false;

  /** The label describing whether the selection panel is expanded (for screen readers only). */
  @state() private _selectionPanelExpandedLabel: string;

  private _checkbox: HTMLInputElement;
  private _selectionPanelElement: HTMLElement;
  private _abort: ConnectedAbortController = new ConnectedAbortController(this);

  /**
   * @deprecated only used for React. Will probably be removed once React 19 is available.
   */
  private _didChange: EventEmitter = new EventEmitter(this, SbbCheckboxElement.events.didChange, {
    bubbles: true,
    cancelable: true,
  });

  /**
   * @internal
   * Internal event that emits whenever the state of the checkbox
   * in relation to the parent selection panel changes.
   */
  private _stateChange: EventEmitter<SbbCheckboxStateChange> = new EventEmitter(
    this,
    SbbCheckboxElement.events.stateChange,
    { bubbles: true },
  );

  /**
   * @internal
   * Internal event that emits when the checkbox is loaded.
   */
  private _checkboxLoaded: EventEmitter<void> = new EventEmitter(
    this,
    SbbCheckboxElement.events.checkboxLoaded,
    { bubbles: true },
  );

  private _handleCheckedChange(currentValue: boolean, previousValue: boolean): void {
    if (this._isSelectionPanelInput && currentValue !== previousValue) {
      this._stateChange.emit({ type: 'checked', checked: currentValue });
      this._updateExpandedLabel();
    }
  }

  private _handleDisabledChange(currentValue: boolean, previousValue: boolean): void {
    if (this._isSelectionPanelInput && currentValue !== previousValue) {
      this._stateChange.emit({ type: 'disabled', disabled: currentValue });
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
    this._group = this.closest('sbb-checkbox-group') as SbbCheckboxGroup;
    // We can use closest here, as we expect the parent sbb-selection-panel to be in light DOM.
    this._selectionPanelElement = this.closest?.('sbb-selection-panel');
    this._isSelectionPanelInput =
      !!this._selectionPanelElement && !this.closest?.('sbb-selection-panel [slot="content"]');

    const signal = this._abort.signal;
    this.addEventListener('click', (e) => this._handleClick(e), { signal });
    this.addEventListener('keyup', (e) => this._handleKeyup(e), { signal });
    this._handlerRepository.connect();
    this._checkboxLoaded.emit();
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
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
  }

  // Forward the click on the inner label.
  private _handleClick(event: MouseEvent): void {
    if (!this.disabled && getEventTarget(event) === this) {
      this.shadowRoot.querySelector('label').click();
    }
  }

  private _handleKeyup(event: KeyboardEvent): void {
    // The native checkbox input toggles state on keyup with space.
    if (!this.disabled && event.key === ' ') {
      // The toggle needs to happen after the keyup event finishes, so we schedule
      // it to be triggered after the current event loop.
      setTimeout(() => this._checkbox.click());
    }
  }

  private _handleChangeEvent(event: Event): void {
    forwardEventToHost(event, this);
    this._didChange.emit();
  }

  /**
   * Method triggered on checkbox input event.
   * If not indeterminate, inverts the value; otherwise sets checked to true.
   */
  private _handleInputEvent(): void {
    if (this.indeterminate) {
      this.checked = true;
      this.indeterminate = false;
    } else {
      this.checked = this._checkbox?.checked ?? false;
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
    const attributes: Record<string, string | boolean> = {
      role: 'checkbox',
      'aria-checked': this.indeterminate ? 'mixed' : this.checked?.toString() ?? 'false',
      'aria-required': this.required.toString(),
      'aria-disabled': this.disabled.toString(),
      'data-is-selection-panel-input': this._isSelectionPanelInput,
      ...(this.disabled ? undefined : { tabIndex: '0' }),
    };
    setAttributes(this, attributes);

    return html`
      <span class="sbb-checkbox-wrapper">
        <label class="sbb-checkbox">
          <input
            type="checkbox"
            aria-hidden="true"
            tabindex=${-1}
            ?disabled=${this.disabled}
            ?required=${this.required}
            ?checked=${this.checked}
            .value=${this.value || nothing}
            @input=${() => this._handleInputEvent()}
            @change=${(event) => this._handleChangeEvent(event)}
            @focus=${() => this.focus()}
            ${ref((checkbox: HTMLInputElement) => {
              if (checkbox) {
                this._checkbox = checkbox;
                // Forward indeterminate state to native input. As it is only a property, we have to set it programmatically.
                this._checkbox.indeterminate = this.indeterminate;
              }
            })}
          />
          <span class="sbb-checkbox__inner">
            <span class="sbb-checkbox__aligner">
              <sbb-visual-checkbox
                ?checked=${this.checked}
                ?indeterminate=${this.indeterminate}
                ?disabled=${this.disabled}
              ></sbb-visual-checkbox>
            </span>
            <span class="sbb-checkbox__label">
              <slot></slot>
              ${this.iconName || (this._namedSlots['icon'] && !this._isSelectionPanelInput)
                ? html`<span class="sbb-checkbox__label--icon">
                    <slot name="icon">
                      ${this.iconName
                        ? html`<sbb-icon name="${this.iconName}"></sbb-icon>`
                        : nothing}
                    </slot>
                  </span>`
                : nothing}
              ${!!this._selectionPanelElement && this._namedSlots['suffix']
                ? html`<slot name="suffix"></slot>`
                : nothing}
            </span>
          </span>
          ${!!this._selectionPanelElement && this._namedSlots['subtext']
            ? html`<slot name="subtext"></slot>`
            : nothing}
          ${this._isSelectionPanelInput && this._selectionPanelExpandedLabel
            ? html`<span class="sbb-checkbox__expanded-label"
                >${this._selectionPanelExpandedLabel}</span
              >`
            : nothing}
        </label>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-checkbox': SbbCheckboxElement;
  }
}
