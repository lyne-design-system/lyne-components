import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbCardBadgeElement } from './card-badge.js';

describe(`sbb-card-badge ${fixture.name}`, () => {
  let root: SbbCardBadgeElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-card-badge></sbb-card-badge>`, {
      modules: ['./card-badge.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbCardBadgeElement);
  });
});
