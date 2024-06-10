import { assert, expect } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import type { TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import type { Context } from 'mocha';

import { NativeDateAdapter } from '../../core/datetime.js';
import { findInput } from '../../core/dom.js';
import { i18nDateChangedTo } from '../../core/i18n.js';
import { fixture, typeInElement } from '../../core/testing/private.js';
import { EventSpy, waitForCondition, waitForLitRender } from '../../core/testing.js';
import type { SbbFormFieldElement } from '../../form-field.js';
import type { SbbDatepickerNextDayElement } from '../datepicker-next-day.js';
import type { SbbDatepickerPreviousDayElement } from '../datepicker-previous-day.js';

import {
  findNextAvailableDate,
  findPreviousAvailableDate,
  getAvailableDate,
  getDatePicker,
  isDateAvailable,
  SbbDatepickerElement,
} from './datepicker.js';

import '../../form-field.js';
import '../datepicker-previous-day.js';
import '../datepicker-next-day.js';

describe(`sbb-datepicker`, () => {
  describe('datepicker', () => {
    it('renders', async () => {
      const element = await fixture(html`<sbb-datepicker></sbb-datepicker>`);
      assert.instanceOf(element, SbbDatepickerElement);
    });

    it('renders and formats date', async () => {
      const element = await fixture(html`
        <div>
          <input id="datepicker-input" value="01-01-2023" />
          <sbb-datepicker id="datepicker" input="datepicker-input"></sbb-datepicker>
        </div>
      `);

      const input: HTMLInputElement = element.querySelector<HTMLInputElement>('input')!;

      expect(input.value).to.be.equal('Su, 01.01.2023');
    });

    it('renders and interprets iso string date', async () => {
      const element = await fixture(html`
        <div>
          <input id="datepicker-input" value="2021-12-20" />
          <sbb-datepicker id="datepicker" input="datepicker-input"></sbb-datepicker>
        </div>
      `);

      const input: HTMLInputElement = element.querySelector<HTMLInputElement>('input')!;

      expect(input.value).to.be.equal('Mo, 20.12.2021');
    });

    it('renders and interprets timestamp', async () => {
      const element = await fixture(html`
        <div>
          <input id="datepicker-input" value="1594512000000" />
          <sbb-datepicker id="datepicker" input="datepicker-input"></sbb-datepicker>
        </div>
      `);

      const input: HTMLInputElement = element.querySelector<HTMLInputElement>('input')!;

      expect(input.value).to.be.equal('Su, 12.07.2020');
    });

    const commonBehaviorTest: (template: TemplateResult) => void = (template: TemplateResult) => {
      let element: SbbDatepickerElement, input: HTMLInputElement, button: HTMLButtonElement;

      beforeEach(async () => {
        const root = await fixture(template);
        element = root.querySelector<SbbDatepickerElement>('sbb-datepicker')!;
        input = root.querySelector<HTMLInputElement>('input')!;
        button = root.querySelector<HTMLButtonElement>('button')!;
      });

      it('renders', async () => {
        assert.instanceOf(element, SbbDatepickerElement);
        expect(input).dom.to.be.equal(
          '<input id="datepicker-input" placeholder="DD.MM.YYYY" type="text">',
        );
      });

      it('renders and emit event on value change', async function (this: Context) {
        const changeSpy = new EventSpy('change', element);
        typeInElement(input, '20/01/2023');
        button.focus();
        await waitForCondition(() => changeSpy.events.length === 1);
        expect(input.value).to.be.equal('Fr, 20.01.2023');
        expect(changeSpy.count).to.be.equal(1);
      });

      it('renders and interpret two digit year correctly in 2000s', async function (this: Context) {
        const changeSpy = new EventSpy('change', element);
        typeInElement(input, '20/01/12');
        button.focus();
        await waitForCondition(() => changeSpy.events.length === 1);
        expect(input.value).to.be.equal('Fr, 20.01.2012');
        expect(changeSpy.count).to.be.equal(1);
      });

      it('renders and interpret two digit year correctly in 1900s', async function (this: Context) {
        const changeSpy = new EventSpy('change', element);
        typeInElement(input, '20/01/99');
        button.focus();
        await waitForCondition(() => changeSpy.events.length === 1);
        expect(input.value).to.be.equal('We, 20.01.1999');
        expect(changeSpy.count).to.be.equal(1);
      });

      it('renders and detects missing month error', async () => {
        const changeSpy = new EventSpy('change', element);
        typeInElement(input, '20..2012');
        button.focus();
        await waitForCondition(() => changeSpy.events.length === 1);
        expect(input).to.have.attribute('data-sbb-invalid');
        expect(changeSpy.count).to.be.equal(1);
      });

      it('renders and detects missing year error', async () => {
        const changeSpy = new EventSpy('change', element);
        typeInElement(input, '20.05.');
        button.focus();
        await waitForCondition(() => changeSpy.events.length === 1);
        expect(input).to.have.attribute('data-sbb-invalid');
        expect(changeSpy.count).to.be.equal(1);
      });

      it('renders and detects invalid month error', async () => {
        const changeSpy = new EventSpy('change', element);
        typeInElement(input, '20.00.2012');
        button.focus();
        await waitForCondition(() => changeSpy.events.length === 1);
        expect(input).to.have.attribute('data-sbb-invalid');
        expect(changeSpy.count).to.be.equal(1);
      });

      it('renders and detects invalid day error', async () => {
        const changeSpy = new EventSpy('change', element);
        typeInElement(input, '00.05.2020');
        button.focus();
        await waitForCondition(() => changeSpy.events.length === 1);
        expect(input).to.have.attribute('data-sbb-invalid');
        expect(changeSpy.count).to.be.equal(1);
      });

      it('renders with errors when typing letters', async () => {
        expect(input.value).to.be.equal('');
        typeInElement(input, 'invalid', { key: 'Enter', keyCode: 13 });
        await waitForLitRender(element);
        expect(input.value).to.be.equal('invalid');
        expect(input).to.have.attribute('data-sbb-invalid');
      });

      it('renders and emits event when input parameter changes', async () => {
        const datePickerUpdatedSpy = new EventSpy('datePickerUpdated');
        element.wide = true;
        await waitForCondition(() => datePickerUpdatedSpy.events.length === 1);
        expect(datePickerUpdatedSpy.count).to.be.equal(1);
        element.dateFilter = () => false;
        await waitForLitRender(element);
        await waitForCondition(() => datePickerUpdatedSpy.events.length === 2);
        expect(datePickerUpdatedSpy.count).to.be.equal(2);
      });

      it('renders and interprets date with custom parse and format functions', async () => {
        const changeSpy = new EventSpy('change', element);

        element.dateParser = (s) => {
          s = s.replace(/\D/g, ' ').trim();
          const date = s.split(' ');
          const now = new Date(2023, 8, 15, 0, 0, 0, 0);
          return new Date(now.getFullYear(), +date[1] - 1, +date[0]);
        };
        element.format = (d) => {
          //Intl.DateTimeFormat API is not available in test environment.
          const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
          const weekday = weekdays[d.getDay()];
          const date = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(
            2,
            '0',
          )}`;
          return `${weekday}, ${date}`;
        };
        await waitForLitRender(element);
        typeInElement(input, '7.8', { key: 'Enter', keyCode: 13 });
        await waitForCondition(() => changeSpy.events.length === 1);
        await waitForLitRender(element);
        expect(input.value).to.be.equal('Mo, 07.08');
        expect(changeSpy.count).to.be.equal(1);
      });

      it('should emit validation change event', async () => {
        let validationChangeSpy = new EventSpy('validationChange', element);

        typeInElement(input, '20');
        input.blur();
        await waitForLitRender(element);

        // Then validation event should emit with false
        await waitForCondition(() => validationChangeSpy.events.length === 1);
        expect((validationChangeSpy.lastEvent as CustomEvent).detail['valid']).to.be.equal(false);
        expect(input).to.have.attribute('data-sbb-invalid');

        // When adding valid date
        typeInElement(input, '.');
        await sendKeys({ press: 'Tab' });

        // Then validation event should not be emitted a second time
        expect(validationChangeSpy.count).to.be.equal(1);
        expect(input).to.have.attribute('data-sbb-invalid');

        // Reset event spy
        validationChangeSpy = new EventSpy('validationChange', element);

        // When adding missing parts of a valid date
        typeInElement(input, '8.23');
        input.blur();

        // Then validation event should be emitted with true
        await waitForCondition(() => validationChangeSpy.events.length === 1);
        expect((validationChangeSpy.lastEvent as CustomEvent).detail['valid']).to.be.equal(true);
        expect(input).not.to.have.attribute('data-sbb-invalid');
      });

      it('should interpret valid values and set accessibility labels', async function (this: Context) {
        const testCases = [
          {
            value: '5.5.0',
            interpretedAs: 'Fr, 05.05.2000',
            accessibilityValue: 'Friday, 05.05.2000',
          },
          {
            value: '8.2.98',
            interpretedAs: 'Su, 08.02.1998',
            accessibilityValue: 'Sunday, 08.02.1998',
          },
          {
            value: '31-12-2020',
            interpretedAs: 'Th, 31.12.2020',
            accessibilityValue: 'Thursday, 31.12.2020',
          },
          {
            value: '5 5 21',
            interpretedAs: 'We, 05.05.2021',
            accessibilityValue: 'Wednesday, 05.05.2021',
          },
          {
            value: '3/7/26',
            interpretedAs: 'Fr, 03.07.2026',
            accessibilityValue: 'Friday, 03.07.2026',
          },
          {
            value: '1.12.2019',
            interpretedAs: 'Su, 01.12.2019',
            accessibilityValue: 'Sunday, 01.12.2019',
          },
          {
            value: '6\\1\\2020',
            interpretedAs: 'Mo, 06.01.2020',
            accessibilityValue: 'Monday, 06.01.2020',
          },
          {
            value: '5,5,2012',
            interpretedAs: 'Sa, 05.05.2012',
            accessibilityValue: 'Saturday, 05.05.2012',
          },
        ];

        for (const testCase of testCases) {
          // Clear input
          input.value = '';

          typeInElement(input, testCase.value);
          input.blur();
          await waitForLitRender(element);

          expect(input.value).to.be.equal(testCase.interpretedAs);
          const paragraphElement = document
            .querySelector<SbbDatepickerElement>('sbb-datepicker')!
            .shadowRoot!.querySelector<HTMLParagraphElement>('p');
          expect(paragraphElement!.innerText).to.be.equal(
            `${i18nDateChangedTo['en']} ${testCase.accessibilityValue}`,
          );
        }
      });

      it('should not touch invalid values', async function (this: Context) {
        const testCases = [
          { value: '.12.2020', interpretedAs: '.12.2020' },
          { value: '24..1995', interpretedAs: '24..1995' },
          { value: '24.12.', interpretedAs: '24.12.' },
          { value: '34.06.2020', interpretedAs: '34.06.2020' },
          { value: '24.15.2014', interpretedAs: '24.15.2014' },
          { value: 'invalid', interpretedAs: 'invalid' },
        ];

        for (const testCase of testCases) {
          // Clear input
          input.value = '';

          typeInElement(input, testCase.value);
          await sendKeys({ press: 'Tab' });
          expect(input.value).to.be.equal(testCase.interpretedAs);
          const paragraphElement = document
            .querySelector<SbbDatepickerElement>('sbb-datepicker')!
            .shadowRoot!.querySelector<HTMLParagraphElement>('p');
          expect(paragraphElement!.innerText).to.be.equal('');
        }
      });
    };

    describe('with input', () => {
      commonBehaviorTest(html`
        <div>
          <sbb-datepicker input="datepicker-input"></sbb-datepicker>
          <input id="datepicker-input" />
          <button></button>
        </div>
      `);
    });

    describe('with form-field', () => {
      commonBehaviorTest(html`
        <div>
          <sbb-form-field>
            <sbb-datepicker></sbb-datepicker>
            <input id="datepicker-input" />
          </sbb-form-field>
          <button></button>
        </div>
      `);
    });
  });

  describe(`getDatePicker`, () => {
    it('returns the datepicker if no trigger', async () => {
      const page: SbbFormFieldElement = await fixture(html`
        <sbb-form-field>
          <input />
          <sbb-datepicker></sbb-datepicker>
          <sbb-datepicker-next-day></sbb-datepicker-next-day>
        </sbb-form-field>
      `);
      const picker: SbbDatepickerElement =
        page.querySelector<SbbDatepickerElement>('sbb-datepicker')!;
      const elementNext: SbbDatepickerNextDayElement =
        page.querySelector<SbbDatepickerNextDayElement>('sbb-datepicker-next-day')!;
      expect(getDatePicker(elementNext)).to.equal(picker);
    });

    it('returns the datepicker if its id is passed as trigger', async () => {
      const page = await fixture(html`
        <div>
          <input />
          <sbb-datepicker id="picker"></sbb-datepicker>
          <sbb-datepicker-previous-day></sbb-datepicker-previous-day>
        </div>
      `);
      const picker: SbbDatepickerElement = page.querySelector<SbbDatepickerElement>('#picker')!;
      const elementPrevious: SbbDatepickerPreviousDayElement =
        page.querySelector<SbbDatepickerPreviousDayElement>('sbb-datepicker-previous-day')!;
      expect(getDatePicker(elementPrevious, 'picker')).to.equal(picker);
    });
  });

  describe(`getInput`, () => {
    it('returns the input if no trigger', async () => {
      const page: SbbFormFieldElement = await fixture(html`
        <sbb-form-field>
          <input />
          <sbb-datepicker></sbb-datepicker>
        </sbb-form-field>
      `);
      const element: SbbDatepickerElement =
        page.querySelector<SbbDatepickerElement>('sbb-datepicker')!;
      const input: HTMLInputElement = page.querySelector<HTMLInputElement>('input')!;
      expect(findInput(element)).to.equal(input);
    });

    it('returns the input if its id is passed as trigger', async () => {
      const page = await fixture(html`
        <div>
          <input id="input" />
          <sbb-datepicker></sbb-datepicker>
          <sbb-datepicker-previous-day></sbb-datepicker-previous-day>
        </div>
      `);
      const picker: SbbDatepickerElement =
        page.querySelector<SbbDatepickerElement>('sbb-datepicker')!;
      const input: HTMLInputElement = page.querySelector<HTMLInputElement>('input')!;
      expect(findInput(picker, 'input')).to.equal(input);
    });
  });

  describe(`getAvailableDate`, () => {
    it('with dateFilter', async () => {
      const availableDate: Date = getAvailableDate(
        new Date(2024, 0, 1, 0, 0, 0, 0),
        1,
        (d: Date) => d.getDay() === 1,
        new NativeDateAdapter(),
      );
      expect(availableDate.getTime()).to.equal(new Date(2024, 0, 8, 0, 0, 0, 0).getTime());
    });

    it('without dateFilter', async () => {
      const availableDate: Date = getAvailableDate(
        new Date(2024, 0, 1, 0, 0, 0, 0),
        1,
        () => true,
        new NativeDateAdapter(),
      );
      expect(availableDate.getTime()).to.equal(new Date(2024, 0, 2, 0, 0, 0, 0).getTime());
    });
  });

  describe(`findPreviousAvailableDate`, () => {
    it('get date without dateFilter and without min', async () => {
      const availableDate: Date = findPreviousAvailableDate(
        new Date(2023, 1, 26, 0, 0, 0, 0),
        null,
        new NativeDateAdapter(),
        null,
      );
      expect(availableDate.getTime()).to.equal(new Date(2023, 1, 25, 0, 0, 0, 0).getTime());
    });

    it('get date without dateFilter and with current date equal to min date', async () => {
      const date = new Date(2023, 1, 26, 0, 0, 0, 0);
      const availableDate: Date = findPreviousAvailableDate(
        date,
        null,
        new NativeDateAdapter(),
        date.valueOf() / 1000,
      );
      expect(availableDate.getTime()).to.equal(date.getTime());
    });

    it('get date with dateFilter and min', async () => {
      const minDate = new Date(2023, 1, 26, 0, 0, 0, 0);
      const availableDate: Date = findPreviousAvailableDate(
        new Date(2023, 1, 28, 0, 0, 0, 0),
        (d: Date) => d.getDate() !== 27,
        new NativeDateAdapter(),
        minDate.valueOf() / 1000,
      );
      expect(availableDate.getTime()).to.equal(minDate.getTime());
    });
  });

  describe(`findNextAvailableDate`, () => {
    it('get date without max and without dateFilter', async () => {
      const availableDate: Date = findNextAvailableDate(
        new Date(2023, 1, 26, 0, 0, 0, 0),
        null,
        new NativeDateAdapter(),
        null,
      );
      expect(availableDate.getTime()).to.equal(new Date(2023, 1, 27, 0, 0, 0, 0).getTime());
    });

    it('get date without dateFilter with current date equal to max date', async () => {
      const date: Date = new Date(2023, 1, 26, 0, 0, 0, 0);
      const availableDate: Date = findNextAvailableDate(
        date,
        null,
        new NativeDateAdapter(),
        date.valueOf() / 1000,
      );
      expect(availableDate.getTime()).to.equal(date.getTime());
    });

    it('get date with dateFilter and max', async () => {
      const maxDate = new Date(2023, 1, 28, 0, 0, 0, 0);
      const availableDate: Date = findNextAvailableDate(
        new Date(2023, 1, 26, 0, 0, 0, 0),
        (d: Date) => d.getDate() !== 27,
        new NativeDateAdapter(),
        maxDate.valueOf() / 1000,
      );
      expect(availableDate.getTime()).to.equal(maxDate.getTime());
    });
  });

  describe(`isDateAvailable`, () => {
    describe('invalid', () => {
      it('get invalid date with min', async () => {
        expect(
          isDateAvailable(
            new Date('2023-02-20'),
            null,
            new Date('2023-02-26').valueOf() / 1000,
            null,
          ),
        ).to.be.false;
      });

      it('get invalid date with max', async () => {
        expect(
          isDateAvailable(
            new Date('2023-02-28'),
            null,
            null,
            new Date('2023-02-26').valueOf() / 1000,
          ),
        ).to.be.false;
      });

      it('get invalid date with dateFilter', async () => {
        expect(
          isDateAvailable(
            new Date('2023-02-28'),
            (d: Date) => d.getTime() > new Date('2024-12-31').valueOf(),
            null,
            null,
          ),
        ).to.be.false;
      });
    });

    describe('valid', function () {
      it('get valid date without dateFilter, min and max', async () => {
        expect(isDateAvailable(new Date('2023-02-25'), null, null, null)).to.be.true;
      });

      it('get valid date with min', async () => {
        expect(
          isDateAvailable(
            new Date('2023-02-20'),
            null,
            new Date('2023-02-01').valueOf() / 1000,
            null,
          ),
        ).to.be.true;
      });

      it('get valid date with max', async () => {
        expect(
          isDateAvailable(
            new Date('2023-02-28'),
            null,
            null,
            new Date('2023-03-31').valueOf() / 1000,
          ),
        ).to.be.true;
      });

      it('get invalid date with dateFilter', async () => {
        expect(
          isDateAvailable(
            new Date('2023-02-28'),
            (d: Date) => d.getTime() > new Date('2022-01-01').valueOf(),
            null,
            null,
          ),
        ).to.be.true;
      });
    });
  });
});
