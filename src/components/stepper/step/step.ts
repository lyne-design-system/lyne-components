import { type CSSResultGroup, html, LitElement, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import { hostAttributes } from '../../core/common-behaviors';
import { isValidAttribute } from '../../core/dom';
import { ConnectedAbortController, EventEmitter } from '../../core/eventing';
import { AgnosticResizeObserver } from '../../core/observers';
import type { SbbStepLabelElement } from '../step-label';
import type { SbbStepperElement } from '../stepper';

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
 * @slot - Use the unnamed slot to provide a content.
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

  /**
   * Emits whenever step switch is triggered.
   */
  private _validate: EventEmitter<SbbStepValidateEventDetails> = new EventEmitter(
    this,
    SbbStepElement.events.validate,
  );

  private _abort = new ConnectedAbortController(this);
  private _stepper: SbbStepperElement | null = null;
  private _label: SbbStepLabelElement | null = null;
  private _stepResizeObserver = new AgnosticResizeObserver((entries) =>
    this._onStepElementResize(entries),
  );

  /**
   * The label of the step.
   */
  public get label(): SbbStepLabelElement | null {
    return this._label;
  }

  /**
   * Selects and configures the step.
   * @internal
   */
  public select(): void {
    if (!this.label) {
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

  public validate(eventData: SbbStepValidateEventDetails): boolean {
    return !!this._validate.emit(eventData);
  }

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
    return element.hasAttribute('sbb-stepper-next') && !isValidAttribute(element, 'disabled');
  }

  private _isGoPreviousElement(element: HTMLElement): boolean {
    return element.hasAttribute('sbb-stepper-previous') && !isValidAttribute(element, 'disabled');
  }

  private _onStepElementResize(entries: ResizeObserverEntry[]): void {
    if (!this.hasAttribute('data-selected')) {
      return;
    }
    for (const entry of entries) {
      const contentHeight = Math.floor(entry.contentRect.height);
      this._stepper?.style?.setProperty('--sbb-stepper-content-height', `${contentHeight}px`);
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.id = this.id || `sbb-step-${nextId++}`;
    this.addEventListener('click', (e) => this._handleClick(e), { signal });
    this._stepper = this.closest('sbb-stepper');
    if (this.previousElementSibling?.tagName === 'SBB-STEP-LABEL') {
      this._label = this.previousElementSibling as SbbStepLabelElement;
    }
  }

  protected override firstUpdated(): void {
    this._stepResizeObserver.observe(this.shadowRoot!.querySelector('.sbb-step')!);
    if (this.label) {
      this.setAttribute('aria-labelledby', this.label.id);
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stepResizeObserver.disconnect();
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sbb-step--wrapper">
        <div class="sbb-step">
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
