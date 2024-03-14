import { type CSSResultGroup, html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import {
  SbbButtonBaseElement,
  SbbDisabledTabIndexActionMixin,
  SbbIconNameMixin,
  hostAttributes,
} from '../../core/common-behaviors';
import { ConnectedAbortController } from '../../core/eventing';
import type { SbbStepElement } from '../step/step';
import type { SbbStepperElement } from '../stepper';

import style from './step-label.scss?lit&inline';
import '../../icon';

let nextId = 0;

/**
 * Combined with a `sbb-stepper`, it displays a step's label.
 *
 * @slot - Use the unnamed slot to provide a label.
 */
@hostAttributes({
  slot: 'step-label',
  role: 'tab',
})
@customElement('sbb-step-label')
export class SbbStepLabelElement extends SbbIconNameMixin(
  SbbDisabledTabIndexActionMixin(SbbButtonBaseElement),
) {
  public static override styles: CSSResultGroup = style;

  public get step(): SbbStepElement | null {
    return this._step;
  }

  private _abort = new ConnectedAbortController(this);
  private _stepper: SbbStepperElement | null = null;
  private _step: SbbStepElement | null = null;

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.id = this.id || `sbb-step-label-${nextId++}`;
    this._stepper = this.closest('sbb-stepper');
    if (this.nextElementSibling?.tagName === 'SBB-STEP') {
      this._step = this.nextElementSibling as SbbStepElement;
    }
    this.addEventListener(
      'click',
      () => {
        if (this._stepper && this._step) {
          this._stepper.selected = this._step;
        }
      },
      { signal },
    );
  }

  protected override firstUpdated(): void {
    if (this.step) {
      this.setAttribute('aria-controls', this.step.id);
    }
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-step-label">
        <div class="sbb-step-label__prefix">${this.renderIconSlot()}</div>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-step-label': SbbStepLabelElement;
  }
}