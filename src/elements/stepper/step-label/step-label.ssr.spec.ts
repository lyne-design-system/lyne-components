import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbStepLabelElement } from './step-label.js';

describe(`sbb-step-label ${fixture.name}`, () => {
  let root: SbbStepLabelElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-step-label>Label</sbb-step-label>`, {
      modules: ['./step-label.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbStepLabelElement);
  });
});
