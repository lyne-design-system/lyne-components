import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbToastElement } from './toast.js';

describe(`sbb-toast ${fixture.name}`, () => {
  let root: SbbToastElement;

  beforeEach(async () => {
    root = await fixture(html` <sbb-toast></sbb-toast> `, { modules: ['./toast.js'] });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbToastElement);
  });
});
