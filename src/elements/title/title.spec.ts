import { assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../core/testing/private.js';

import { SbbTitleElement } from './title.js';

describe(`sbb-title`, () => {
  let element: SbbTitleElement;

  it('renders', async () => {
    element = await fixture(html`<sbb-title></sbb-title>`);
    assert.instanceOf(element, SbbTitleElement);
  });
});
