import { assert, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { SbbDialogContentElement } from './dialog-content';

describe('sbb-dialog-content', () => {
  let element: SbbDialogContentElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-dialog-content></sbb-dialog-content>`);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbDialogContentElement);
  });
});
