import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbAlertElement } from './alert.js';

describe(`sbb-alert ${fixture.name}`, () => {
  let root: SbbAlertElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-alert></sbb-alert>`, { modules: ['./alert.js'] });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbAlertElement);
  });
});
