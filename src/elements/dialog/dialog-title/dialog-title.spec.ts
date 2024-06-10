import { assert, expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { EventSpy, waitForLitRender } from '../../core/testing.js';

import { SbbDialogTitleElement } from './dialog-title.js';

describe('sbb-dialog-title', () => {
  let element: SbbDialogTitleElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-dialog-title back-button>Title</sbb-dialog-title>`);
  });

  it('renders', async () => {
    assert.instanceOf(element, SbbDialogTitleElement);
  });

  it('emits requestBackAction on back button click', async () => {
    const myEventNameSpy = new EventSpy(SbbDialogTitleElement.events.backClick);
    (element.shadowRoot!.querySelector('.sbb-dialog__back')! as HTMLElement).click();
    await waitForLitRender(element);
    expect(myEventNameSpy.count).to.be.equal(1);
  });
});
