import {
  type CSSResultGroup,
  html,
  LitElement,
  type TemplateResult,
  type PropertyValues,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { breakpoints, isBreakpoint } from '../../core/dom';
import { ConnectedAbortController } from '../../core/eventing';
import type { SbbHorizontalFrom, SbbOrientation } from '../../core/interfaces';
import type { SbbStepElement } from '../step/step';

import style from './stepper.scss?lit&inline';

/**
 * Describe the purpose of the component with a single short sentence.
 *
 * @slot - Use the unnamed slot to add `sbb-TODO` elements.
 * @event {CustomEvent<any>} myEventName - TODO: Document this event
 */
@customElement('sbb-stepper')
export class SbbStepperElement extends LitElement {
  public static override styles: CSSResultGroup = style;

  /**
   * If set to true, only the current and previous labels can be clicked and selected.
   */
  @property({ type: Boolean }) public linear = false;

  /**
   * Overrides the behaviour of `orientation` property.
   */
  @property({ attribute: 'horizontal-from', reflect: true })
  public get horizontalFrom(): SbbHorizontalFrom | undefined {
    return this._horizontalFrom;
  }
  public set horizontalFrom(value: SbbHorizontalFrom) {
    this._horizontalFrom = breakpoints.includes(value) ? value : undefined;
    if (this._horizontalFrom) {
      this._checkOrientation();
    }
  }
  private _horizontalFrom?: SbbHorizontalFrom | undefined;

  /**
   * Steps orientation, either horizontal or vertical.
   */
  @property({ reflect: true })
  public orientation: SbbOrientation = 'horizontal';

  public get selected(): SbbStepElement | undefined {
    return this.querySelector<SbbStepElement>('sbb-step[data-selected]') ?? undefined;
  }

  public set selected(step: SbbStepElement) {
    this._select(step);
  }

  public get selectedIndex(): number | undefined {
    return this.selected ? this.steps.indexOf(this.selected) : undefined;
  }

  public set selectedIndex(index: number) {
    this._select(this.steps[index]);
  }

  public get steps(): SbbStepElement[] {
    return Array.from(this.querySelectorAll('sbb-step'));
  }

  public next(): void {
    if (this.selectedIndex !== undefined) {
      this._select(this.steps[this.selectedIndex + 1]);
    }
  }

  public previous(): void {
    if (this.selectedIndex !== undefined) {
      this._select(this.steps[this.selectedIndex - 1]);
    }
  }

  private _abort = new ConnectedAbortController(this);

  private _isValidStep(step: SbbStepElement): boolean {
    if (!step || step === this.selected || step.hasAttribute('disabled')) {
      return false;
    }

    if (this.linear && !this.selected) {
      return step === this.steps[0];
    }

    if (this.linear && this.selectedIndex !== undefined) {
      const index = this.steps.indexOf(step);
      return index < this.selectedIndex || index === this.selectedIndex + 1;
    }

    return true;
  }

  private _select(step: SbbStepElement): void {
    if (!this._isValidStep(step)) {
      return;
    }
    const validatePayload = {
      currentIndex: this.selectedIndex,
      currentStep: this.selected,
      nextIndex: this.selectedIndex !== undefined ? this.selectedIndex + 1 : undefined,
      nextStep: this.selectedIndex !== undefined ? this.steps[this.selectedIndex + 1] : undefined,
    };
    if (this.selected && !this.selected.validate(validatePayload)) {
      return;
    }
    const current = this.selected;
    if (current && current.label) {
      current.toggleAttribute('data-selected', false);
      current.label.internals.ariaSelected = 'false';
      current.label.toggleAttribute('data-selected', false);
    }
    if (step && step.label) {
      step.toggleAttribute('data-selected', true);
      step.label.internals.ariaSelected = 'true';
      step.label.toggleAttribute('data-selected', true);
      this._setMarkerSize();
    }
  }

  private _setMarkerSize(): void {
    if (!this.selected || this.selectedIndex === undefined || !this.selected.label) {
      return;
    }
    const offset =
      this.orientation === 'horizontal'
        ? this.selected.label.offsetLeft + this.selected.label.offsetWidth
        : this.selected.label.offsetHeight * (this.selectedIndex + 1) +
          parseFloat(getComputedStyle(this).getPropertyValue('--sbb-spacing-responsive-m')) *
            16 *
            this.selectedIndex;
    this.style.setProperty('--sbb-stepper-marker-size', `${offset}px`);
  }

  private _configure(): void {
    console.log('configure...');

    const labels = this.steps.map((s) => s.label);
    let posInSet = 0;
    labels.forEach((label) => {
      if (label) {
        label.internals.ariaPosInSet = `${++posInSet}`;
        label.internals.ariaSetSize = `${labels.length}`;
      }
    });
  }

  private _updateLabels(): void {
    this.steps.forEach((step) => {
      step.slot = this.orientation === 'horizontal' ? 'step' : 'step-label';
      step.setAttribute('data-orientation', this.orientation);
    });
  }

  private _checkOrientation(): void {
    if (this.horizontalFrom) {
      this.orientation = isBreakpoint(this.horizontalFrom) ? 'horizontal' : 'vertical';
      this._updateLabels();
    }
    setTimeout(() => this._setMarkerSize(), 0);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    window.addEventListener('resize', () => this._checkOrientation(), {
      signal,
      passive: true,
    });
  }

  protected override async firstUpdated(): Promise<void> {
    await this.updateComplete;
    this.selectedIndex = !this.linear ? Number(this.getAttribute('selected-index')) || 0 : 0;
    this._checkOrientation();
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('orientation') && !this.horizontalFrom) {
      this._updateLabels();
      this._setMarkerSize();
    }
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-stepper">
        <div class="sbb-stepper__labels" role="tablist">
          <slot name="step-label" @slotchange=${this._configure}></slot>
        </div>
        <div class="sbb-stepper__steps">
          <slot name="step"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-stepper': SbbStepperElement;
  }
}
