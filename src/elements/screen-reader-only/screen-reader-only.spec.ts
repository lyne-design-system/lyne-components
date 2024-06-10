import { assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../core/testing/private.js';

import { SbbScreenReaderOnlyElement } from './screen-reader-only.js';

describe(`sbb-screen-reader-only`, () => {
  let element: SbbScreenReaderOnlyElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-screen-reader-only>Hidden text.</sbb-screen-reader-only>`);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbScreenReaderOnlyElement);
  });
});
