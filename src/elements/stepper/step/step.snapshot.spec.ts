import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbStepElement } from './step.js';
import './step.js';

describe('sbb-step', () => {
  let element: SbbStepElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-step>Step content</sbb-step>`);
  });

  it('renders - DOM', async () => {
    await expect(element).dom.to.be.equalSnapshot();
  });

  it('renders - Shadow DOM', async () => {
    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
