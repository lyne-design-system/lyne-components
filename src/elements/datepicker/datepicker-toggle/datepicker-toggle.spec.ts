import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import type { SbbCalendarElement } from '../../calendar.js';
import { fixture } from '../../core/testing/private.js';
import { EventSpy, waitForCondition, waitForLitRender } from '../../core/testing.js';
import type { SbbFormFieldElement } from '../../form-field.js';
import type { SbbPopoverTriggerElement } from '../../popover.js';
import { SbbPopoverElement } from '../../popover.js';
import type { SbbDatepickerElement } from '../datepicker.js';

import { SbbDatepickerToggleElement } from './datepicker-toggle.js';

import '../datepicker.js';
import '../../form-field/form-field.js';

describe(`sbb-datepicker-toggle`, () => {
  it('renders standalone', async () => {
    const element: SbbDatepickerToggleElement = await fixture(
      html`<sbb-datepicker-toggle></sbb-datepicker-toggle>`,
    );
    assert.instanceOf(element, SbbDatepickerToggleElement);

    const popoverTrigger: SbbPopoverTriggerElement =
      element.shadowRoot!.querySelector<SbbPopoverTriggerElement>('sbb-popover-trigger')!;
    expect(popoverTrigger).to.have.attribute('disabled');
  });

  it('renders and opens popover with picker', async () => {
    const root = await fixture(html`
      <div>
        <sbb-datepicker-toggle date-picker="datepicker"></sbb-datepicker-toggle>
        <sbb-datepicker input="datepicker-input" id="datepicker"></sbb-datepicker>
        <input id="datepicker-input" />
      </div>
    `);
    const element: SbbDatepickerToggleElement =
      root.querySelector<SbbDatepickerToggleElement>('sbb-datepicker-toggle')!;
    assert.instanceOf(element, SbbDatepickerToggleElement);

    const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen, element);
    const popoverTrigger: SbbPopoverTriggerElement =
      element.shadowRoot!.querySelector<SbbPopoverTriggerElement>('sbb-popover-trigger')!;
    const popover: SbbPopoverElement =
      element.shadowRoot!.querySelector<SbbPopoverElement>('sbb-popover')!;

    expect(popoverTrigger).not.to.have.attribute('disabled');
    expect(popover).to.have.attribute('data-state', 'closed');

    popoverTrigger.click();
    await waitForCondition(() => didOpenEventSpy.events.length === 1);

    expect(popover).to.have.attribute('data-state', 'opened');
  });

  it('renders and opens popover programmatically', async () => {
    const root = await fixture(html`
      <div>
        <sbb-datepicker-toggle date-picker="datepicker"></sbb-datepicker-toggle>
        <sbb-datepicker input="datepicker-input" id="datepicker"></sbb-datepicker>
        <input id="datepicker-input" />
      </div>
    `);
    const element: SbbDatepickerToggleElement =
      root.querySelector<SbbDatepickerToggleElement>('sbb-datepicker-toggle')!;
    const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen, element);
    const popoverTrigger: SbbPopoverTriggerElement =
      element.shadowRoot!.querySelector<SbbPopoverTriggerElement>('sbb-popover-trigger')!;
    const popover: SbbPopoverElement =
      element.shadowRoot!.querySelector<SbbPopoverElement>('sbb-popover')!;
    await waitForLitRender(element);
    assert.instanceOf(element, SbbDatepickerToggleElement);
    expect(popoverTrigger).not.to.have.attribute('disabled');
    expect(popover).to.have.attribute('data-state', 'closed');

    element.open();

    await waitForCondition(() => didOpenEventSpy.events.length === 1);

    expect(popover).to.have.attribute('data-state', 'opened');
  });

  it('datepicker is created after the component', async () => {
    const root = await fixture(html`
      <div id="parent">
        <sbb-datepicker-toggle date-picker="datepicker"></sbb-datepicker-toggle>
        <input id="datepicker-input" />
      </div>
    `);

    const toggle: SbbDatepickerToggleElement =
      root.querySelector<SbbDatepickerToggleElement>('sbb-datepicker-toggle')!;
    const inputUpdated: EventSpy<Event> = new EventSpy('inputUpdated', root);
    const trigger: SbbPopoverTriggerElement =
      toggle.shadowRoot!.querySelector<SbbPopoverTriggerElement>('sbb-popover-trigger')!;
    // there's no datepicker, so no event and the popoverTrigger is disabled due _datePickerElement not set
    expect(toggle).not.to.be.null;
    expect(inputUpdated.count).to.be.equal(0);
    expect(trigger).to.have.attribute('disabled');

    const picker: SbbDatepickerElement = document.createElement('sbb-datepicker');
    picker.setAttribute('input', 'datepicker-input');
    picker.setAttribute('id', 'datepicker');
    picker.setAttribute('value', '01-01-2023');
    root.appendChild(picker);
    await waitForLitRender(root);

    // the datepicker is connected, which triggers a 1st inputUpdated event which calls _init and a 2nd one which sets max/min/disabled
    expect(inputUpdated.count).to.be.equal(2);
    expect(trigger).not.to.have.attribute('disabled');
  });

  it('datepicker is created after the component with different parent', async () => {
    const root = await fixture(html`
      <div>
        <div id="parent">
          <sbb-datepicker-toggle date-picker="datepicker"></sbb-datepicker-toggle>
          <input id="datepicker-input" />
        </div>
        <div id="other"></div>
      </div>
    `);

    const toggle: SbbDatepickerToggleElement =
      root.querySelector<SbbDatepickerToggleElement>('sbb-datepicker-toggle')!;
    const inputUpdated = new EventSpy('inputUpdated', root.querySelector('#parent'));
    const trigger =
      toggle.shadowRoot!.querySelector<SbbPopoverTriggerElement>('sbb-popover-trigger')!;
    // there's no datepicker, so no event and the popoverTrigger is disabled due _datePickerElement not set
    expect(toggle).not.to.be.null;
    expect(inputUpdated.count).to.be.equal(0);
    expect(trigger).to.have.attribute('disabled');

    const picker: SbbDatepickerElement = document.createElement('sbb-datepicker');
    picker.setAttribute('input', 'datepicker-input');
    picker.setAttribute('id', 'datepicker');
    picker.setAttribute('value', '01-01-2023');
    root.querySelector<HTMLDivElement>('#other')!.appendChild(picker);
    await waitForLitRender(root);

    // the datepicker is connected on a different parent, so no changes are triggered
    expect(inputUpdated.count).to.be.equal(0);
    expect(trigger).to.have.attribute('disabled');
  });

  it('renders in form field, open calendar and change date', async () => {
    const form: SbbFormFieldElement = await fixture(html`
      <sbb-form-field>
        <sbb-datepicker-toggle></sbb-datepicker-toggle>
        <sbb-datepicker></sbb-datepicker>
        <input />
      </sbb-form-field>
    `);
    const element: SbbDatepickerToggleElement =
      form.querySelector<SbbDatepickerToggleElement>('sbb-datepicker-toggle')!;
    const input: HTMLInputElement = form.querySelector<HTMLInputElement>('input')!;
    const popover: SbbPopoverElement =
      element.shadowRoot!.querySelector<SbbPopoverElement>('sbb-popover')!;
    expect(popover).to.have.attribute('data-state', 'closed');
    const didOpenEventSpy = new EventSpy(SbbPopoverElement.events.didOpen, element);
    const changeSpy = new EventSpy('change', input);
    const blurSpy = new EventSpy('blur', input);
    assert.instanceOf(element, SbbDatepickerToggleElement);

    const popoverTrigger: SbbPopoverTriggerElement =
      element.shadowRoot!.querySelector<SbbPopoverTriggerElement>('sbb-popover-trigger')!;
    popoverTrigger.click();
    await waitForCondition(() => didOpenEventSpy.events.length === 1);
    expect(popover).to.have.attribute('data-state', 'opened');

    const calendar: SbbCalendarElement =
      element.shadowRoot!.querySelector<SbbCalendarElement>('sbb-calendar')!;
    calendar.dispatchEvent(
      new CustomEvent('dateSelected', {
        detail: new Date('2022-01-01'),
      }),
    );
    await waitForLitRender(element);

    expect(input.value).to.be.equal('Sa, 01.01.2022');
    expect(changeSpy.count).to.be.equal(1);
    expect(blurSpy.count).to.be.equal(1);
  });
});
