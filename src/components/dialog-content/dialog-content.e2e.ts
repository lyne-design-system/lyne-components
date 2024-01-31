import { assert, expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { EventSpy, waitForLitRender } from '../core/testing';

import { SbbDialogContentElement } from './dialog-content';

describe('sbb-dialog-content', () => {
  let element: SbbDialogContentElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-dialog-content></sbb-dialog-content>`);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbDialogContentElement);
  });

  it('emits on click', async () => {
    const myEventNameSpy = new EventSpy(SbbDialogContentElement.events.myEventName);
    element.click();
    await waitForLitRender(element);
    expect(myEventNameSpy.count).to.be.equal(1);
  });
});
