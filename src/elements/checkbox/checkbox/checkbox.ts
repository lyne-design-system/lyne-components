import {
  type CSSResultGroup,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { SbbLanguageController, SbbSlotStateController } from '../../core/controllers.js';
import { EventEmitter } from '../../core/eventing.js';
import { i18nCollapsed, i18nExpanded } from '../../core/i18n.js';
import type {
  SbbCheckedStateChange,
  SbbDisabledStateChange,
  SbbIconPlacement,
  SbbStateChange,
} from '../../core/interfaces.js';
import {
  SbbFormAssociatedCheckboxMixin,
  SbbHydrationMixin,
  SbbUpdateSchedulerMixin,
} from '../../core/mixins.js';
import { SbbIconNameMixin } from '../../icon.js';
import type { SbbSelectionPanelElement } from '../../selection-panel.js';
import type { SbbCheckboxGroupElement } from '../checkbox-group.js';

import style from './checkbox.scss?lit&inline';

import '../../screen-reader-only.js';
import '../../visual-checkbox.js';

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
 * @event {Event} change - Event fired on change.
 * @event {InputEvent} input - Event fired on input.
 */
@customElement('sbb-checkbox')
export class SbbCheckboxElement extends SbbUpdateSchedulerMixin(
  SbbFormAssociatedCheckboxMixin(SbbIconNameMixin(SbbHydrationMixin(LitElement))),
) {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    didChange: 'didChange',
    stateChange: 'stateChange',
    checkboxLoaded: 'checkboxLoaded',
  } as const;

  /** Whether the checkbox is indeterminate. */
  @property({ type: Boolean }) public indeterminate = false;

  /** The label position relative to the labelIcon. Defaults to end */
  @property({ attribute: 'icon-placement', reflect: true })
  public iconPlacement: SbbIconPlacement = 'end';

  /** Label size variant, either m or s. */
  @property({ reflect: true })
  public set size(value: SbbCheckboxSize) {
    this._size = value;
  }
  public get size(): SbbCheckboxSize {
    return this.group?.size ?? this._size;
  }
  private _size: SbbCheckboxSize = 'm';

  /** Reference to the connected checkbox group. */
  public get group(): SbbCheckboxGroupElement | null {
    return this._group;
  }
  private _group: SbbCheckboxGroupElement | null = null;

  /**
   * Whether the input is the main input of a selection panel.
   * @internal
   */
  public get isSelectionPanelInput(): boolean {
    return this.hasAttribute('data-is-selection-panel-input');
  }

  /** The label describing whether the selection panel is expanded (for screen readers only). */
  @state() private _selectionPanelExpandedLabel!: string;

  private _language = new SbbLanguageController(this);
  private _selectionPanelElement: SbbSelectionPanelElement | null = null;

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

  public constructor() {
    super();
    new SbbSlotStateController(this);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._group = this.closest('sbb-checkbox-group') as SbbCheckboxGroupElement;
    // We can use closest here, as we expect the parent sbb-selection-panel to be in light DOM.
    this._selectionPanelElement = this.closest?.('sbb-selection-panel');
    this.toggleAttribute('data-is-inside-selection-panel', !!this._selectionPanelElement);
    this.toggleAttribute(
      'data-is-selection-panel-input',
      !!this._selectionPanelElement && !this.closest?.('sbb-selection-panel [slot="content"]'),
    );

    this._checkboxLoaded.emit();

    // We need to call requestUpdate to update the reflected attributes
    ['disabled', 'required', 'size'].forEach((p) => this.requestUpdate(p));
  }

  protected override async willUpdate(changedProperties: PropertyValues<this>): Promise<void> {
    super.willUpdate(changedProperties);

    if (changedProperties.has('checked')) {
      if (this.isSelectionPanelInput && this.checked !== changedProperties.get('checked')!) {
        this._stateChange.emit({ type: 'checked', checked: this.checked });
        this._updateExpandedLabel();
      }
    }
    if (changedProperties.has('disabled')) {
      if (this.isSelectionPanelInput && this.disabled !== changedProperties.get('disabled')!) {
        this._stateChange.emit({ type: 'disabled', disabled: this.disabled });
      }
    }
    if (changedProperties.has('checked') || changedProperties.has('indeterminate')) {
      this.internals.ariaChecked = this.indeterminate ? 'mixed' : `${this.checked}`;
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

  protected override isDisabledExternally(): boolean {
    return this.group?.disabled ?? false;
  }

  protected override isRequiredExternally(): boolean {
    return this.group?.required ?? false;
  }

  protected override withUserInteraction(): void {
    if (this.indeterminate) {
      this.indeterminate = false;
    }
  }

  private async _updateExpandedLabel(): Promise<void> {
    await this.hydrationComplete;
    if (!this._selectionPanelElement?.hasContent) {
      this._selectionPanelExpandedLabel = '';
      this.removeAttribute('data-has-selection-panel-label');
      return;
    }

    this._selectionPanelExpandedLabel = this.checked
      ? ', ' + i18nExpanded[this._language.current]
      : ', ' + i18nCollapsed[this._language.current];
    this.toggleAttribute('data-has-selection-panel-label', true);
  }

  protected override render(): TemplateResult {
    return html`
      <span class="sbb-checkbox-wrapper">
        <span class="sbb-checkbox">
          <span class="sbb-checkbox__inner">
            <span class="sbb-checkbox__aligner">
              <sbb-visual-checkbox
                ?checked=${this.checked}
                ?indeterminate=${this.indeterminate}
                ?disabled=${this.disabled || this.formDisabled}
              ></sbb-visual-checkbox>
            </span>
            <span class="sbb-checkbox__label">
              <slot></slot>
              <span class="sbb-checkbox__label--icon">${this.renderIconSlot()}</span>
              <slot name="suffix"></slot>
            </span>
          </span>
          <slot name="subtext"></slot>
          <sbb-screen-reader-only class="sbb-checkbox__expanded-label">
            ${this._selectionPanelExpandedLabel}
          </sbb-screen-reader-only>
        </span>
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
