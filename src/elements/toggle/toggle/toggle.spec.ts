import { assert, expect } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';
import { EventSpy, waitForCondition, waitForLitRender } from '../../core/testing.js';
import type { SbbToggleOptionElement } from '../toggle-option.js';

import { SbbToggleElement } from './toggle.js';

import '../toggle-option.js';

describe(`sbb-toggle`, () => {
  let element: SbbToggleElement,
    firstOption: SbbToggleOptionElement,
    secondOption: SbbToggleOptionElement;

  describe('basics', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <sbb-toggle>
          <sbb-toggle-option id="sbb-toggle-option-1" value="Value one"
            >Value one</sbb-toggle-option
          >
          <sbb-toggle-option id="sbb-toggle-option-2" value="Value two"
            >Value two</sbb-toggle-option
          >
        </sbb-toggle>
      `);
      firstOption = element.querySelector<SbbToggleOptionElement>('#sbb-toggle-option-1')!;
      secondOption = element.querySelector<SbbToggleOptionElement>('#sbb-toggle-option-2')!;
    });

    it('renders', () => {
      assert.instanceOf(element, SbbToggleElement);
    });

    describe('value', () => {
      it('should select the correct option by setting value via attribute', async () => {
        element = await fixture(html`
          <sbb-toggle value="Value two">
            <sbb-toggle-option value="Value one">Value one</sbb-toggle-option>
            <sbb-toggle-option value="Value two">Value two</sbb-toggle-option>
          </sbb-toggle>
        `);
        secondOption = element.querySelectorAll('sbb-toggle-option')[1];
        expect(secondOption).to.have.attribute('checked');
      });

      it('should select the correct option by setting value programmatically', async () => {
        element.value = 'Value two';
        await waitForLitRender(element);

        expect(secondOption).to.have.attribute('checked');
      });

      it('should update the value of the sbb-toggle when the value of a checked option changes', async () => {
        firstOption.value = 'Changed';
        await waitForLitRender(element);

        expect(element.value).to.be.equal(firstOption.value);
      });

      it('should not update the value of the sbb-toggle when the value of a unchecked option changes', async () => {
        secondOption.value = 'Changed';
        await waitForLitRender(element);

        expect(element.value).not.to.be.equal(secondOption.value);
      });
    });

    describe('checked', () => {
      it('should initially have the checked attributes on the first option by default', async () => {
        expect(firstOption).to.have.attribute('checked');
      });

      it('should initially have the checked property set to true on the first option by default', async () => {
        expect(firstOption.checked).to.be.equal(true);
      });

      it('should select the correct option by setting checked on the option', async () => {
        secondOption.checked = true;
        await waitForLitRender(secondOption);

        expect(secondOption).to.have.attribute('checked');
      });

      it('should select the correct option by setting the checked attribute on the option', async () => {
        element = await fixture(html`
          <sbb-toggle>
            <sbb-toggle-option value="Value one">Value one</sbb-toggle-option>
            <sbb-toggle-option value="Value two" checked>Value two</sbb-toggle-option>
          </sbb-toggle>
        `);
        secondOption = element.querySelectorAll('sbb-toggle-option')[1];

        expect(secondOption.checked).to.be.equal(true);
      });

      it('should check first option when unchecking all options', async () => {
        firstOption.setAttribute('checked', 'false');
        await waitForLitRender(firstOption);

        expect(firstOption.checked).to.be.equal(true);
      });
    });

    describe('disabled', () => {
      it('should sync disabled state with options', async () => {
        element = await fixture(html`
          <sbb-toggle disabled>
            <sbb-toggle-option value="Value one">Value one</sbb-toggle-option>
            <sbb-toggle-option value="Value two">Value two</sbb-toggle-option>
          </sbb-toggle>
        `);
        const options = Array.from(element.querySelectorAll('sbb-toggle-option'));

        options.forEach((option) => expect(option).to.have.attribute('disabled'));
      });

      it('should prevent disabled option from unsetting disabled', async () => {
        element = await fixture(html`
          <sbb-toggle disabled>
            <sbb-toggle-option value="Value one">Value one</sbb-toggle-option>
            <sbb-toggle-option value="Value two">Value two</sbb-toggle-option>
          </sbb-toggle>
        `);
        firstOption = element.querySelectorAll('sbb-toggle-option')[0];
        firstOption.disabled = false;

        await waitForLitRender(element);

        expect(firstOption).to.have.attribute('disabled');
      });

      it('should prevent enabled option from setting disabled', async () => {
        firstOption.disabled = true;
        await waitForLitRender(element);

        expect(firstOption).not.to.have.attribute('disabled');
      });
    });
  });

  describe('events', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <sbb-toggle value="Value one">
          <sbb-toggle-option id="sbb-toggle-option-1" value="Value one">
            Value one
          </sbb-toggle-option>
          <sbb-toggle-option id="sbb-toggle-option-2" value="Value two">
            Value two
          </sbb-toggle-option>
        </sbb-toggle>
      `);
      firstOption = element.querySelector<SbbToggleOptionElement>('#sbb-toggle-option-1')!;
      secondOption = element.querySelector<SbbToggleOptionElement>('#sbb-toggle-option-2')!;
    });

    it('selects option on click', async () => {
      expect(firstOption).to.have.attribute('checked');

      secondOption.click();
      await waitForLitRender(secondOption);

      expect(secondOption).to.have.attribute('checked');
      expect(firstOption).not.to.have.attribute('checked');
    });

    it('selects option on checked attribute change', async () => {
      expect(firstOption).to.have.attribute('checked');

      secondOption.toggleAttribute('checked', true);
      await waitForLitRender(element);

      expect(secondOption).to.have.attribute('checked');
      expect(firstOption).not.to.have.attribute('checked');
    });

    it('selects option on checked property change', async () => {
      expect(firstOption.checked).to.equal(true);

      secondOption.checked = true;
      await waitForLitRender(element);

      expect(firstOption.checked).to.equal(false);
      expect(secondOption.checked).to.equal(true);
    });

    it('dispatches event on option change', async () => {
      const changeSpy = new EventSpy('change');
      const inputSpy = new EventSpy('input');

      let valueInEvent;

      // Checking value in events of EventSpy is too late to check the real use case,
      // therefore we create a once-EventListener manually here.
      element.addEventListener(
        'change',
        (event) => (valueInEvent = (event.target as SbbToggleElement).value),
        { once: true },
      );

      secondOption.click();
      await waitForLitRender(firstOption);
      await waitForCondition(() => changeSpy.events.length === 1);
      await waitForCondition(() => inputSpy.events.length === 1);
      expect(valueInEvent).to.equal('Value two');

      // Checking value in events of EventSpy is too late to check the real use case,
      // therefore we create a once-EventListener manually here.
      element.addEventListener(
        'change',
        (event) => (valueInEvent = (event.target as SbbToggleElement).value),
        { once: true },
      );

      firstOption.click();
      await waitForLitRender(firstOption);
      await waitForCondition(() => changeSpy.events.length === 2);
      await waitForCondition(() => inputSpy.events.length === 2);

      expect(firstOption).to.have.attribute('checked');
      expect(valueInEvent).to.equal('Value one');
    });

    it('prevents selection with disabled state', async () => {
      element.disabled = true;
      await waitForLitRender(element);

      await secondOption.click();
      await waitForLitRender(element);
      expect(secondOption).not.to.have.attribute('checked');
      expect(firstOption).to.have.attribute('checked');

      element.disabled = false;
      await waitForLitRender(element);

      await secondOption.click();
      await waitForLitRender(element);
      expect(secondOption).to.have.attribute('checked');
      expect(firstOption).not.to.have.attribute('checked');
    });

    it('selects option on left arrow key pressed', async () => {
      const changeSpy = new EventSpy('change');
      const inputSpy = new EventSpy('input');

      firstOption.focus();
      await sendKeys({ down: 'ArrowLeft' });
      await waitForLitRender(element);

      expect(secondOption).to.have.attribute('checked');
      await waitForCondition(() => changeSpy.events.length === 1);
      await waitForCondition(() => inputSpy.events.length === 1);

      firstOption.click();
      await waitForLitRender(firstOption);

      expect(firstOption).to.have.attribute('checked');
    });

    it('selects option on right arrow key pressed', async () => {
      const changeSpy = new EventSpy('change');
      const inputSpy = new EventSpy('input');

      firstOption.focus();
      await waitForLitRender(firstOption);
      await sendKeys({ down: 'ArrowRight' });
      await waitForLitRender(element);

      expect(secondOption).to.have.attribute('checked');
      await waitForCondition(() => changeSpy.events.length === 1);
      await waitForCondition(() => inputSpy.events.length === 1);

      firstOption.click();
      await waitForLitRender(firstOption);

      expect(firstOption).to.have.attribute('checked');
    });
  });
});
