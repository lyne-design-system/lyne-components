import { assert } from '@open-wc/testing';
import { html } from 'lit';

import { fixture } from '../../core/testing/private.js';

import { SbbDialogElement } from './dialog.js';

import '../dialog-actions.js';
import '../dialog-content.js';
import '../dialog-title.js';

describe(`sbb-dialog ${fixture.name}`, () => {
  let root: SbbDialogElement;

  beforeEach(async () => {
    root = await fixture(
      html`
        <sbb-dialog id="my-dialog-1">
          <sbb-dialog-title>Title</sbb-dialog-title>
          <sbb-dialog-content>Dialog content</sbb-dialog-content>
          <sbb-dialog-actions>Action group</sbb-dialog-actions>
        </sbb-dialog>
      `,
      {
        modules: [
          './dialog.js',
          '../dialog-actions.js',
          '../dialog-content.js',
          '../dialog-title.js',
        ],
      },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbDialogElement);
  });
});
