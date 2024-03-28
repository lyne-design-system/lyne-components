import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';

import {
  LanguageController,
  SbbButtonBaseElement,
  SbbNegativeMixin,
} from '../../core/common-behaviors';
import { type DateAdapter, defaultDateAdapter } from '../../core/datetime';
import { isValidAttribute } from '../../core/dom';
import { ConnectedAbortController } from '../../core/eventing';
import { i18nToday } from '../../core/i18n';
import {
  datepickerControlRegisteredEventFactory,
  getDatePicker,
  type InputUpdateEvent,
  type SbbDatepickerElement,
} from '../datepicker';
import '../../icon';

export abstract class SbbDatepickerButton extends SbbNegativeMixin(SbbButtonBaseElement) {
  /** Datepicker reference. */
  @property({ attribute: 'date-picker' }) public datePicker?: string | SbbDatepickerElement;

  /** Whether the component is disabled due date equals to boundary date. */
  @state() private _disabled = false;

  /** Whether the component is disabled due date-picker's input disabled. */
  @state() private _inputDisabled = false;

  /** The boundary date (min/max) as set in the date-picker's input. */
  @state() protected boundary: string | number | null = null;

  protected datePickerElement?: SbbDatepickerElement | null = null;
  private _dateAdapter: DateAdapter<Date> = defaultDateAdapter;
  private _datePickerController!: AbortController;
  private _abort = new ConnectedAbortController(this);
  private _language = new LanguageController(this).withHandler(() => this._setAriaLabel());

  protected abstract iconName: string;
  protected abstract i18nOffBoundaryDay: Record<string, string>;
  protected abstract i18nSelectOffBoundaryDay: (_currentDate: string) => Record<string, string>;
  protected abstract findAvailableDate: (
    _date: Date,
    _dateFilter: ((date: Date) => boolean) | null,
    _dateAdapter: DateAdapter<Date>,
    _boundary: string | number | null,
  ) => Date;
  protected abstract onInputUpdated(event: CustomEvent<InputUpdateEvent>): void;

  public override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', () => this._handleClick(), { signal: this._abort.signal });
    this._syncUpstreamProperties();
    if (!this.datePicker) {
      this._init();
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

  protected setDisabledState(datepicker: SbbDatepickerElement | null | undefined): void {
    const pickerValueAsDate = datepicker?.getValueAsDate?.();

    if (!pickerValueAsDate) {
      this._disabled = true;
      return;
    }

    const availableDate: Date = this.findAvailableDate(
      pickerValueAsDate,
      datepicker?.dateFilter || null,
      this._dateAdapter,
      this.boundary,
    );
    this._disabled = this._dateAdapter.compareDate(availableDate, pickerValueAsDate) === 0;
  }

  private _handleClick(): void {
    if (!this.datePickerElement || isValidAttribute(this, 'data-disabled')) {
      return;
    }
    const startingDate: Date =
      this.datePickerElement.getValueAsDate() ?? this.datePickerElement.now();
    const date: Date = this.findAvailableDate(
      startingDate,
      this.datePickerElement.dateFilter,
      this._dateAdapter,
      this.boundary,
    );
    if (this._dateAdapter.compareDate(date, startingDate) !== 0) {
      this.datePickerElement.setValueAsDate(date);
    }
  }

  private _syncUpstreamProperties(): void {
    const formField = this.closest?.('sbb-form-field') ?? this.closest?.('[data-form-field]');
    if (formField) {
      this.negative = isValidAttribute(formField, 'negative');

      // We can't use getInputElement of SbbFormFieldElement as async awaiting is not supported in connectedCallback.
      // We here only have to look for input.
      const inputElement = formField.querySelector('input');

      if (inputElement) {
        this._inputDisabled =
          isValidAttribute(inputElement, 'disabled') || isValidAttribute(inputElement, 'readonly');
      }
    }
  }

  private _init(picker?: string | SbbDatepickerElement): void {
    this._datePickerController?.abort();
    this._datePickerController = new AbortController();
    this.datePickerElement = getDatePicker(this, picker);
    this.setDisabledState(this.datePickerElement);
    if (!this.datePickerElement) {
      // If the component is attached to the DOM before the datepicker, it has to listen for the datepicker init,
      // assuming that the two components share the same parent element.
      this.parentElement?.addEventListener(
        'inputUpdated',
        (e: CustomEvent<InputUpdateEvent>) => this._init(e.target as SbbDatepickerElement),
        { once: true, signal: this._datePickerController.signal },
      );
      return;
    }
    this._setAriaLabel();

    this.datePickerElement.addEventListener(
      'change',
      (event: Event) => {
        this.setDisabledState(event.target as SbbDatepickerElement);
        this._setAriaLabel();
      },
      { signal: this._datePickerController.signal },
    );
    this.datePickerElement.addEventListener(
      'datePickerUpdated',
      (event: Event) => {
        this.setDisabledState(event.target as SbbDatepickerElement);
        this._setAriaLabel();
      },
      { signal: this._datePickerController.signal },
    );
    this.datePickerElement.addEventListener(
      'inputUpdated',
      (event: CustomEvent<InputUpdateEvent>) => {
        this._inputDisabled = !!(event.detail.disabled || event.detail.readonly);
        this._setAriaLabel();
        this.onInputUpdated(event);
      },
      { signal: this._datePickerController.signal },
    );

    this.datePickerElement.dispatchEvent(datepickerControlRegisteredEventFactory());
  }

  private _setAriaLabel(): void {
    const currentDate = this.datePickerElement?.getValueAsDate?.();

    if (!currentDate || !this._dateAdapter.isValid(currentDate)) {
      this.setAttribute('aria-label', this.i18nOffBoundaryDay[this._language.current]);
      return;
    }

    const currentDateString =
      this.datePickerElement?.now().toDateString() === currentDate.toDateString()
        ? i18nToday[this._language.current].toLowerCase()
        : this._dateAdapter.getAccessibilityFormatDate(currentDate);

    this.setAttribute(
      'aria-label',
      this.i18nSelectOffBoundaryDay(currentDateString)[this._language.current],
    );
  }

  private _setDisabledRenderAttributes(): void {
    this.toggleAttribute('data-disabled', this._disabled || this._inputDisabled);
    if (isValidAttribute(this, 'data-disabled')) {
      this.setAttribute('aria-disabled', 'true');
      this.removeAttribute('tabindex');
    } else {
      this.removeAttribute('aria-disabled');
      this.setAttribute('tabindex', '0');
    }
  }

  protected override renderTemplate(): TemplateResult {
    this._setDisabledRenderAttributes();
    return html` <sbb-icon name=${this.iconName}></sbb-icon> `;
  }
}
