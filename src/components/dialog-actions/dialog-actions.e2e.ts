import { assert, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { SbbDialogActionsElement } from './dialog-actions';

describe('sbb-dialog-actions', () => {
  let element: SbbDialogActionsElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-dialog-actions></sbb-dialog-actions>`);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbDialogActionsElement);
  });
});
