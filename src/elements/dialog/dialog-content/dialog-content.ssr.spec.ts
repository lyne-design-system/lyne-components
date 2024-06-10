import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbDialogContentElement } from './dialog-content.js';

describe(`sbb-dialog-content ${fixture.name}`, () => {
  let root: SbbDialogContentElement;

  beforeEach(async () => {
    root = await fixture(html`<sbb-dialog-content>Content</sbb-dialog-content>`, {
      modules: ['./dialog-content.js'],
    });
  });

  it('renders', () => {
    assert.instanceOf(root, SbbDialogContentElement);
  });
});
