import { assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../core/testing/private.js';

import { SbbStatusElement } from './status.js';

describe(`sbb-status`, () => {
  let element: SbbStatusElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-status> Status info text </sbb-status>`);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbStatusElement);
  });
});
