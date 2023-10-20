import { assert, expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { EventSpy, waitForCondition, waitForLitRender } from '../../global/testing';
import { SbbDatepickerNextDay } from './sbb-datepicker-next-day';
import { SbbFormField } from '../sbb-form-field';

describe('sbb-datepicker-next-day', () => {
  describe('standalone', () => {
    it('renders', async () => {
      const element: SbbDatepickerNextDay = await fixture(
        html`<sbb-datepicker-next-day></sbb-datepicker-next-day>`,
      );
      assert.instanceOf(element, SbbDatepickerNextDay);
    });
  });

  describe('with picker', () => {
    it('renders and click', async () => {
      await fixture(html`
        <input id="datepicker-input" value="31-12-2022" />
        <sbb-datepicker id="datepicker" input="datepicker-input"></sbb-datepicker>
        <sbb-datepicker-next-day date-picker="datepicker"></sbb-datepicker-next-day>
      `);

      const element: SbbDatepickerNextDay = document.querySelector('sbb-datepicker-next-day');
      const input: HTMLInputElement = document.querySelector('input');
      await waitForLitRender(element);
      assert.instanceOf(element, SbbDatepickerNextDay);
      expect(input.value).to.be.equal('Sa, 31.12.2022');

      const changeSpy = new EventSpy('change', input);
      const blurSpy = new EventSpy('blur', input);
      element.click();
      await waitForCondition(() => changeSpy.events.length === 1);
      expect(changeSpy.count).to.be.equal(1);
      expect(blurSpy.count).to.be.equal(1);

      expect(input.value).to.be.equal('Su, 01.01.2023');
    });
  });

  describe('in form field', () => {
    let element: SbbDatepickerNextDay, input: HTMLInputElement;

    beforeEach(async () => {
      const form: SbbFormField = await fixture(html`
        <sbb-form-field>
          <input value="21-01-2023" />
          <sbb-datepicker></sbb-datepicker>
          <sbb-datepicker-next-day></sbb-datepicker-next-day>
        </sbb-form-field>
      `);
      element = form.querySelector('sbb-datepicker-next-day');
      input = form.querySelector('input');
      await waitForLitRender(element);
    });

    it('renders', async () => {
      assert.instanceOf(element, SbbDatepickerNextDay);
    });

    it('click', async () => {
      expect(input.value).to.be.equal('Sa, 21.01.2023');
      const changeSpy = new EventSpy('change', input);
      const blurSpy = new EventSpy('blur', input);
      element.click();
      await waitForCondition(() => changeSpy.events.length === 1);
      expect(changeSpy.count).to.be.equal(1);
      expect(blurSpy.count).to.be.equal(1);
      expect(input.value).to.be.equal('Su, 22.01.2023');
    });

    it('disabled due max value equals to value', async () => {
      const form: SbbFormField = await fixture(html`
        <sbb-form-field>
          <input value="21-01-2023" max="1674255600" />
          <sbb-datepicker-next-day></sbb-datepicker-next-day>
          <sbb-datepicker></sbb-datepicker>
        </sbb-form-field>
      `);
      input = form.querySelector('input');
      await waitForLitRender(element);

      expect(input.value).to.be.equal('Sa, 21.01.2023');
      await waitForLitRender(element);

      expect(
        document.querySelector('sbb-datepicker-next-day').hasAttribute('data-disabled'),
      ).to.be.equal(true);

      element.click();
      await waitForLitRender(element);
      expect(input.value).to.be.equal('Sa, 21.01.2023');
    });

    it('disabled due disabled picker', async () => {
      expect(input.value).to.be.equal('Sa, 21.01.2023');
      document.querySelector('input').setAttribute('disabled', '');

      await waitForLitRender(element);

      expect(element).to.have.attribute('data-disabled');
      element.click();
      await waitForLitRender(element);
      expect(input.value).to.be.equal('Sa, 21.01.2023');
    });
  });
});
