import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbStepElement } from './step.js';

describe(`sbb-step ${fixture.name}`, () => {
  let root: SbbStepElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-step>Step</sbb-step>`, { modules: ['./step.js'] });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbStepElement);
  });
});
