import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { waitForLitRender } from '../../core/testing';
import { testA11yTreeSnapshot } from '../../core/testing/a11y-tree-snapshot';

import type { SbbStepperElement } from '.';
import './stepper';
import '../step';
import '../step-label';

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

  it('renders - Dom', async () => {
    await expect(element).dom.to.be.equalSnapshot();
  });

  it('renders - ShadowDom', async () => {
    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
