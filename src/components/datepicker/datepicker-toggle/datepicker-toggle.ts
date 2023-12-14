import { CSSResultGroup, html, LitElement, nothing, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import type { SbbCalendarElement } from '../../calendar';
import { sbbInputModalityDetector } from '../../core/a11y';
import { LanguageController } from '../../core/common-behaviors';
import { isValidAttribute, setAttribute } from '../../core/dom';
import { i18nShowCalendar } from '../../core/i18n';
import type { SbbTooltipElement, SbbTooltipTriggerElement } from '../../tooltip';
import {
  datepickerControlRegisteredEventFactory,
  getDatePicker,
  InputUpdateEvent,
  type SbbDatepickerElement,
} from '../datepicker';
import '../../calendar';
import '../../tooltip';

import style from './datepicker-toggle.scss?lit&inline';

/**
 * Combined with a `sbb-datepicker`, it can be used to select a date from a `sbb-calendar`.
 */
@customElement('sbb-datepicker-toggle')
export class SbbDatepickerToggleElement extends LitElement {
  public static override styles: CSSResultGroup = style;

  /** Datepicker reference. */
  @property({ attribute: 'date-picker' }) public datePicker?: string | SbbDatepickerElement;

  /** Whether the animation is disabled. */
  @property({ attribute: 'disable-animation', type: Boolean }) public disableAnimation = false;

  /** Negative coloring variant flag. */
  @property({ reflect: true, type: Boolean }) public negative = false;

  @state() private _disabled = false;

  @state() private _min: string | number;

  @state() private _max: string | number;

  private _datePickerElement: SbbDatepickerElement;

  private _calendarElement: SbbCalendarElement;

  private _triggerElement: SbbTooltipTriggerElement;

  private _tooltipElement: SbbTooltipElement;

  private _datePickerController: AbortController;

  private _language = new LanguageController(this);

  /**
   * Opens the calendar.
   */
  public open(): void {
    if (!this._triggerElement) {
      this._triggerElement = this.shadowRoot.querySelector('sbb-tooltip-trigger');
    }
    this._triggerElement.click();
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    if (!this.datePicker) {
      this._init();
    }

    const formField = this.closest?.('sbb-form-field') ?? this.closest?.('[data-form-field]');
    if (formField) {
      this.negative = isValidAttribute(formField, 'negative');
    }
  }

  public override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('datePicker')) {
      this._init(this.datePicker);
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._datePickerController?.abort();
  }

  private _init(datePicker?: string | SbbDatepickerElement): void {
    this._datePickerController?.abort();
    this._datePickerController = new AbortController();
    this._datePickerElement = getDatePicker(this, datePicker);
    if (!this._datePickerElement) {
      // If the component is attached to the DOM before the datepicker, it has to listen for the datepicker init,
      // assuming that the two components share the same parent element.
      this.parentElement.addEventListener(
        'inputUpdated',
        (e: Event) => this._init(e.target as SbbDatepickerElement),
        { once: true, signal: this._datePickerController.signal },
      );
      return;
    }

    this._datePickerElement?.addEventListener(
      'inputUpdated',
      (event: CustomEvent<InputUpdateEvent>) => {
        this._datePickerElement = event.target as SbbDatepickerElement;
        this._disabled = event.detail.disabled || event.detail.readonly;
        this._min = event.detail.min;
        this._max = event.detail.max;
      },
      { signal: this._datePickerController.signal },
    );
    this._datePickerElement?.addEventListener(
      'change',
      (event: Event) => this._datePickerChanged(event),
      {
        signal: this._datePickerController.signal,
      },
    );
    this._datePickerElement?.addEventListener(
      'datePickerUpdated',
      (event: Event) =>
        this._configureCalendar(this._calendarElement, event.target as SbbDatepickerElement),
      { signal: this._datePickerController.signal },
    );
    this._datePickerElement.dispatchEvent(datepickerControlRegisteredEventFactory());
  }

  private _configureCalendar(calendar: SbbCalendarElement, datepicker: SbbDatepickerElement): void {
    if (!calendar || !datepicker) {
      return;
    }
    calendar.wide = datepicker?.wide;
    calendar.dateFilter = datepicker?.dateFilter;
  }

  private _datePickerChanged(event: Event): void {
    this._datePickerElement = event.target as SbbDatepickerElement;
    this._calendarElement.selectedDate = this._datePickerElement.valueAsDate;
  }

  private _assignCalendar(calendar: SbbCalendarElement): void {
    if (this._calendarElement && this._calendarElement === calendar) {
      return;
    }
    this._calendarElement = calendar;
    if (
      !this._datePickerElement ||
      !this._datePickerElement.valueAsDate ||
      !this._calendarElement?.resetPosition
    ) {
      return;
    }
    this._calendarElement.selectedDate = this._datePickerElement.valueAsDate;
    this._configureCalendar(this._calendarElement, this._datePickerElement);
    this._calendarElement.resetPosition();
  }

  private _hasDataNow(): boolean {
    if (!this._datePickerElement) {
      return false;
    }
    const dataNow = +this._datePickerElement.dataset?.now;
    return !isNaN(dataNow);
  }

  private _now(): Date {
    if (this._hasDataNow()) {
      const today = new Date(+this._datePickerElement.dataset?.now);
      today.setHours(0, 0, 0, 0);
      return today;
    }
    return undefined;
  }

  protected override updated(): void {
    this._tooltipElement.trigger = this._triggerElement;
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'slot', 'prefix');
    return html`
      <sbb-tooltip-trigger
        icon-name="calendar-small"
        aria-label=${i18nShowCalendar[this._language.current]}
        ?disabled=${!this._datePickerElement || this._disabled}
        ?negative=${this.negative}
        data-icon-small
        ${ref((el: SbbTooltipTriggerElement) => (this._triggerElement = el))}
      ></sbb-tooltip-trigger>
      <sbb-tooltip
        @willOpen=${() => this._calendarElement.resetPosition()}
        @didOpen=${() => {
          sbbInputModalityDetector.mostRecentModality === 'keyboard' &&
            this._calendarElement.focus();
        }}
        .trigger=${this._triggerElement}
        ?disable-animation=${this.disableAnimation}
        hide-close-button
        ${ref((el: SbbTooltipElement) => (this._tooltipElement = el))}
      >
        <sbb-calendar
          data-now=${this._now()?.valueOf() || nothing}
          .min=${this._min}
          .max=${this._max}
          ?wide=${this._datePickerElement?.wide}
          .dateFilter=${this._datePickerElement?.dateFilter}
          @dateSelected=${(d: CustomEvent<Date>) => {
            const newDate = new Date(d.detail);
            this._calendarElement.selectedDate = newDate;
            this._datePickerElement.valueAsDate = newDate;
          }}
          ${ref((calendar: SbbCalendarElement) => this._assignCalendar(calendar))}
        ></sbb-calendar>
      </sbb-tooltip>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-datepicker-toggle': SbbDatepickerToggleElement;
  }
}
