import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbRadioButtonElement } from './radio-button.js';

import './radio-button.js';

describe(`sbb-radio-button`, () => {
  let element: SbbRadioButtonElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-radio-button value="radio-value"></sbb-radio-button>`);
  });

  it('renders - DOM', async () => {
    await expect(element).dom.to.be.equalSnapshot();
  });

  it('renders - Shadow DOM', async () => {
    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
