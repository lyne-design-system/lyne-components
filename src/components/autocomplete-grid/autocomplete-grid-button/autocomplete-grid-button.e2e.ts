import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { EventSpy, waitForCondition, waitForLitRender } from '../../core/testing';
import { fixture } from '../../core/testing/private';

import { SbbAutocompleteGridButtonElement } from './autocomplete-grid-button';

describe(`sbb-autocomplete-grid-button with ${fixture.name}`, () => {
  let element: SbbAutocompleteGridButtonElement;

  beforeEach(async () => {
    element = await fixture(
      html`<sbb-autocomplete-grid-button>Button</sbb-autocomplete-grid-button>`,
      { modules: ['./autocomplete-grid-button.ts'] },
    );
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbAutocompleteGridButtonElement);
  });

  describe('events', () => {
    it('dispatches event on click', async () => {
      const clickSpy = new EventSpy('click');

      element.click();
      await waitForCondition(() => clickSpy.events.length === 1);
      expect(clickSpy.count).to.be.equal(1);
    });

    it('should not dispatch event on click if disabled', async () => {
      element.setAttribute('disabled', 'true');

      await waitForLitRender(element);

      const clickSpy = new EventSpy('click');

      element.click();
      expect(clickSpy.count).not.to.be.greaterThan(0);
    });

    it('should stop propagating host click if disabled', async () => {
      element.disabled = true;

      const clickSpy = new EventSpy('click');

      element.dispatchEvent(new CustomEvent('click'));
      await waitForLitRender(element);

      expect(clickSpy.count).not.to.be.greaterThan(0);
    });
  });
});
