import { LitElement, html, type CSSResultGroup, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { SbbSlotStateController } from '../../core/controllers.js';
import type { SbbIconPlacement } from '../../core/interfaces.js';
import { SbbIconNameMixin } from '../../icon.js';
import { SbbCheckboxCommonElementMixin, checkboxCommonStyle } from '../common.js';

import '../../visual-checkbox.js';

import checkboxStyle from './checkbox.scss?lit&inline';

/**
 * It displays a checkbox enhanced with the SBB Design.
 *
 * @slot - Use the unnamed slot to add content to the `sbb-checkbox`.
 * @slot icon - Slot used to render the checkbox icon (disabled inside a selection panel).
 * @event {CustomEvent<void>} didChange - Deprecated. used for React. Will probably be removed once React 19 is available.
 * @event {Event} change - Event fired on change.
 * @event {InputEvent} input - Event fired on input.
 */
@customElement('sbb-checkbox')
export class SbbCheckboxElement extends SbbCheckboxCommonElementMixin(
  SbbIconNameMixin(LitElement),
) {
  public static override styles: CSSResultGroup = [checkboxCommonStyle, checkboxStyle];

  public static readonly events = {
    didChange: 'didChange',
  } as const;

  /** The label position relative to the labelIcon. Defaults to end */
  @property({ attribute: 'icon-placement', reflect: true })
  public iconPlacement: SbbIconPlacement = 'end';

  public constructor() {
    super();
    new SbbSlotStateController(this);
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
              <span class="sbb-checkbox__label--icon sbb-checkbox__aligner"
                >${this.renderIconSlot()}</span
              >
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
    'sbb-checkbox': SbbCheckboxElement;
  }
}
