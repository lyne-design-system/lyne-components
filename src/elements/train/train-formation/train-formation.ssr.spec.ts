import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbTrainFormationElement } from './train-formation.js';

describe(`sbb-train-formation ${fixture.name}`, () => {
  let root: SbbTrainFormationElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-train-formation></sbb-train-formation>`, {
      modules: ['./train-formation.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbTrainFormationElement);
  });
});
