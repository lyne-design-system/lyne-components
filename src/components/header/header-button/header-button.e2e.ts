import { assert, expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit/static-html.js';

import { EventSpy, waitForCondition, waitForLitRender } from '../../core/testing';

import { SbbHeaderButtonElement } from './header-button';

describe('sbb-header-button', () => {
  let element: SbbHeaderButtonElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-header-button id="focus-id">Action</sbb-header-button>`);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbHeaderButtonElement);
  });

  describe('events', () => {
    it('dispatches event on click', async () => {
      const clickSpy = new EventSpy('click');

      element.click();
      await waitForCondition(() => clickSpy.events.length === 1);
      expect(clickSpy.count).to.be.equal(1);
    });

    it('should dispatch click event on pressing Enter', async () => {
      const clickSpy = new EventSpy('click');
      element.focus();
      await sendKeys({ press: 'Enter' });
      expect(clickSpy.count).to.be.greaterThan(0);
    });

    it('should dispatch click event on pressing Space', async () => {
      const clickSpy = new EventSpy('click');
      element.focus();
      await sendKeys({ press: ' ' });
      expect(clickSpy.count).to.be.greaterThan(0);
    });

    it('should receive focus', async () => {
      element.focus();
      await waitForLitRender(element);

      expect(document.activeElement!.id).to.be.equal('focus-id');
    });
  });
});