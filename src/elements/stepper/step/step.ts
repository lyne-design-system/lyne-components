import {
  type CSSResultGroup,
  html,
  LitElement,
  type TemplateResult,
  type PropertyValues,
} from 'lit';
import { customElement } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import { SbbConnectedAbortController } from '../../core/controllers.js';
import { hostAttributes } from '../../core/decorators.js';
import { EventEmitter } from '../../core/eventing.js';
import { AgnosticResizeObserver } from '../../core/observers.js';
import type { SbbStepLabelElement } from '../step-label.js';
import type { SbbStepperElement } from '../stepper.js';

import style from './step.scss?lit&inline';

let nextId = 0;

export type SbbStepValidateEventDetails = {
  currentIndex?: number;
  currentStep?: SbbStepElement;
  nextIndex?: number;
  nextStep?: SbbStepElement;
};

/**
 * Combined with a `sbb-stepper`, it displays a step's content.
 *
 * @slot - Use the unnamed slot to provide content.
 * @event {CustomEvent<SbbStepValidateEventDetails>} validate - Emits whenever step switch is triggered. Can be canceled.
 */
@customElement('sbb-step')
@hostAttributes({
  slot: 'step',
  role: 'tabpanel',
})
export class SbbStepElement extends LitElement {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    validate: 'validate',
  } as const;

  /** Emits whenever step switch is triggered. */
  private _validate: EventEmitter<SbbStepValidateEventDetails> = new EventEmitter(
    this,
    SbbStepElement.events.validate,
  );

  private _loaded: boolean = false;
  private _abort = new SbbConnectedAbortController(this);
  private _stepper: SbbStepperElement | null = null;
  private _label: SbbStepLabelElement | null = null;
  private _stepResizeObserver = new AgnosticResizeObserver((entries) =>
    this._onStepElementResize(entries),
  );

  /** The label of the step. */
  public get label(): SbbStepLabelElement | null {
    return this._label;
  }

  /**
   * Selects and configures the step.
   * @internal
   */
  public select(): void {
    if (!this._loaded || !this.label) {
      return;
    }
    this.toggleAttribute('data-selected', true);
    this.label.select();
  }

  /**
   * Deselects and configures the step.
   * @internal
   */
  public deselect(): void {
    if (!this.label) {
      return;
    }
    this.toggleAttribute('data-selected', false);
    this.label.deselect();
  }

  /**
   * Emits a validate event whenever step switch is triggered.
   * @internal
   */
  public validate(eventData: SbbStepValidateEventDetails): boolean {
    return !!this._validate.emit(eventData);
  }

  /**
   * Configures the step.
   * @internal
   */
  public configure(stepperLoaded: boolean): void {
    if (stepperLoaded) {
      this._label = this._getStepLabel();
    }
    if (this.label) {
      this.setAttribute('aria-labelledby', this.label.id);
    }
  }

  /** Watches for clicked elements with `sbb-stepper-next` or `sbb-stepper-previous` attributes. */
  private _handleClick(event: Event): void {
    const composedPathElements = event
      .composedPath()
      .filter((el) => el instanceof window.HTMLElement);
    if (composedPathElements.some((el) => this._isGoNextElement(el as HTMLElement))) {
      this._stepper?.next();
    } else if (composedPathElements.some((el) => this._isGoPreviousElement(el as HTMLElement))) {
      this._stepper?.previous();
    }
  }

  private _isGoNextElement(element: HTMLElement): boolean {
    return element.hasAttribute('sbb-stepper-next') && !element.hasAttribute('disabled');
  }

  private _isGoPreviousElement(element: HTMLElement): boolean {
    return element.hasAttribute('sbb-stepper-previous') && !element.hasAttribute('disabled');
  }

  private _onStepElementResize(entries: ResizeObserverEntry[]): void {
    if (!this.hasAttribute('data-selected')) {
      return;
    }
    const contentHeight = Math.floor(entries[0].contentRect.height);
    this._stepper?.style?.setProperty('--sbb-stepper-content-height', `${contentHeight}px`);
  }

  private _getStepLabel(): SbbStepLabelElement | null {
    let previousSibling = this.previousElementSibling;
    while (previousSibling && previousSibling.localName !== 'sbb-step-label') {
      previousSibling = previousSibling.previousElementSibling;
    }
    return previousSibling as SbbStepLabelElement;
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.id = this.id || `sbb-step-${nextId++}`;
    this.addEventListener('click', (e) => this._handleClick(e), { signal });
    this._stepper = this.closest('sbb-stepper');
    this._label = this._getStepLabel();
  }

  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);
    this._loaded = true;
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stepResizeObserver.disconnect();
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-step--wrapper">
        <div
          class="sbb-step"
          ${ref((step) => step && this._stepResizeObserver.observe(step as HTMLElement))}
        >
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-step': SbbStepElement;
  }
}
