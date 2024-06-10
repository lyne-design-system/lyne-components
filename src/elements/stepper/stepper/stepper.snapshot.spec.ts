import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';
import { waitForLitRender } from '../../core/testing.js';

import type { SbbStepperElement } from './stepper.js';
import './stepper.js';
import '../step.js';
import '../step-label.js';

describe('sbb-stepper', () => {
  let element: SbbStepperElement;

  beforeEach(async () => {
    element = await fixture(html`
      <sbb-stepper selected-index="0">
        <sbb-step-label>Test step label 1</sbb-step-label>
        <sbb-step>Test step content 1</sbb-step>
        <sbb-step-label>Test step label 2</sbb-step-label>
        <sbb-step>Test step content 2</sbb-step>
        <sbb-step-label disabled>Test step label 3</sbb-step-label>
        <sbb-step>Test step content 3</sbb-step>
        <sbb-step-label>Test step label 4</sbb-step-label>
      </sbb-stepper>
    `);
    await waitForLitRender(element);
  });

  it('renders - DOM', async () => {
    await expect(element).dom.to.be.equalSnapshot();
  });

  it('renders - Shadow DOM', async () => {
    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
