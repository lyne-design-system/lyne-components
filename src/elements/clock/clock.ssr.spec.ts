import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbClockElement } from './clock.js';

describe(`sbb-clock ${fixture.name}`, () => {
  let root: SbbClockElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-clock></sbb-clock>`, { modules: ['./clock.js'] });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbClockElement);
  });
});
