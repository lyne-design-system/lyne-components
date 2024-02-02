import { assert, expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { EventSpy, waitForLitRender } from '../core/testing';

import { SbbDialogActionsElement } from './dialog-actions';

describe('sbb-dialog-actions', () => {
  let element: SbbDialogActionsElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-dialog-actions></sbb-dialog-actions>`);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbDialogActionsElement);
  });

  it('emits on click', async () => {
    const myEventNameSpy = new EventSpy(SbbDialogActionsElement.events.myEventName);
    element.click();
    await waitForLitRender(element);
    expect(myEventNameSpy.count).to.be.equal(1);
  });
});
