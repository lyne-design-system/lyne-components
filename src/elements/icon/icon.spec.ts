import { assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../core/testing/private.js';

import { SbbIconElement } from './icon.js';

describe(`sbb-icon`, () => {
  let element: SbbIconElement;

  it('renders', async () => {
    element = await fixture(html`<sbb-icon></sbb-icon>`);

    assert.instanceOf(element, SbbIconElement);
  });
});
