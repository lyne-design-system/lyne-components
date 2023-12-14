import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';

import { LanguageController } from '../core/common-behaviors';
import { findInput, isValidAttribute, toggleDatasetEntry } from '../core/dom';
import { forwardEventToHost, EventEmitter } from '../core/eventing';
import { i18nTimeInputChange } from '../core/i18n';
import { ValidationChangeEvent, SbbDateLike } from '../core/interfaces';

import style from './time-input.scss?lit&inline';

const REGEX_ALLOWED_CHARACTERS = /[0-9.:,\-;_hH]/;
const REGEX_GROUPS_WITHOUT_COLON = /^([0-9]{1,2})([0-9]{2})$/;
const REGEX_GROUPS_WITH_COLON = /^([0-9]{1,2})?[.:,\-;_hH]?([0-9]{1,2})?$/;

interface Time {
  hours: number;
  minutes: number;
}

/**
 * * Combined with a native input, it displays the input's value as a formatted time.
 *
 * @event {CustomEvent<void>} didChange - Deprecated. used for React. Will probably be removed once React 19 is available.
 * @event {CustomEvent<ValidationChangeEvent>} validationChange - Emits whenever the internal validation state changes.
 */
@customElement('sbb-time-input')
export class SbbTimeInputElement extends LitElement {
  public static override styles: CSSResultGroup = style;
  public static readonly events = {
    didChange: 'didChange',
    validationChange: 'validationChange',
  } as const;

  /** Reference of the native input connected to the datepicker. */
  @property()
  public set input(value: string | HTMLElement) {
    this._input = value;
    this._findInputElement();
  }
  public get input(): string | HTMLElement {
    return this._input;
  }
  private _input: string | HTMLElement;

  /** Formats the current input's value as date. */
  @property({ attribute: false })
  public set valueAsDate(date: SbbDateLike) {
    if (!date || !this._inputElement) {
      return;
    }
    const dateObj = date instanceof Date ? date : new Date(date);

    this._inputElement.value = this._formatValue({
      hours: dateObj.getHours(),
      minutes: dateObj.getMinutes(),
    });

    // Emit blur event when value is changed programmatically to notify
    // frameworks that rely on that event to update form status.
    this._inputElement.dispatchEvent(new FocusEvent('blur', { composed: true }));
  }
  public get valueAsDate(): Date | null {
    return this._formatValueAsDate(this._parseInput(this._inputElement?.value));
  }

  @state() private _inputElement: HTMLInputElement | null;

  /**
   * @deprecated only used for React. Will probably be removed once React 19 is available.
   */
  private _didChange: EventEmitter = new EventEmitter(this, SbbTimeInputElement.events.didChange, {
    bubbles: true,
    cancelable: true,
  });

  /** Emits whenever the internal validation state changes. */
  private _validationChange: EventEmitter<ValidationChangeEvent> = new EventEmitter(
    this,
    SbbTimeInputElement.events.validationChange,
    {
      bubbles: true,
      composed: false,
    },
  );

  private _statusContainer: HTMLParagraphElement | null;
  private _abortController = new AbortController();
  private _language = new LanguageController(this);

  public override connectedCallback(): void {
    super.connectedCallback();

    this._findInputElement();
    if (this._inputElement) {
      this._updateValue(this._inputElement.value);
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._abortController?.abort();
  }

  private _findInputElement(): void {
    const oldInput = this._inputElement;
    this._inputElement = findInput(this, this.input);

    if (oldInput !== this._inputElement) {
      this._registerInputElement();
    }
  }

  private _registerInputElement(): void {
    this._abortController?.abort();

    if (!this._inputElement) {
      return;
    }

    this._abortController = new AbortController();

    // Configure input
    toggleDatasetEntry(this._inputElement, 'sbbTimeInput', true);
    this._inputElement.type = 'text';
    this._inputElement.inputMode = 'numeric';
    this._inputElement.maxLength = 5;
    if (!this._inputElement.placeholder) {
      this._inputElement.placeholder = 'HH:MM';
    }

    this._inputElement.addEventListener(
      'input',
      (event: InputEvent) => forwardEventToHost(event, this),
      { signal: this._abortController.signal },
    );
    this._inputElement.addEventListener(
      'keydown',
      (event: KeyboardEvent) => this._preventCharInsert(event),
      { signal: this._abortController.signal },
    );
    this._inputElement.addEventListener(
      'change',
      (event: Event) => this._updateValueAndEmitChange(event),
      {
        signal: this._abortController.signal,
      },
    );
  }

  /** Applies the correct format to values and triggers event dispatch. */
  private _updateValueAndEmitChange(event: Event): void {
    this._updateValue((event.target as HTMLInputElement).value);
    this._emitChange(event);
    this._updateAccessibilityMessage();
  }

  /**
   * Updates `value` and `valueAsDate`. The direct update on the `_inputElement` is required
   * to force the input change when the typed value is the same of the current one.
   */
  private _updateValue(value: string): void {
    // Reset accessibility message
    if (this._statusContainer) {
      this._statusContainer.innerText = '';
    }
    if (!this._inputElement) {
      return;
    }

    const time = this._parseInput(value);
    const isTimeValid = time && this._isTimeValid(time);
    const isEmptyOrValid = !value || value.trim() === '' || isTimeValid;
    if (isEmptyOrValid && time) {
      this._inputElement.value = this._formatValue(time);
    }

    const wasValid = !isValidAttribute(this._inputElement, 'data-sbb-invalid');
    toggleDatasetEntry(this._inputElement, 'sbbInvalid', !isEmptyOrValid);
    if (wasValid !== isEmptyOrValid) {
      this._validationChange.emit({ valid: isEmptyOrValid });
    }
  }

  /** Emits the change event. */
  private _emitChange(event: Event): void {
    forwardEventToHost(event, this);
    this._didChange.emit();
  }

  /** Returns the right format for the `value` property . */
  private _formatValue(time?: Time): string {
    const hours = String(time.hours).padStart(2, '0');
    const minutes = String(time.minutes).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Returns the right format for the `valueAsDate` property:
   * sets the start date at 01.01.1970, then adds the typed hours/minutes.
   */
  private _formatValueAsDate(time?: Time): Date {
    if (!time || !this._isTimeValid(time)) {
      return null;
    }

    return new Date(new Date(0).setHours(time.hours, time.minutes, 0, 0));
  }

  /** Checks if values of hours and minutes are possible, to avoid non-existent times. */
  private _isTimeValid(time: Time): boolean {
    return time.hours < 24 && time.minutes < 60;
  }

  /** Validate input against the defined RegExps. */
  private _parseInput(value: string): Time {
    const trimmedValue = value?.trim();
    if (!trimmedValue) {
      return null;
    }

    // Special case: the input is 3 or 4 digits; split like: AB?:CD
    const match = trimmedValue.match(REGEX_GROUPS_WITHOUT_COLON);
    if (match) {
      return { hours: +match[1] || 0, minutes: +match[2] || 0 };
    }

    const matchColon = trimmedValue.match(REGEX_GROUPS_WITH_COLON);
    if (matchColon) {
      return { hours: +matchColon[1] || 0, minutes: +matchColon[2] || 0 };
    }

    return null;
  }

  /**  Only allow typing numbers and separator keys. */
  private _preventCharInsert(event: KeyboardEvent): void {
    const alwaysAllowed = [
      'Backspace',
      'Tab',
      'Enter',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      'PageUp',
      'PageDown',
      'Delete',
    ];

    if (
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey &&
      !alwaysAllowed.includes(event.key) &&
      !REGEX_ALLOWED_CHARACTERS.test(event.key)
    ) {
      event.preventDefault();
    }
  }

  // We use a programmatic approach to avoid initial setting the message
  // and to not immediately change output if language should change (no reason to read out message).
  private _updateAccessibilityMessage(): void {
    const valid = !isValidAttribute(this._inputElement, 'data-sbb-invalid');
    if (!valid) {
      return;
    }

    this._statusContainer.innerText = `${i18nTimeInputChange[this._language.current]} ${
      this._inputElement.value
    }.`;
  }

  protected override render(): TemplateResult {
    return html`
      <p role="status" ${ref((el) => (this._statusContainer = el as HTMLParagraphElement))}></p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-time-input': SbbTimeInputElement;
  }
}
