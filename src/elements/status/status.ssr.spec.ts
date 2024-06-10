import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbStatusElement } from './status.js';

describe(`sbb-status ${fixture.name}`, () => {
  let root: SbbStatusElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-status> Status info text </sbb-status>`, {
      modules: ['./status.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbStatusElement);
  });
});
