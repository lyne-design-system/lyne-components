import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  NamedSlotStateController,
  SbbDisabledTabIndexActionMixin,
  SbbButtonBaseElement,
} from '../../core/common-behaviors';
import { EventEmitter, ConnectedAbortController } from '../../core/eventing';
import type {
  SbbCheckedStateChange,
  SbbStateChange,
  SbbValueStateChange,
} from '../../core/interfaces';
import { SbbIconNameMixin } from '../../icon';

import style from './tag.scss?lit&inline';

export type SbbTagStateChange = Extract<
  SbbStateChange,
  SbbValueStateChange | SbbCheckedStateChange
>;

/**
 * It displays a selectable element which can be used as a filter.
 *
 * @slot - Use the unnamed slot to add content to the tag label.
 * @slot icon - Use this slot to display an icon at the component start, by providing a `sbb-icon` component.
 * @slot amount - Provide an amount to show it at the component end.
 * @event {CustomEvent<void>} input - Input event emitter
 * @event {CustomEvent<void>} didChange - Deprecated. used for React. Will probably be removed once React 19 is available.
 * @event {CustomEvent<void>} change - Change event emitter
 */
@customElement('sbb-tag')
export class SbbTagElement extends SbbIconNameMixin(
  SbbDisabledTabIndexActionMixin(SbbButtonBaseElement),
) {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    input: 'input',
    didChange: 'didChange',
    change: 'change',
  } as const;

  /** Amount displayed inside the tag. */
  @property({ reflect: true }) public amount?: string;

  /** Whether the tag is checked. */
  @property({ reflect: true, type: Boolean }) public checked = false;

  /** Input event emitter */
  private _input: EventEmitter = new EventEmitter(this, SbbTagElement.events.input, {
    bubbles: true,
    composed: true,
  });

  /** @deprecated only used for React. Will probably be removed once React 19 is available. */
  private _didChange: EventEmitter = new EventEmitter(this, SbbTagElement.events.didChange, {
    bubbles: true,
  });

  /** Change event emitter */
  private _change: EventEmitter = new EventEmitter(this, SbbTagElement.events.change, {
    bubbles: true,
  });

  private _abort = new ConnectedAbortController(this);

  public constructor() {
    super();
    new NamedSlotStateController(this);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', () => this._handleClick(), { signal: this._abort.signal });
  }

  /** Method triggered on button click. Inverts the checked value and emits events. */
  private _handleClick(): void {
    if (this.disabled) {
      return;
    }

    // Prevent deactivating on exclusive / radio mode
    const tagGroup = this.closest('sbb-tag-group');
    if (tagGroup && !tagGroup.multiple && this.checked) {
      return;
    }
    this.checked = !this.checked;
    this._input.emit();
    this._change.emit();
    this._didChange.emit();
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);
    const tagGroup = this.closest?.('sbb-tag-group');
    if (tagGroup && !tagGroup.multiple && changedProperties.has('checked') && this.checked) {
      tagGroup?.tags.filter((t) => t !== this).forEach((t) => (t.checked = false));
    }
  }

  protected override renderTemplate(): TemplateResult {
    // We have to ensure that the value is always present
    this.setAttribute('aria-pressed', this.checked.toString());
    return html`
      <span class="sbb-tag__icon sbb-tag--shift"> ${this.renderIconSlot()} </span>
      <span class="sbb-tag__text sbb-tag--shift">
        <slot></slot>
      </span>
      <span class="sbb-tag__amount sbb-tag--shift">
        <slot name="amount">${this.amount}</slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-tag': SbbTagElement;
  }
}
