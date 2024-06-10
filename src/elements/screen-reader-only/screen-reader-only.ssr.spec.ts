import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../core/testing/private.js';

import { SbbScreenReaderOnlyElement } from './screen-reader-only.js';

describe(`sbb-screen-reader-only ${fixture.name}`, () => {
  let root: SbbScreenReaderOnlyElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-screen-reader-only>Hidden text.</sbb-screen-reader-only>`, {
      modules: ['./screen-reader-only.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbScreenReaderOnlyElement);
  });
});
