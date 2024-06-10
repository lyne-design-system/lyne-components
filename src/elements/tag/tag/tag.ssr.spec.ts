import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbTagElement } from './tag.js';

describe(`sbb-tag ${fixture.name}`, () => {
  let root: SbbTagElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-tag value="tag">Tag</sbb-tag>`, { modules: ['./tag.js'] });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbTagElement);
  });
});
