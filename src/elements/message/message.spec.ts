import { assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../core/testing/private.js';

import { SbbMessageElement } from './message.js';

describe(`sbb-message`, () => {
  let element: SbbMessageElement;

  it('renders', async () => {
    element = await fixture(html`<sbb-message></sbb-message>`);
    assert.instanceOf(element, SbbMessageElement);
  });
});
