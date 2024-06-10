import { assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../core/testing/private.js';

import { SbbDividerElement } from './divider.js';

describe(`sbb-divider`, () => {
  it('renders', async () => {
    const element: SbbDividerElement = await fixture(html`<sbb-divider></sbb-divider>`);
    assert.instanceOf(element, SbbDividerElement);
  });
});
