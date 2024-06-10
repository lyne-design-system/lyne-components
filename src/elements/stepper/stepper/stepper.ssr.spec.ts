import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbStepperElement } from './stepper.js';

import '../step.js';
import '../step-label.js';

describe(`sbb-stepper ${fixture.name}`, () => {
  let root: SbbStepperElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-stepper selected-index="0">
          <sbb-step-label>Test step label 1</sbb-step-label>
          <sbb-step>Test step content 1</sbb-step>
          <sbb-step-label>Test step label 2</sbb-step-label>
          <sbb-step>Test step content 2</sbb-step>
          <sbb-step-label disabled>Test step label 3</sbb-step-label>
          <sbb-step>Test step content 3</sbb-step>
          <sbb-step-label>Test step label 4</sbb-step-label>
        </sbb-stepper>
      `,
      { modules: ['./stepper.js', '../step.js', '../step-label.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbStepperElement);
  });
});
