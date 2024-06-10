import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbTitleElement } from './title.js';

describe(`sbb-title ${fixture.name}`, () => {
  let root: SbbTitleElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-title></sbb-title>`, { modules: ['./title.js'] });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbTitleElement);
  });
});
