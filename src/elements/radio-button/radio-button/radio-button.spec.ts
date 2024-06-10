import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private.js';
import { waitForCondition, waitForLitRender, EventSpy } from '../../core/testing.js';

import { SbbRadioButtonElement } from './radio-button.js';

describe(`sbb-radio-button`, () => {
  let element: SbbRadioButtonElement;

  describe('general', () => {
    beforeEach(async () => {
      element = await fixture(html`<sbb-radio-button value="Value">Value label</sbb-radio-button>`);
    });

    it('renders', async () => {
      assert.instanceOf(element, SbbRadioButtonElement);
    });

    it('should have corresponding aria values set', async () => {
      expect(element).to.have.attribute('aria-checked', 'false');
      expect(element).to.have.attribute('aria-required', 'false');
      expect(element).not.to.have.attribute('aria-disabled');
    });

    it('should update aria values', async () => {
      element.checked = true;
      element.required = true;
      element.disabled = true;

      await waitForLitRender(element);

      expect(element).to.have.attribute('aria-checked', 'true');
      expect(element).to.have.attribute('aria-required', 'true');
      expect(element).to.have.attribute('aria-disabled', 'true');
    });

    it('should not render accessibility label about containing state', async () => {
      element = element.shadowRoot!.querySelector('.sbb-screen-reader-only:not(input)')!;
      expect(element).not.to.be.ok;
    });

    it('selects radio on click', async () => {
      const stateChange = new EventSpy(SbbRadioButtonElement.events.stateChange);

      element.click();
      await waitForLitRender(element);

      expect(element).to.have.attribute('checked');
      await waitForCondition(() => stateChange.events.length === 1);
      expect(stateChange.count).to.be.equal(1);
    });

    it('does not deselect radio if already checked', async () => {
      const stateChange = new EventSpy(SbbRadioButtonElement.events.stateChange);

      element.click();
      await waitForLitRender(element);
      expect(element).to.have.attribute('checked');
      await waitForCondition(() => stateChange.events.length === 1);
      expect(stateChange.count).to.be.equal(1);

      element.click();
      await waitForLitRender(element);
      expect(element).to.have.attribute('checked');
      await waitForCondition(() => stateChange.events.length === 1);
      expect(stateChange.count).to.be.equal(1);
    });

    it('allows empty selection', async () => {
      const stateChange = new EventSpy(SbbRadioButtonElement.events.stateChange);

      element.allowEmptySelection = true;
      element.click();
      await waitForLitRender(element);
      expect(element).to.have.attribute('checked');
      await waitForCondition(() => stateChange.events.length === 1);
      expect(stateChange.count).to.be.equal(1);

      element.click();
      await waitForLitRender(element);
      expect(element).not.to.have.attribute('checked');
      await waitForCondition(() => stateChange.events.length === 2);
      expect(stateChange.count).to.be.equal(2);
    });

    it('should convert falsy checked to false', async () => {
      element.checked = true;
      (element.checked as any) = undefined;

      await waitForLitRender(element);

      expect(element.checked).to.equal(false);
      expect(element).to.have.attribute('aria-checked', 'false');
    });

    it('should convert truthy checked to true', async () => {
      element.checked = true;
      (element.checked as any) = 2;

      await waitForLitRender(element);

      expect(element.checked).to.equal(true);
      expect(element).to.have.attribute('aria-checked', 'true');
    });

    it('should convert falsy disabled to false', async () => {
      element.disabled = true;
      (element.disabled as any) = undefined;

      await waitForLitRender(element);

      expect(element.disabled).to.equal(false);
      expect(element).not.to.have.attribute('aria-disabled');
    });

    it('should convert truthy disabled to true', async () => {
      element.disabled = true;
      (element.disabled as any) = 2;

      await waitForLitRender(element);

      expect(element.disabled).to.equal(true);
      expect(element).to.have.attribute('aria-disabled', 'true');
    });

    it('should convert falsy required to false', async () => {
      element.required = true;
      (element.required as any) = undefined;

      await waitForLitRender(element);

      expect(element.required).to.equal(false);
      expect(element).to.have.attribute('aria-required', 'false');
    });

    it('should convert truthy required to true', async () => {
      element.required = true;
      (element.required as any) = 2;

      await waitForLitRender(element);

      expect(element.required).to.equal(true);
      expect(element).to.have.attribute('aria-required', 'true');
    });

    it('should convert falsy allowEmptySelection to false', async () => {
      element.allowEmptySelection = true;
      (element.allowEmptySelection as any) = undefined;

      await waitForLitRender(element);

      expect(element.allowEmptySelection).to.equal(false);
    });

    it('should convert truthy allowEmptySelection to true', async () => {
      element.allowEmptySelection = true;
      (element.allowEmptySelection as any) = 2;

      await waitForLitRender(element);

      expect(element.allowEmptySelection).to.equal(true);
    });
  });

  describe('with initial attributes', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<sbb-radio-button value="Value" checked disabled required>
          Value label
        </sbb-radio-button>`,
      );
    });

    it('should have corresponding aria values set', async () => {
      expect(element).to.have.attribute('aria-checked', 'true');
      expect(element).to.have.attribute('aria-required', 'true');
      expect(element).to.have.attribute('aria-disabled', 'true');
    });

    it('should update aria values', async () => {
      element.checked = false;
      element.required = false;
      element.disabled = false;

      await waitForLitRender(element);

      expect(element).to.have.attribute('aria-checked', 'false');
      expect(element).to.have.attribute('aria-required', 'false');
      expect(element).not.to.have.attribute('aria-disabled');
    });
  });
});
