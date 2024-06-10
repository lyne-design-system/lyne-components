import { assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../core/testing/private.js';

import { SbbFooterElement } from './footer.js';

describe(`sbb-footer`, () => {
  let element: SbbFooterElement;

  it('renders', async () => {
    element = await fixture(html`<sbb-footer></sbb-footer>`);
    assert.instanceOf(element, SbbFooterElement);
  });
});
