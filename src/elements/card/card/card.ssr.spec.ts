import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbCardElement } from './card.js';

describe(`sbb-card ${fixture.name}`, () => {
  let root: SbbCardElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-card size="l" color="transparent-bordered"></sbb-card>`, {
      modules: ['./card.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbCardElement);
  });
});
