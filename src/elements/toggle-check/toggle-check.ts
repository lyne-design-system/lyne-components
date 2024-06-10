import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { SbbSlotStateController } from '../core/controllers.js';
import { SbbFormAssociatedCheckboxMixin } from '../core/mixins.js';
import { SbbIconNameMixin } from '../icon.js';

import style from './toggle-check.scss?lit&inline';

/**
 * It displays a toggle checkbox.
 *
 * @slot - Use the unnamed slot to add content to the toggle label.
 * @slot icon - Use this slot to provide an icon. If `icon-name` is set, a sbb-icon will be used.
 * @event {CustomEvent<void>} didChange - Deprecated. used for React. Will probably be removed once React 19 is available.
 * @event {Event} change - Event fired on change.
 * @event {InputEvent} input - Event fired on input.
 */
@customElement('sbb-toggle-check')
export class SbbToggleCheckElement extends SbbFormAssociatedCheckboxMixin(
  SbbIconNameMixin(LitElement),
) {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    didChange: 'didChange',
  } as const;

  /** Size variant, either m or s. */
  @property({ reflect: true }) public size: 's' | 'm' = 's';

  /** The svg name for the true state - default -> 'tick-small' */
  @property({ attribute: 'icon-name' }) public override iconName = 'tick-small';

  /** The label position relative to the toggle. Defaults to 'after' */
  @property({ attribute: 'label-position', reflect: true })
  public labelPosition?: 'before' | 'after' = 'after';

  public constructor() {
    super();
    new SbbSlotStateController(this);
  }

  protected override async willUpdate(changedProperties: PropertyValues<this>): Promise<void> {
    super.willUpdate(changedProperties);

    if (changedProperties.has('checked')) {
      this.internals.ariaChecked = `${this.checked}`;
      this.toggleAttribute('data-checked', this.checked);
    }
  }

  protected override render(): TemplateResult {
    return html`
      <span class="sbb-toggle-check">
        <span class="sbb-toggle-check__container">
          <span class="sbb-toggle-check__label">
            <slot></slot>
          </span>
          <span class="sbb-toggle-check__track">
            <span class="sbb-toggle-check__circle">
              <span class="sbb-toggle-check__icon"> ${this.renderIconSlot()} </span>
            </span>
          </span>
        </span>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-toggle-check': SbbToggleCheckElement;
  }
}
