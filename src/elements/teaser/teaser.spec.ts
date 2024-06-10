import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../core/testing/private.js';
import { EventSpy, waitForLitRender } from '../core/testing.js';

import { SbbTeaserElement } from './teaser.js';

describe(`sbb-teaser`, () => {
  let element: SbbTeaserElement;

  beforeEach(async () => {
    element = await fixture(html`<sbb-teaser id="focus-id" href="#">Content</sbb-teaser>`);
  });

  it('should render', async () => {
    assert.instanceOf(element, SbbTeaserElement);
  });

  it('should receive focus', async () => {
    element.focus();
    await waitForLitRender(element);
    expect(document.activeElement!.id).to.be.equal('focus-id');
  });

  it('dispatches event on click', async () => {
    const clickSpy = new EventSpy('click');

    element.click();
    expect(clickSpy.count).to.be.equal(1);
  });
});
