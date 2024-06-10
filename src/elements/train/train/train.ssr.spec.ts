import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbTrainElement } from './train.js';

describe(`sbb-train ${fixture.name}`, () => {
  let root: SbbTrainElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-train></sbb-train>`, { modules: ['./train.js'] });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbTrainElement);
  });
});
