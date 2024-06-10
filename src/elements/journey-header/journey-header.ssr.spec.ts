import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbJourneyHeaderElement } from './journey-header.js';

describe(`sbb-journey-header ${fixture.name}`, () => {
  let root: SbbJourneyHeaderElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-journey-header></sbb-journey-header>`, {
      modules: ['./journey-header.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbJourneyHeaderElement);
  });
});
