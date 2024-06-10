import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbTabTitleElement } from './tab-title.js';

describe(`sbb-tab-title ${fixture.name}`, () => {
  let root: SbbTabTitleElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-tab-title></sbb-tab-title>`, { modules: ['./tab-title.js'] });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbTabTitleElement);
  });
});
