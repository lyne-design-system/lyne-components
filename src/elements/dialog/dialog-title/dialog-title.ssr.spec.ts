import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbDialogTitleElement } from './dialog-title.js';

describe(`sbb-dialog-title ${fixture.name}`, () => {
  let root: SbbDialogTitleElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-dialog-title back-button>Title</sbb-dialog-title>`, {
      modules: ['./dialog-title.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbDialogTitleElement);
  });
});
