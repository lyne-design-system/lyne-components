import { assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../core/testing/private.js';

import { SbbFormErrorElement } from './form-error.js';

describe(`sbb-form-error`, () => {
  let element: SbbFormErrorElement;

  it('renders', async () => {
    element = await fixture(html`<sbb-form-error></sbb-form-error>`);
    assert.instanceOf(element, SbbFormErrorElement);
  });
});
