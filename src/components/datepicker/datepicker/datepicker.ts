import { CSSResultGroup, LitElement, PropertyValues, TemplateResult, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { LanguageController } from '../../core/common-behaviors';
import { readConfig } from '../../core/config';
import { DateAdapter, defaultDateAdapter } from '../../core/datetime';
import {
  findInput,
  findReferencedElement,
  isValidAttribute,
  toggleDatasetEntry,
} from '../../core/dom';
import { ConnectedAbortController, EventEmitter } from '../../core/eventing';
import { i18nDateChangedTo, i18nDatePickerPlaceholder } from '../../core/i18n';
import { ValidationChangeEvent, SbbDateLike } from '../../core/interfaces';
import { AgnosticMutationObserver } from '../../core/observers';
import type { SbbDatepickerNextDayElement } from '../datepicker-next-day';
import type { SbbDatepickerPreviousDayElement } from '../datepicker-previous-day';
import type { SbbDatepickerToggleElement } from '../datepicker-toggle';

import style from './datepicker.scss?lit&inline';

const FORMAT_DATE =
  /(^0?[1-9]?|[12]?[0-9]?|3?[01]?)[.,\\/\-\s](0?[1-9]?|1?[0-2]?)?[.,\\/\-\s](\d{1,4}$)?/;

export interface InputUpdateEvent {
  disabled: boolean;
  readonly: boolean;
  min: string | number;
  max: string | number;
}

/**
 * Given a SbbDatepickerPreviousDayElement, a SbbDatepickerNextDayElement or a SbbDatepickerToggleElement component,
 * it returns the related SbbDatepickerElement reference, if exists.
 * @param element The element potentially connected to the SbbDatepickerElement.
 * @param trigger The id or the reference of the SbbDatePicker.
 */
export function getDatePicker(
  element:
    | SbbDatepickerPreviousDayElement
    | SbbDatepickerNextDayElement
    | SbbDatepickerToggleElement,
  trigger?: string | HTMLElement,
): SbbDatepickerElement {
  if (!trigger) {
    const parent = element.closest?.('sbb-form-field');
    return parent?.querySelector('sbb-datepicker');
  }

  return findReferencedElement<SbbDatepickerElement>(trigger);
}

/**
 * Returns the first available date before or after a given one, considering the SbbDatepickerElement `dateFilter` property.
 * @param date The starting date for calculations.
 * @param delta The number of days to add/subtract from the starting one.
 * @param dateFilter The dateFilter function from the SbbDatepickerElement.
 * @param dateAdapter The adapter class.
 */
export function getAvailableDate(
  date: Date,
  delta: number,
  dateFilter: (date: Date) => boolean,
  dateAdapter: DateAdapter<Date>,
): Date {
  let availableDate = dateAdapter.addCalendarDays(date, delta);

  if (dateFilter) {
    while (!dateFilter(availableDate)) {
      availableDate = dateAdapter.addCalendarDays(availableDate, delta);
    }
  }

  return availableDate;
}

/**
 * Calculates the first available date before the given one,
 * considering the SbbDatepickerElement `dateFilter` property and `min` parameter (e.g. from the self-named input's attribute).
 * @param date The starting date for calculations.
 * @param dateFilter The dateFilter function from the SbbDatepickerElement.
 * @param dateAdapter The adapter class.
 * @param min The minimum value to consider in calculations.
 */
export function findPreviousAvailableDate(
  date: Date,
  dateFilter: (date: Date) => boolean,
  dateAdapter: DateAdapter<Date>,
  min: string | number,
): Date {
  const previousDate = getAvailableDate(date, -1, dateFilter, dateAdapter);
  const dateMin: Date = dateAdapter.deserializeDate(min);

  if (
    !dateMin ||
    (dateAdapter.isValid(dateMin) && dateAdapter.compareDate(previousDate, dateMin) >= 0)
  ) {
    return previousDate;
  }
  return date;
}

/**
 * Calculates the first available date after the given one,
 * considering the SbbDatepickerElement `dateFilter` property and `max` parameter (e.g. from the self-named input's attribute).
 * @param date The starting date for calculations.
 * @param dateFilter The dateFilter function from the SbbDatepickerElement.
 * @param dateAdapter The adapter class.
 * @param max The maximum value to consider in calculations.
 */
export function findNextAvailableDate(
  date: Date,
  dateFilter: (date: Date) => boolean,
  dateAdapter: DateAdapter<Date>,
  max: string | number,
): Date {
  const nextDate = getAvailableDate(date, 1, dateFilter, dateAdapter);
  const dateMax: Date = dateAdapter.deserializeDate(max);

  if (
    !dateMax ||
    (dateAdapter.isValid(dateMax) && dateAdapter.compareDate(nextDate, dateMax) <= 0)
  ) {
    return nextDate;
  }
  return date;
}

/**
 * Checks if the provided date is a valid one, considering the SbbDatepickerElement `dateFilter` property
 * and `min` and `max` parameters (e.g. from the self-named input's attributes).
 * @param date The starting date for calculations.
 * @param dateFilter The dateFilter function from the SbbDatepickerElement.
 * @param min The minimum value to consider in calculations.
 * @param max The maximum value to consider in calculations.
 */
export function isDateAvailable(
  date: Date,
  dateFilter: (date: Date) => boolean,
  min: string | number,
  max: string | number,
): boolean {
  // TODO: Get date adapter from config
  const dateAdapter: DateAdapter<Date> = defaultDateAdapter;
  const dateMin: Date = dateAdapter.deserializeDate(min);
  const dateMax: Date = dateAdapter.deserializeDate(max);

  if (
    (dateAdapter.isValid(dateMin) && dateAdapter.compareDate(date, dateMin) < 0) ||
    (dateAdapter.isValid(dateMax) && dateAdapter.compareDate(date, dateMax) > 0)
  ) {
    return false;
  }

  return dateFilter ? dateFilter(date) : true;
}

export const datepickerControlRegisteredEventFactory = (): CustomEvent =>
  new CustomEvent('datepickerControlRegistered', {
    bubbles: false,
    composed: true,
  });

/**
 * Combined with a native input, it displays the input's value as a formatted date.
 *
 * @event {CustomEvent<void>} didChange - Deprecated. used for React. Will probably be removed once React 19 is available.
 * @event {CustomEvent<void>} change - Notifies that the connected input has changes.
 * @event {CustomEvent<InputUpdateEvent>} inputUpdated - Notifies that the attributes of the input connected to the datepicker have changes.
 * @event {CustomEvent<void>} datePickerUpdated - Notifies that the attributes of the datepicker have changes.
 * @event {CustomEvent<ValidationChangeEvent>} validationChange - Emits whenever the internal validation state changes.
 */
@customElement('sbb-datepicker')
export class SbbDatepickerElement extends LitElement {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    didChange: 'didChange',
    change: 'change',
    inputUpdated: 'inputUpdated',
    datePickerUpdated: 'datePickerUpdated',
    validationChange: 'validationChange',
  } as const;

  /** If set to true, two months are displayed. */
  @property({ type: Boolean }) public wide = false;

  /** A function used to filter out dates. */
  @property({ attribute: 'date-filter' }) public dateFilter: (date: Date | null) => boolean = () =>
    true;

  /** A function used to parse string value into dates. */
  @property({ attribute: 'date-parser' }) public dateParser?: (value: string) => Date | undefined;

  /** A function used to format dates into the preferred string format. */
  @property() public format?: (date: Date) => string;

  /** Reference of the native input connected to the datepicker. */
  @property() public input?: string | HTMLElement;

  /** Formats the current input's value as date. */
  @property({ attribute: false })
  public set valueAsDate(date: SbbDateLike) {
    const parsedDate = date instanceof Date ? date : new Date(date);
    this._formatAndUpdateValue(this._inputElement.value, parsedDate);
    /* Emit blur event when value is changed programmatically to notify
    frameworks that rely on that event to update form status. */
    this._inputElement.dispatchEvent(new Event('blur', { composed: true }));
  }
  public get valueAsDate(): Date | undefined {
    return this._parse(this._inputElement?.value);
  }

  /**
   * @deprecated only used for React. Will probably be removed once React 19 is available.
   */
  private _didChange: EventEmitter = new EventEmitter(this, SbbDatepickerElement.events.didChange, {
    bubbles: true,
    cancelable: true,
  });

  /** Notifies that the connected input has changes. */
  private _change: EventEmitter = new EventEmitter(this, SbbDatepickerElement.events.change, {
    bubbles: true,
  });

  /** Notifies that the attributes of the input connected to the datepicker have changes. */
  private _inputUpdated: EventEmitter<InputUpdateEvent> = new EventEmitter(
    this,
    SbbDatepickerElement.events.inputUpdated,
    { bubbles: true, cancelable: true },
  );

  /** Notifies that the attributes of the datepicker have changes. */
  private _datePickerUpdated: EventEmitter = new EventEmitter(
    this,
    SbbDatepickerElement.events.datePickerUpdated,
    {
      bubbles: true,
      cancelable: true,
    },
  );

  /** Emits whenever the internal validation state changes. */
  private _validationChange: EventEmitter<ValidationChangeEvent> = new EventEmitter(
    this,
    SbbDatepickerElement.events.validationChange,
  );

  @state() private get _inputElement(): HTMLInputElement | null {
    return this._inputElementState;
  }

  private set _inputElement(value: HTMLInputElement) {
    const oldValue = this._inputElementState;
    this._inputElementState = value;
    this._registerInputElement(this._inputElementState, oldValue);
  }

  private _inputElementState: HTMLInputElement | null;

  private _findInput(newValue: string | HTMLElement, oldValue: string | HTMLElement): void {
    if (newValue !== oldValue) {
      this._inputElement = findInput(this, this.input);
    }
  }

  private _datepickerPropChanged(newValue: any, oldValue: any): void {
    if (newValue !== oldValue) {
      this._datePickerUpdated.emit();
    }
  }

  private _registerInputElement(newValue: HTMLInputElement, oldValue: HTMLInputElement): void {
    if (newValue !== oldValue) {
      this._datePickerController?.abort();
      this._datePickerController = new AbortController();

      if (!this._inputElement) {
        return;
      }

      this._inputObserver?.disconnect();
      this._inputObserver.observe(this._inputElement, {
        attributeFilter: ['disabled', 'readonly', 'min', 'max', 'value'],
      });

      this._inputElement.type = 'text';

      if (!this._inputElement.placeholder) {
        this._inputElement.placeholder = i18nDatePickerPlaceholder[this._language.current];
      }

      this._inputElement.addEventListener(
        'change',
        (event: Event) => {
          if (!(event instanceof CustomEvent)) {
            this._valueChanged(event);
          }
        },
        {
          signal: this._datePickerController.signal,
        },
      );
    }
  }

  private _onInputPropertiesChange(mutationsList?: MutationRecord[]): void {
    this._inputUpdated.emit({
      disabled: this._inputElement?.disabled,
      readonly: this._inputElement?.readOnly,
      min: this._inputElement?.min,
      max: this._inputElement?.max,
    });

    if (mutationsList && Array.from(mutationsList).some((e) => e.attributeName === 'value')) {
      this._inputElement.value = this._getValidValue(this._inputElement?.getAttribute('value'));
    }
  }

  private _datePickerController: AbortController;

  private _inputObserver = new AgnosticMutationObserver(this._onInputPropertiesChange.bind(this));

  private _dateAdapter: DateAdapter<Date> =
    readConfig().datetime?.dateAdapter ?? defaultDateAdapter;

  private _abort = new ConnectedAbortController(this);
  private _language = new LanguageController(this).withHandler(() => {
    if (this._inputElement) {
      this._inputElement.placeholder = i18nDatePickerPlaceholder[this._language.current];
      this._inputElement.value = this._format(this.valueAsDate);
    }
  });

  public override connectedCallback(): void {
    super.connectedCallback();
    const signal = this._abort.signal;
    this.addEventListener('datepickerControlRegistered', () => this._onInputPropertiesChange(), {
      signal,
    });
    this._inputElement = findInput(this, this.input);
    if (this._inputElement) {
      this._inputElement.value = this._getValidValue(this._inputElement.value);
      this._inputUpdated.emit({
        disabled: this._inputElement?.disabled,
        readonly: this._inputElement?.readOnly,
        min: this._inputElement?.min,
        max: this._inputElement?.max,
      });
    }
  }

  public override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('input')) {
      this._findInput(this.input, changedProperties.get('input'));
    }
    if (changedProperties.has('wide') || changedProperties.has('dateFilter')) {
      this._datepickerPropChanged(this.wide, changedProperties.get('wide'));
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._inputObserver?.disconnect();
    this._datePickerController?.abort();
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this._setAriaLiveMessage(this.valueAsDate);
  }

  private _parseAndFormatValue(value: string): string {
    const d = this._parse(value);
    return !this._dateAdapter.isValid(d) ? value : this._format(d);
  }

  private _createAndComposeDate(value: SbbDateLike): string {
    const date = new Date(value);
    return this._format(date);
  }

  private _valueChanged(event): void {
    this._formatAndUpdateValue(event.target.value, this._parse(event.target.value));
  }

  /** Applies the correct format to values and triggers event dispatch. */
  private _formatAndUpdateValue(value: string, valueAsDate: Date): void {
    if (this._inputElement) {
      this._inputElement.value = !this._dateAdapter.isValid(valueAsDate)
        ? value
        : this._format(valueAsDate);

      const isEmptyOrValid =
        !value ||
        (!!valueAsDate &&
          isDateAvailable(
            valueAsDate,
            this.dateFilter,
            this._inputElement?.min,
            this._inputElement?.max,
          ));
      const wasValid = !isValidAttribute(this._inputElement, 'data-sbb-invalid');
      toggleDatasetEntry(this._inputElement, 'sbbInvalid', !isEmptyOrValid);
      if (wasValid !== isEmptyOrValid) {
        this._validationChange.emit({ valid: isEmptyOrValid });
      }
      this._emitChange(valueAsDate);
    }
  }

  /** Emits the change event. */
  private _emitChange(date: Date): void {
    this._setAriaLiveMessage(date);

    this._change.emit();
    this._didChange.emit();

    if (this._inputElement) {
      this._inputElement.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
      this._inputElement.dispatchEvent(
        new CustomEvent('change', { bubbles: true, composed: true }),
      );
    }
  }

  private _getValidValue(value: string): string {
    if (!value) {
      return '';
    }

    const match: RegExpMatchArray = value.match(FORMAT_DATE);

    if (match?.index === 0) {
      return this._parseAndFormatValue(value);
    } else if (Number.isInteger(+value)) {
      return this._createAndComposeDate(+value);
    } else if (this._dateAdapter.isValid(new Date(value))) {
      return this._createAndComposeDate(value);
    }

    return value;
  }

  private _parse(value: string): Date | undefined {
    return this.dateParser ? this.dateParser(value) : this._dateAdapter.parseDate(value);
  }

  private _format(date: Date): string {
    return this.format ? this.format(date) : this._dateAdapter.format(date);
  }

  private _setAriaLiveMessage(date: Date): void {
    const ariaLiveFormatter = new Intl.DateTimeFormat(`${this._language.current}-CH`, {
      weekday: 'long',
    });

    const dateFormatter = new Intl.DateTimeFormat('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const containerElement: HTMLParagraphElement | undefined =
      this.shadowRoot.querySelector?.('#status-container');

    if (containerElement) {
      containerElement.innerText = date
        ? `${i18nDateChangedTo[this._language.current]} ${ariaLiveFormatter.format(
            date,
          )}, ${dateFormatter.format(date)}`
        : '';
    }
  }

  protected override render(): TemplateResult {
    return html`<p id="status-container" role="status"></p>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-datepicker': SbbDatepickerElement;
  }
}
