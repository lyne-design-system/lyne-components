import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbIconElement } from './icon.js';

describe(`sbb-icon ${fixture.name}`, () => {
  let root: SbbIconElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-icon></sbb-icon>`, { modules: ['./icon.js'] });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbIconElement);
  });
});
