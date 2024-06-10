import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbDialogActionsElement } from './dialog-actions.js';

describe(`sbb-dialog-actions ${fixture.name}`, () => {
  let root: SbbDialogActionsElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-dialog-actions></sbb-dialog-actions>`, {
      modules: ['./dialog-actions.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbDialogActionsElement);
  });
});
