import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';

import { SbbClockElement } from './clock.js';

describe(`sbb-clock`, () => {
  let element: SbbClockElement;

  it('renders', async () => {
    element = await fixture(html`<sbb-clock></sbb-clock>`);
    assert.instanceOf(element, SbbClockElement);

    expect(element).dom.to.be.equal(`<sbb-clock></sbb-clock>`);

    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  it('renders with a fixed time', async () => {
    element = await fixture(html`<sbb-clock now="12:30:00"></sbb-clock>`);
    assert.instanceOf(element, SbbClockElement);

    expect(element).to.have.attribute('data-initialized');

    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot(html`<sbb-clock></sbb-clock>`);
});
