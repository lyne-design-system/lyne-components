import { isArrowKeyOrPageKeysPressed, sbbInputModalityDetector } from '../../global/a11y';
import {
  DateAdapter,
  DAYS_PER_ROW,
  MONTHS_PER_ROW,
  NativeDateAdapter,
  YEARS_PER_PAGE,
  YEARS_PER_ROW,
} from '../../global/datetime';
import { isBreakpoint, toggleDatasetEntry } from '../../global/dom';
import {
  documentLanguage,
  HandlerRepository,
  languageChangeHandlerAspect,
  EventEmitter,
} from '../../global/eventing';
import {
  i18nCalendarDateSelection,
  i18nNextMonth,
  i18nNextYear,
  i18nNextYearRange,
  i18nPreviousMonth,
  i18nPreviousYear,
  i18nPreviousYearRange,
  i18nYearMonthSelection,
} from '../../global/i18n';
import { setAttribute } from '../../global/dom';
import { CalendarView, Day, Month, Weekday } from './sbb-calendar.custom';
import { CSSResult, html, LitElement, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import Style from './sbb-calendar.scss?lit&inline';
import '../sbb-button';
import '../sbb-icon';

/**
 * In keyboard navigation, the cell's index and the element's index in its month / year batch must be distinguished;
 * this is necessary because the navigation in the vertical direction using some keys is restricted to a single month for days,
 * and to a single range of 24 years for years. While the latter is easy to understand, the cell's index is the index
 * of the element in the array of all the rendered cells. In non-wide mode, there's no issue because the element index
 * is basically the cell's index plus 1 (element with index 0 displays the 1st of month, element with index 1 displays the 2nd and so on).
 * In wide mode, the cell's index can go from 0 to 47 for years (two batches of 24 years), and from 0 to a maximum of 61 for days
 * (two consecutive months of 31 days, as July-August or December-January), depending on the lengths of the rendered months;
 * the element index instead goes from 0 to a max value of 24 for years and 31 for days.
 * Moreover, in day view, the index of the first day of the second rendered month and the index of the last rendered day
 * can also vary depending on which months are rendered; for July-August they are equals to 31 and 61, while for February-March they are 28 and 58.
 * So, some additional parameters are needed, besides the cell's index, to correctly calculate the element to navigate to.
 */
interface CalendarKeyboardNavigationParameters {
  /** The element index within its month (or year range). */
  elementIndexForWideMode: number;
  /** In wide mode, the index of the first element in the second panel, or, alternatively, the number of elements in the first panel. */
  offsetForWideMode: number;
  /** The index of the last element within the element's month (or year range). */
  lastElementIndexForWideMode: number;
  /** The number of cells displayed in a single row, depending on the rendered view. */
  verticalOffset: number;
}

@customElement('sbb-calendar')
export class SbbCalendar extends LitElement {
  public static override styles: CSSResult = Style;

  public static readonly events = {
    dateSelected: 'date-selected',
  };

  /** If set to true, two months are displayed */
  @property({ type: Boolean }) public wide = false;

  /** The minimum valid date. Takes Date Object, ISOString, and Unix Timestamp (number of seconds since Jan 1, 1970). */
  @property() public min: Date | string | number;

  /** The maximum valid date. Takes Date Object, ISOString, and Unix Timestamp (number of seconds since Jan 1, 1970). */
  @property() public max: Date | string | number;

  /** A function used to filter out dates. */
  @property({ attribute: 'date-filter' }) public dateFilter: (date: Date | null) => boolean;

  /** The selected date. Takes Date Object, ISOString, and Unix Timestamp (number of seconds since Jan 1, 1970). */
  @property({ attribute: 'selected-date' }) public selectedDate: Date | string | number;

  /** Event emitted on date selection. */
  private _dateSelected: EventEmitter<Date> = new EventEmitter(
    this,
    SbbCalendar.events.dateSelected,
  );

  /** The currently active date. */
  @state() private _activeDate: Date;

  /** The selected date as ISOString. */
  @state() private _selected: string;

  /** The current wide property considering property value and breakpoints. From zero to small `wide` has always to be false. */
  @state() private _wide: boolean;

  /** Minimum value converted to date */
  @state() private _min: Date;

  /** Maximum value converted to date */
  @state() private _max: Date;

  @state() private _calendarView: CalendarView = 'day';

  @state() private _currentLanguage = documentLanguage();

  private _nextCalendarView: CalendarView = 'day';

  private _dateAdapter: DateAdapter<Date> = new NativeDateAdapter();

  /** A list of days, in two formats (long and single char). */
  private _weekdays: Weekday[];

  /** Grid of calendar cells representing the dates of the month. */
  private _weeks: Day[][];

  /** Grid of calendar cells representing months. */
  private _months: Month[][];

  /** Grid of calendar cells representing years. */
  private _years: number[][];

  /** Grid of calendar cells representing years for the wide view. */
  private _nextMonthYears: number[][];

  /** Grid of calendar cells representing the dates of the next month. */
  private _nextMonthWeeks: Day[][];

  /** An array containing all the month names in the current language. */
  private _monthNames: string[] = this._dateAdapter.getMonthNames('long');

  /** A list of buttons corresponding to days, months or years depending on the view. */
  private get _cells(): HTMLButtonElement[] {
    return Array.from(
      this.shadowRoot.querySelectorAll('.sbb-calendar__cell'),
    ) as HTMLButtonElement[];
  }

  /** The chosen year in the year selection view. */
  private _chosenYear: number;

  /** The chosen month in the year selection view. */
  private _chosenMonth: number;

  /** Whether the focus should be reset on focusCell. */
  private _resetFocus = false;

  private _handlerRepository = new HandlerRepository(
    this as HTMLElement,
    languageChangeHandlerAspect((l) => {
      this._currentLanguage = l;
      this._monthNames = this._dateAdapter.getMonthNames('long');
      this._months = this._createMonthRows();
    }),
  );

  private _calendarController: AbortController;

  private _convertMinDate(newMin: Date | string | number): void {
    this._min = this._dateAdapter.deserializeDate(newMin);
  }

  private _convertMaxDate(newMax: Date | string | number): void {
    this._max = this._dateAdapter.deserializeDate(newMax);
  }

  /** Sets the selected date. */
  private _setSelectedDate(selectedDate: Date | string | number): void {
    const value = this._dateAdapter.deserializeDate(selectedDate);
    if (
      !!value &&
      (!this._isDayInRange(this._dateAdapter.getISOString(value)) || this.dateFilter(value))
    ) {
      this._selected = this._dateAdapter.getISOString(value);
    } else {
      this._selected = undefined;
    }
  }

  /** Resets the active month according to the new state of the calendar. */
  public resetPosition(): void {
    if (this._calendarView !== 'day') {
      this._resetToDayView();
    }
    this._setDates();
    this._init();
  }

  public override connectedCallback(): void {
    super.connectedCallback();

    if (!this.dateFilter) {
      this.dateFilter = () => true;
    }
    this.focus = () => {
      this._resetFocus = true;
      this._focusCell();
    };
    this._handlerRepository.connect();
    this._calendarController = new AbortController();
    window.addEventListener('resize', () => this._init(), {
      passive: true,
      signal: this._calendarController.signal,
    });
    this._convertMinDate(this.min);
    this._convertMaxDate(this.max);
    this._setDates();
    this._init();
  }

  public override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('min')) {
      this._convertMinDate(this.min);
    }
    if (changedProperties.has('max')) {
      this._convertMaxDate(this.max);
    }
    if (changedProperties.has('selectedDate')) {
      this._setSelectedDate(this.selectedDate as Date);
    }
    if (changedProperties.has('wide')) {
      this.resetPosition();
    }
  }

  protected override updated(): void {
    // The calendar needs to calculate tab-indexes on first render,
    // and every time a date is selected or the month view changes.
    this._setTabIndex();
    // When changing view to year/month, the tabindex is changed, but the focused element is not,
    // so if the navigation is done via keyboard, there's the need
    // to call the `_focusCell()` method explicitly to correctly set the focus.
    if (sbbInputModalityDetector.mostRecentModality === 'keyboard') {
      this._focusCell();
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._calendarController.abort();
    this._handlerRepository.disconnect();
  }

  /** Initializes the component. */
  private _init(): void {
    this._wide = isBreakpoint('medium') && this.wide;
    toggleDatasetEntry(this, 'wide', this._wide);
    this._setWeekdays();
    this._weeks = this._createWeekRows(
      this._dateAdapter.getMonth(this._activeDate),
      this._dateAdapter.getYear(this._activeDate),
    );
    this._nextMonthWeeks = [[]];
    this._months = this._createMonthRows();
    this._nextMonthYears = [[]];
    this._years = this._createYearRows();
    if (this._wide) {
      const nextMonthDate = this._dateAdapter.addCalendarMonths(this._activeDate, 1);
      this._nextMonthWeeks = this._createWeekRows(
        this._dateAdapter.getMonth(nextMonthDate),
        this._dateAdapter.getYear(nextMonthDate),
      );
      this._nextMonthYears = this._createYearRows(YEARS_PER_PAGE);
    }
  }

  /** Focuses on a day cell prioritizing the selected day, the current day, and lastly, the first selectable day. */
  private _focusCell(): void {
    if (this._resetFocus) {
      this._getFirstFocusable()?.focus();
      this._resetFocus = false;
    }
  }

  /** Sets the date variables. */
  private _setDates(): void {
    const selectedDate: Date = this._dateAdapter.deserializeDate(this.selectedDate);
    this._activeDate = selectedDate ?? this._now();
    this._setSelectedDate(selectedDate);
  }

  /** Creates the array of weekdays. */
  private _setWeekdays(): void {
    const narrowWeekdays: string[] = this._dateAdapter.getDayOfWeekNames('narrow');
    const longWeekdays: string[] = this._dateAdapter.getDayOfWeekNames('long');
    const weekdays: Weekday[] = longWeekdays.map((long: string, i: number) => ({
      long,
      narrow: narrowWeekdays[i],
    }));

    // Rotates the labels for days of the week based on the configured first day of the week.
    const firstDayOfWeek: number = this._dateAdapter.getFirstDayOfWeek();
    this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
  }

  /** Creates the rows for each week. */
  private _createWeekRows(month: number, year: number): Day[][] {
    const daysInMonth: number = this._dateAdapter.getNumDaysInMonth(year, month);
    const dateNames: string[] = this._dateAdapter.getDateNames();
    const weeks: Day[][] = [[]];
    const weekOffset = this._dateAdapter.getFirstWeekOffset(year, month);
    for (let i = 0, cell = weekOffset; i < daysInMonth; i++, cell++) {
      if (cell === DAYS_PER_ROW) {
        weeks.push([]);
        cell = 0;
      }
      const date = this._dateAdapter.createDate(year, month, i + 1);
      weeks[weeks.length - 1].push({
        value: this._dateAdapter.getISOString(date),
        dayValue: dateNames[i],
        monthValue: String(month + 1),
        yearValue: String(year),
      });
    }
    return weeks;
  }

  /** Creates the rows for the month selection view. */
  private _createMonthRows(): Month[][] {
    const shortNames: string[] = this._dateAdapter.getMonthNames('short');
    const months: Month[] = new Array(12).fill(null).map(
      (_, i: number): Month => ({
        value: shortNames[i],
        longValue: this._monthNames[i],
        monthValue: i,
      }),
    );
    const rows: number = 12 / MONTHS_PER_ROW;
    const monthArray: Month[][] = [];
    for (let i: number = 0; i < rows; i++) {
      monthArray.push(months.slice(MONTHS_PER_ROW * i, MONTHS_PER_ROW * (i + 1)));
    }
    return monthArray;
  }

  /** Creates the rows for the year selection view. */
  private _createYearRows(offset: number = 0): number[][] {
    const startValueYearView: number = this._dateAdapter.getStartValueYearView(
      this._activeDate,
      this._min,
      this._max,
    );
    const allYears: number[] = new Array(YEARS_PER_PAGE)
      .fill(0)
      .map((_, i: number) => startValueYearView + offset + i);
    const rows: number = YEARS_PER_PAGE / YEARS_PER_ROW;
    const yearArray: number[][] = [];
    for (let i: number = 0; i < rows; i++) {
      yearArray.push(allYears.slice(YEARS_PER_ROW * i, YEARS_PER_ROW * (i + 1)));
    }
    return yearArray;
  }

  /** Checks if date is within the min-max range. */
  private _isDayInRange(date: string): boolean {
    if (!this._min && !this._max) {
      return true;
    }
    const isBeforeMin: boolean =
      this._dateAdapter.isValid(this._min) &&
      this._dateAdapter.compareDate(this._min, this._dateAdapter.createDateFromISOString(date)) > 0;
    const isAfterMax: boolean =
      this._dateAdapter.isValid(this._max) &&
      this._dateAdapter.compareDate(this._max, this._dateAdapter.createDateFromISOString(date)) < 0;
    return !(isBeforeMin || isAfterMax);
  }

  private _isMonthInRange(month: number): boolean {
    if (!this._min && !this._max) {
      return true;
    }
    const isBeforeMin: boolean =
      this._dateAdapter.isValid(this._min) &&
      this._dateAdapter.getYear(this._min) >= this._chosenYear &&
      this._dateAdapter.getMonth(this._min) > month;
    const isAfterMax: boolean =
      this._dateAdapter.isValid(this._max) &&
      this._dateAdapter.getYear(this._max) <= this._chosenYear &&
      this._dateAdapter.getMonth(this._max) < month;
    return !(isBeforeMin || isAfterMax);
  }

  private _isYearInRange(year: number): boolean {
    if (!this._min && !this._max) {
      return true;
    }
    const isBeforeMin: boolean =
      this._dateAdapter.isValid(this._min) && this._dateAdapter.getYear(this._min) > year;
    const isAfterMax: boolean =
      this._dateAdapter.isValid(this._max) && this._dateAdapter.getYear(this._max) < year;
    return !(isBeforeMin || isAfterMax);
  }

  // Implementation adapted from https://github.com/angular/components/blob/main/src/material/datepicker/year-view.ts#L366
  private _isMonthFilteredOut(month: number): boolean {
    if (!this.dateFilter) {
      return true;
    }

    const firstOfMonth = this._dateAdapter.createDate(this._chosenYear, month, 1);
    for (
      let date: Date = firstOfMonth;
      this._dateAdapter.getMonth(date) == month;
      date = this._dateAdapter.addCalendarDays(date, 1)
    ) {
      if (this.dateFilter(date)) {
        return true;
      }
    }

    return false;
  }

  // Implementation adapted from https://github.com/angular/components/blob/main/src/material/datepicker/multi-year-view.ts#L351
  private _isYearFilteredOut(year: number): boolean {
    if (!this.dateFilter) {
      return true;
    }

    const firstOfYear = this._dateAdapter.createDate(year, 0, 1);
    for (
      let date: Date = firstOfYear;
      this._dateAdapter.getYear(date) == year;
      date = this._dateAdapter.addCalendarDays(date, 1)
    ) {
      if (this.dateFilter(date)) {
        return true;
      }
    }

    return false;
  }

  /** Emits the selected date and sets it internally. */
  private _selectDate(day: string): void {
    this._chosenMonth = undefined;
    this._chosenYear = undefined;
    if (this._selected !== day) {
      this._selected = day;
      this._dateSelected.emit(this._dateAdapter.createDateFromISOString(day));
    }
  }

  private _assignActiveDate(date: Date): void {
    if (this._min && this._dateAdapter.compareDate(this._min, date) > 0) {
      this._activeDate = this._min;
      return;
    }
    if (this._max && this._dateAdapter.compareDate(this._max, date) < 0) {
      this._activeDate = this._max;
      return;
    }
    this._activeDate = date;
  }

  /** Goes to the month identified by the shift. */
  private _goToDifferentMonth(months: number): void {
    this._assignActiveDate(this._dateAdapter.addCalendarMonths(this._activeDate, months));
    this._init();
  }

  private _goToDifferentYear(years: number): void {
    this._chosenYear += years;
    // Can't use `_assignActiveDate(...)` here, because it will set it to min/max value if argument is out of range
    this._activeDate = new Date(
      this._chosenYear,
      this._dateAdapter.getMonth(this._activeDate),
      this._dateAdapter.getDate(this._activeDate),
    );
    this._init();
  }

  private _goToDifferentYearRange(years: number): void {
    this._assignActiveDate(this._dateAdapter.addCalendarYears(this._activeDate, years));
    this._init();
  }

  private _prevDisabled(prevDate: Date): boolean {
    if (!this._min) {
      return false;
    }
    return this._dateAdapter.compareDate(prevDate, this._min) < 0;
  }

  private _nextDisabled(nextDate: Date): boolean {
    if (!this._max) {
      return false;
    }
    return this._dateAdapter.compareDate(nextDate, this._max) > 0;
  }

  /** Checks if the "previous month" button should be disabled. */
  private _previousMonthDisabled(): boolean {
    const prevMonth: Date = this._dateAdapter.clone(this._activeDate);
    prevMonth.setDate(0);
    return this._prevDisabled(prevMonth);
  }

  /** Checks if the "next month" button should be disabled. */
  private _nextMonthDisabled(): boolean {
    const nextMonth: Date = this._dateAdapter.addCalendarMonths(
      this._activeDate,
      this._wide ? 2 : 1,
    );
    nextMonth.setDate(1);
    return this._nextDisabled(nextMonth);
  }

  private _previousYearDisabled(): boolean {
    const prevYear: Date = this._dateAdapter.clone(this._activeDate);
    prevYear.setFullYear(this._dateAdapter.getYear(this._activeDate) - 1, 11, 31);
    return this._prevDisabled(prevYear);
  }

  private _nextYearDisabled(): boolean {
    const nextYear: Date = this._dateAdapter.clone(this._activeDate);
    nextYear.setFullYear(this._dateAdapter.getYear(this._activeDate) + 1, 0, 1);
    return this._nextDisabled(nextYear);
  }

  private _previousYearRangeDisabled(): boolean {
    const prevYear: Date = this._dateAdapter.clone(this._activeDate);
    prevYear.setFullYear(this._years.flat()[0] - 1, 11, 31);
    return this._prevDisabled(prevYear);
  }

  private _nextYearRangeDisabled(): boolean {
    const lastYearArray: number[] = (
      isBreakpoint('medium') && this.wide ? this._nextMonthYears : this._years
    ).flat();
    const lastYear: number = lastYearArray[lastYearArray.length - 1];
    const nextYear: Date = this._dateAdapter.clone(this._activeDate);
    nextYear.setFullYear(lastYear + 1, 0, 1);
    return this._nextDisabled(nextYear);
  }

  private _handleTableBlur(eventTarget: HTMLElement): void {
    if (eventTarget?.tagName !== 'BUTTON') {
      this._setTabIndex();
    }
  }

  private _setTabIndex(): void {
    Array.from(this.shadowRoot.querySelectorAll('.sbb-calendar__cell[tabindex="0"]')).forEach(
      (day) => ((day as HTMLElement).tabIndex = -1),
    );
    const firstFocusable = this._getFirstFocusable();
    if (firstFocusable) {
      firstFocusable.tabIndex = 0;
    }
  }

  private _getFirstFocusable(): HTMLButtonElement {
    const active = this._selected ? new Date(this._selected) : this._now();
    let firstFocusable =
      this.shadowRoot.querySelector('.sbb-calendar__selected') ??
      this.shadowRoot.querySelector(
        `[data-day="${active.getDate()} ${
          this._activeDate.getMonth() + 1
        } ${this._activeDate.getFullYear()}"]`,
      ) ??
      this.shadowRoot.querySelector(`[data-month="${this._activeDate.getMonth()}"]`) ??
      this.shadowRoot.querySelector(`[data-year="${this._activeDate.getFullYear()}"]`);
    if (!firstFocusable || (firstFocusable as HTMLButtonElement)?.disabled) {
      firstFocusable = this.shadowRoot.querySelector('.sbb-calendar__cell:not([disabled])');
    }
    return (firstFocusable as HTMLButtonElement) || null;
  }

  private _handleKeyboardEvent(event, day?: Day): void {
    if (isArrowKeyOrPageKeysPressed(event)) {
      event.preventDefault();
    }
    // Gets the currently rendered table's cell;
    // they could be days, months or years based on the current selection view.
    // If `wide` is true, years are doubled in number and days are (roughly) doubled too, affecting the `index` calculation.
    const cells: HTMLButtonElement[] = this._cells;
    const index: number = cells.findIndex((e: HTMLButtonElement) => e === event.target);
    const nextEl: HTMLButtonElement = this._navigateByKeyboard(event, index, cells, day);
    const activeEl: HTMLButtonElement = this.shadowRoot.activeElement as HTMLButtonElement;
    if (nextEl !== activeEl) {
      (nextEl as HTMLButtonElement).tabIndex = 0;
      nextEl?.focus();
      (activeEl as HTMLButtonElement).tabIndex = -1;
    }
  }

  /**
   * Gets the index of the element to move to, based on a list of elements (which can be potentially disabled),
   * the keyboard input and the position of the current element in the list.
   * In the day view, the `day?: Day` parameter is mandatory for calculation,
   * while in month and year view it's not due to the fixed amount of rendered cells.
   */
  private _navigateByKeyboard(
    evt: KeyboardEvent,
    index: number,
    cells: HTMLButtonElement[],
    day?: Day,
  ): HTMLButtonElement {
    const {
      elementIndexForWideMode,
      offsetForWideMode,
      lastElementIndexForWideMode,
      verticalOffset,
    }: CalendarKeyboardNavigationParameters = this._calculateParametersForKeyboardNavigation(
      cells,
      index,
      day,
    );

    switch (evt.key) {
      case 'ArrowUp':
        return this._findNext(cells, index, -verticalOffset);
      case 'ArrowDown':
        return this._findNext(cells, index, verticalOffset);
      case 'ArrowLeft':
        return this._findNext(cells, index, -1);
      case 'ArrowRight':
        return this._findNext(cells, index, 1);
      case 'Home':
        return this._findFirst(cells, offsetForWideMode);
      case 'PageUp':
        return this._findFirstOnColumn(
          cells,
          elementIndexForWideMode,
          offsetForWideMode,
          verticalOffset,
        );
      case 'PageDown':
        return this._findLastOnColumn(cells, index, lastElementIndexForWideMode, verticalOffset);
      case 'End':
        return this._findLast(cells, lastElementIndexForWideMode - 1);
      default:
        return cells[index];
    }
  }

  /**
   * Calculates the parameter needed in keyboard navigation.
   * Since three views are now available, the function creates and returns the correct parameters for each of them
   * by considering the number of cells per each row and the correction for the wide mode.
   * @param cells The array of rendered table cells; they are buttons that can represent days, months or years.
   * @param index The starting element's index in the cell array.
   * @param day (optional) Only in the day view, the day represented by the starting cell.
   */
  private _calculateParametersForKeyboardNavigation(
    cells: HTMLButtonElement[],
    index: number,
    day?: Day,
  ): CalendarKeyboardNavigationParameters {
    switch (this._calendarView) {
      case 'day': {
        const indexInView = +day.dayValue - 1;
        return {
          verticalOffset: DAYS_PER_ROW,
          elementIndexForWideMode: indexInView,
          offsetForWideMode: index - indexInView,
          lastElementIndexForWideMode:
            index === indexInView
              ? this._dateAdapter.getNumDaysInMonth(+day.yearValue, +day.monthValue - 1)
              : cells.length,
        };
      }
      // Month view is not dependent from `wide` value, so some parameters are fixed.
      case 'month': {
        return {
          verticalOffset: MONTHS_PER_ROW,
          elementIndexForWideMode: index,
          offsetForWideMode: 0,
          lastElementIndexForWideMode: 12,
        };
      }
      case 'year': {
        const offset: number = Math.trunc(index / YEARS_PER_PAGE) * YEARS_PER_PAGE;
        const indexInView: number = offset === 0 ? index : index - YEARS_PER_PAGE;
        return {
          verticalOffset: YEARS_PER_ROW,
          elementIndexForWideMode: indexInView,
          offsetForWideMode: index - indexInView,
          lastElementIndexForWideMode: offset === 0 ? YEARS_PER_PAGE : YEARS_PER_PAGE * 2,
        };
      }
    }
  }

  /**
   * Gets the next element of the provided array starting from `index` by adding `delta`.
   * If the found element is disabled, it continues adding `delta` until it finds an enabled one in the array bounds.
   */
  private _findNext(days: HTMLButtonElement[], index: number, delta: number): HTMLButtonElement {
    let nextIndex = index + delta;
    while (nextIndex < days.length && days[nextIndex]?.disabled) {
      nextIndex += delta;
    }
    return days[nextIndex] ?? days[index];
  }

  /** Find the first enabled element in the provided array. */
  private _findFirst(days: HTMLButtonElement[], firstOfCurrentMonth: number): HTMLButtonElement {
    return !days[firstOfCurrentMonth].disabled
      ? days[firstOfCurrentMonth]
      : this._findNext(days, firstOfCurrentMonth, 1);
  }

  /** Find the last enabled element in the provided array. */
  private _findLast(days: HTMLButtonElement[], lastOfCurrentMonth: number): HTMLButtonElement {
    return !days[lastOfCurrentMonth].disabled
      ? days[lastOfCurrentMonth]
      : this._findNext(days, lastOfCurrentMonth, -1);
  }

  /** Find the first enabled element in the same column of the provided array. */
  private _findFirstOnColumn(
    days: HTMLButtonElement[],
    index: number,
    offset: number,
    verticalOffset: number,
  ): HTMLButtonElement {
    const nextIndex = (index % verticalOffset) + offset;
    return !days[nextIndex].disabled
      ? days[nextIndex]
      : this._findNext(days, nextIndex, verticalOffset);
  }

  /** Find the last enabled element in the same column of the provided array. */
  private _findLastOnColumn(
    days: HTMLButtonElement[],
    index: number,
    offset: number,
    verticalOffset: number,
  ): HTMLButtonElement {
    const nextIndex = index + Math.trunc((offset - index - 1) / verticalOffset) * verticalOffset;
    return !days[nextIndex].disabled
      ? days[nextIndex]
      : this._findNext(days, nextIndex, -verticalOffset);
  }

  private _now(): Date {
    if (this._hasDataNow()) {
      const today = new Date(+this.dataset?.now);
      today.setHours(0, 0, 0, 0);
      return today;
    }
    return this._dateAdapter.today();
  }

  private _hasDataNow(): boolean {
    const dataNow = +this.dataset?.now;
    return !isNaN(dataNow);
  }

  private _resetToDayView(): void {
    this._resetFocus = true;
    this._activeDate = this._dateAdapter.deserializeDate(this.selectedDate) ?? this._now();
    this._chosenYear = undefined;
    this._chosenMonth = undefined;
    this._nextCalendarView = 'day';
    this._removeTable();
  }

  /** Render the view for the day selection. */
  private _renderDayView(): TemplateResult {
    const nextMonthActiveDate = this._wide
      ? this._dateAdapter.addCalendarMonths(this._activeDate, 1)
      : undefined;
    return html`
      <div class="sbb-calendar__controls">
        ${this._getArrow(
          'left',
          () => this._goToDifferentMonth(-1),
          i18nPreviousMonth[this._currentLanguage],
          this._previousMonthDisabled(),
        )}
        <div class="sbb-calendar__controls-month">
          ${this._createLabelForDayView(this._activeDate)}
          ${this._wide ? this._createLabelForDayView(nextMonthActiveDate) : nothing}
          <span role="status" class="sbb-calendar__visually-hidden">
            ${this._createAriaLabelForDayView(this._activeDate, nextMonthActiveDate)}
          </span>
        </div>
        ${this._getArrow(
          'right',
          () => this._goToDifferentMonth(1),
          i18nNextMonth[this._currentLanguage],
          this._nextMonthDisabled(),
        )}
      </div>
      <div class="sbb-calendar__table-container sbb-calendar__table-day-view">
        ${this._createDayTable(this._weeks)}
        ${this._wide ? this._createDayTable(this._nextMonthWeeks) : nothing}
      </div>
    `;
  }

  /** Creates the label with the month for the daily view. */
  private _createLabelForDayView(d: Date): TemplateResult {
    const monthLabel = `${
      this._monthNames[this._dateAdapter.getMonth(d)]
    } ${this._dateAdapter.getYear(d)}`;
    return html`
      <button
        type="button"
        id="sbb-calendar__date-selection"
        class="sbb-calendar__controls-change-date"
        aria-label="${i18nYearMonthSelection[this._currentLanguage]} ${monthLabel}"
        @click=${() => {
          this._resetFocus = true;
          this._nextCalendarView = 'year';
          this._removeTable();
        }}
      >
        ${monthLabel}
        <sbb-icon name="chevron-small-down-small"></sbb-icon>
      </button>
    `;
  }

  /** Creates the aria-label for the daily view. */
  private _createAriaLabelForDayView(...dates: Date[]): string {
    let monthLabel = '';
    for (const d of dates) {
      if (d) {
        monthLabel += `${
          this._monthNames[this._dateAdapter.getMonth(d)]
        } ${this._dateAdapter.getYear(d)} `;
      }
    }
    return monthLabel;
  }

  /** Creates the calendar table for the daily view. */
  private _createDayTable(weeks: Day[][]): TemplateResult {
    return html`
      <table
        class="sbb-calendar__table"
        @focusout=${(event) => this._handleTableBlur(event.relatedTarget as HTMLElement)}
        @animationend=${(e) => this._tableAnimationEnd(e)}
      >
        <thead class="sbb-calendar__table-header">
          <tr class="sbb-calendar__table-header-row">
            ${this._createDayTableHeader()}
          </tr>
        </thead>
        <tbody class="sbb-calendar__table-body">
          ${this._createDayTableBody(weeks)}
        </tbody>
      </table>
    `;
  }

  /** Creates the table header with the month header cells. */
  private _createDayTableHeader(): TemplateResult[] {
    return this._weekdays.map(
      (day: Weekday) => html`
        <th class="sbb-calendar__table-header">
          <span class="sbb-calendar__visually-hidden">${day.long}</span>
          <span aria-hidden="true">${day.narrow}</span>
        </th>
      `,
    );
  }

  /** Creates the table body with the day cells. For the first row, it also considers the possible day's offset. */
  private _createDayTableBody(weeks: Day[][]): TemplateResult[] {
    const today: string = this._dateAdapter.getISOString(this._now());
    return weeks.map((week: Day[], rowIndex: number) => {
      const firstRowOffset: number = DAYS_PER_ROW - week.length;
      if (rowIndex === 0 && firstRowOffset) {
        return html`
          <tr>
            ${[...Array(firstRowOffset).keys()].map(
              () =>
                html`<td
                  class="sbb-calendar__table-data"
                  data-day=${`0 ${week[0].monthValue} ${week[0].yearValue}`}
                ></td>`,
            )}
            ${this._createDayCells(week, today)}
          </tr>
        `;
      }
      return html`<tr>
        ${this._createDayCells(week, today)}
      </tr>`;
    });
  }

  /** Creates the cells for the daily view. */
  private _createDayCells(week: Day[], today: string): TemplateResult[] {
    return week.map((day: Day) => {
      const isOutOfRange = !this._isDayInRange(day.value);
      const isFilteredOut = !this.dateFilter(this._dateAdapter.createDateFromISOString(day.value));
      const selected: boolean = !!this._selected && day.value === this._selected;
      const dayValue = `${day.dayValue} ${day.monthValue} ${day.yearValue}`;
      const isToday = day.value === today;
      return html`
        <td
          class=${classMap({
            'sbb-calendar__table-data': true,
            'sbb-calendar__table-data-selected': selected,
          })}
        >
          <button
            class=${classMap({
              'sbb-calendar__cell': true,
              'sbb-calendar__day': true,
              'sbb-calendar__cell-current': isToday,
              'sbb-calendar__selected': selected,
              'sbb-calendar__crossed-out': !isOutOfRange && isFilteredOut,
            })}
            @click=${() => this._selectDate(day.value)}
            ?disabled=${isOutOfRange || isFilteredOut}
            aria-label=${this._dateAdapter.getAccessibilityFormatDate(day.value)}
            aria-pressed=${selected}
            aria-disabled=${isOutOfRange || isFilteredOut}
            aria-current=${isToday ? 'date' : nothing}
            data-day=${dayValue || nothing}
            tabindex="-1"
            @keydown=${(evt: KeyboardEvent) => this._handleKeyboardEvent(evt, day)}
            sbb-tooltip-close
          >
            ${day.dayValue}
          </button>
        </td>
      `;
    });
  }

  /** Render the view for the month selection. */
  private _renderMonthView(): TemplateResult {
    return html`
      <div class="sbb-calendar__controls">
        ${this._getArrow(
          'left',
          () => this._goToDifferentYear(-1),
          i18nPreviousYear[this._currentLanguage],
          this._previousYearDisabled(),
        )}
        <div class="sbb-calendar__controls-month">${this._createLabelForMonthView()}</div>
        ${this._getArrow(
          'right',
          () => this._goToDifferentYear(1),
          i18nNextYear[this._currentLanguage],
          this._nextYearDisabled(),
        )}
      </div>
      <div class="sbb-calendar__table-container sbb-calendar__table-month-view">
        ${this._createMonthTable(this._months, this._chosenYear)}
        ${this._wide ? this._createMonthTable(this._months, this._chosenYear + 1, true) : nothing}
      </div>
    `;
  }

  /** Creates the label with the year for the monthly view. */
  private _createLabelForMonthView(): TemplateResult {
    return html` <button
        type="button"
        id="sbb-calendar__month-selection"
        class="sbb-calendar__controls-change-date"
        aria-label=${`${i18nCalendarDateSelection[this._currentLanguage]} ${this._chosenYear}`}
        @click=${() => this._resetToDayView()}
      >
        ${this._chosenYear} ${this._wide ? ` - ${this._chosenYear + 1}` : nothing}
        <sbb-icon name="chevron-small-up-small"></sbb-icon>
      </button>
      <span role="status" class="sbb-calendar__visually-hidden"> ${this._chosenYear} </span>`;
  }

  /** Creates the table for the month selection view. */
  private _createMonthTable(months: Month[][], year: number, shiftRight = false): TemplateResult {
    return html`
      <table class="sbb-calendar__table" @animationend=${(e) => this._tableAnimationEnd(e)}>
        ${this._wide
          ? html`<thead class="sbb-calendar__table-header" aria-hidden="true">
              <tr class="sbb-calendar__table-header-row">
                <th class="sbb-calendar__table-header" .colspan=${MONTHS_PER_ROW}>${year}</th>
              </tr>
            </thead>`
          : nothing}
        <tbody class="sbb-calendar__table-body">
          ${months.map(
            (row: Month[]) => html`
              <tr>
                ${row.map((month: Month) => {
                  const isOutOfRange = !this._isMonthInRange(month.monthValue);
                  const isFilteredOut = !this._isMonthFilteredOut(month.monthValue);
                  const selectedMonth = this._selected
                    ? this._dateAdapter.getMonth(new Date(this._selected))
                    : undefined;
                  const selectedYear = this._selected
                    ? this._dateAdapter.getYear(new Date(this._selected))
                    : undefined;
                  const selected: boolean =
                    !!this._selected && year === selectedYear && month.monthValue === selectedMonth;

                  const isCurrentMonth =
                    year === this._dateAdapter.getYear(this._now()) &&
                    this._dateAdapter.getMonth(this._now()) === month.monthValue;

                  return html` <td
                    class=${classMap({
                      'sbb-calendar__table-data': true,
                      'sbb-calendar__table-month': true,
                    })}
                  >
                    <button
                      class=${classMap({
                        'sbb-calendar__cell': true,
                        'sbb-calendar__pill': true,
                        'sbb-calendar__cell-current': isCurrentMonth,
                        'sbb-calendar__crossed-out': !isOutOfRange && isFilteredOut,
                        'sbb-calendar__selected': selected,
                      })}
                      @click=${() => this._onMonthSelection(month.monthValue, year, shiftRight)}
                      ?disabled=${isOutOfRange || isFilteredOut}
                      aria-label=${`${month.longValue} ${this._chosenYear}`}
                      aria-pressed=${selected}
                      aria-disabled=${String(isOutOfRange || isFilteredOut)}
                      tabindex="-1"
                      data-month=${month.monthValue || nothing}
                      @keydown=${(evt: KeyboardEvent) => this._handleKeyboardEvent(evt)}
                    >
                      ${month.value}
                    </button>
                  </td>`;
                })}
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }

  /** Select the month and change the view to day selection. */
  private _onMonthSelection(month: number, year: number, shiftRight: boolean): void {
    this._chosenMonth = shiftRight ? month - 1 : month;
    this._assignActiveDate(new Date(year, this._chosenMonth, this._activeDate.getDate()));
    this._init();
    this._resetFocus = true;
    this._nextCalendarView = 'day';
    this._removeTable();
  }

  /** Render the view for the year selection. */
  private _renderYearView(): TemplateResult {
    return html`
      <div class="sbb-calendar__controls">
        ${this._getArrow(
          'left',
          () => this._goToDifferentYearRange(-YEARS_PER_PAGE),
          i18nPreviousYearRange(YEARS_PER_PAGE)[this._currentLanguage],
          this._previousYearRangeDisabled(),
        )}
        <div class="sbb-calendar__controls-month">${this._createLabelForYearView()}</div>
        ${this._getArrow(
          'right',
          () => this._goToDifferentYearRange(YEARS_PER_PAGE),
          i18nNextYearRange(YEARS_PER_PAGE)[this._currentLanguage],
          this._nextYearRangeDisabled(),
        )}
      </div>
      <div class="sbb-calendar__table-container sbb-calendar__table-year-view">
        ${this._createYearTable(this._years)}
        ${this._wide ? this._createYearTable(this._nextMonthYears, true) : nothing}
      </div>
    `;
  }

  /** Creates the button arrow for all the views. */
  private _getArrow(
    direction: 'left' | 'right',
    click: () => void,
    ariaLabel: string,
    disabled: boolean,
  ): TemplateResult {
    return html`<sbb-button
      variant="secondary"
      size="m"
      icon-name="chevron-small-${direction}-small"
      aria-label=${ariaLabel}
      @click=${click}
      ?disabled=${disabled}
      id="sbb-calendar__controls-${direction === 'left' ? 'previous' : 'next'}"
    ></sbb-button>`;
  }

  /** Creates the label with the year range for the yearly view. */
  private _createLabelForYearView(): TemplateResult {
    const firstYear: number = this._years.flat()[0];
    const lastYearArray: number[] = (
      isBreakpoint('medium') && this.wide ? this._nextMonthYears : this._years
    ).flat();
    const lastYear: number = lastYearArray[lastYearArray.length - 1];
    const yearLabel = `${firstYear} - ${lastYear}`;
    return html`
      <button
        type="button"
        id="sbb-calendar__year-selection"
        class="sbb-calendar__controls-change-date"
        aria-label="${i18nCalendarDateSelection[this._currentLanguage]} ${yearLabel}"
        @click=${() => this._resetToDayView()}
      >
        ${yearLabel}
        <sbb-icon name="chevron-small-up-small"></sbb-icon>
      </button>
      <span role="status" class="sbb-calendar__visually-hidden"> ${yearLabel} </span>
    `;
  }

  /** Creates the table for the year selection view. */
  private _createYearTable(years: number[][], shiftRight = false): TemplateResult {
    return html` <table
      class="sbb-calendar__table"
      @animationend=${(e) => this._tableAnimationEnd(e)}
    >
      <tbody class="sbb-calendar__table-body">
        ${years.map(
          (row: number[]) =>
            html` <tr>
              ${row.map((year: number) => {
                const isOutOfRange = !this._isYearInRange(year);
                const isFilteredOut = !this._isYearFilteredOut(year);
                const selectedYear = this._selected
                  ? this._dateAdapter.getYear(new Date(this._selected))
                  : undefined;
                const selected: boolean = !!this._selected && year === selectedYear;
                const isCurrentYear = this._dateAdapter.getYear(this._now()) === year;
                return html` <td class="sbb-calendar__table-data sbb-calendar__table-year">
                  <button
                    class=${classMap({
                      'sbb-calendar__cell': true,
                      'sbb-calendar__pill': true,
                      'sbb-calendar__cell-current': isCurrentYear,
                      'sbb-calendar__crossed-out': !isOutOfRange && isFilteredOut,
                      'sbb-calendar__selected': selected,
                    })}
                    @click=${() => this._onYearSelection(year, shiftRight)}
                    ?disabled=${isOutOfRange || isFilteredOut}
                    aria-label=${year}
                    aria-pressed=${selected}
                    aria-disabled=${String(isOutOfRange || isFilteredOut)}
                    tabindex="-1"
                    data-year=${year || nothing}
                    @keydown=${(evt: KeyboardEvent) => this._handleKeyboardEvent(evt)}
                  >
                    ${year}
                  </button>
                </td>`;
              })}
            </tr>`,
        )}
      </tbody>
    </table>`;
  }

  /** Select the year and change the view to month selection. */
  private _onYearSelection(year: number, rightSide: boolean): void {
    this._chosenYear = rightSide ? year - 1 : year;
    this._assignActiveDate(
      new Date(this._chosenYear, this._activeDate.getMonth(), this._activeDate.getDate()),
    );
    this._resetFocus = true;
    this._nextCalendarView = 'month';
    this._removeTable();
  }

  private get _getView(): TemplateResult {
    switch (this._calendarView) {
      case 'year':
        return this._renderYearView();
      case 'month':
        return this._renderMonthView();
      case 'day':
      default:
        return this._renderDayView();
    }
  }

  private _tableAnimationEnd(event: AnimationEvent): void {
    const table = event.target as HTMLElement;
    if (event.animationName === 'hide') {
      table.classList.remove('sbb-calendar__table-hide');
      this._calendarView = this._nextCalendarView;
      table.classList.add('sbb-calendar__table-show');
    } else if (event.animationName === 'show') {
      table.classList.remove('sbb-calendar__table-show');
    }
  }

  private _removeTable(): void {
    const table = this.shadowRoot.querySelectorAll('table');
    table.forEach((e) => e.classList.toggle('sbb-calendar__table-hide'));
    return;
  }

  protected override render(): TemplateResult {
    setAttribute(this, 'data-wide', this._wide);
    return html`<div class="sbb-calendar__wrapper">${this._getView}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'sbb-calendar': SbbCalendar;
  }
}
