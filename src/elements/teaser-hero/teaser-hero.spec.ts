import { assert, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../core/testing/private.js';
import { waitForLitRender } from '../core/testing.js';

import { SbbTeaserHeroElement } from './teaser-hero.js';

const imageUrl = import.meta.resolve('../clock/assets/sbb_clock_face.svg');

describe(`sbb-teaser-hero`, () => {
  let element: SbbTeaserHeroElement;

  it('renders', async () => {
    element = await fixture(
      html`<sbb-teaser-hero href="https://www.sbb.ch" image-src=${imageUrl}></sbb-teaser-hero>`,
    );

    assert.instanceOf(element, SbbTeaserHeroElement);
  });

  it('should receive focus', async () => {
    element = await fixture(
      html`<sbb-teaser-hero href="link" id="focus-id">Hero content</sbb-teaser-hero>`,
    );

    element.focus();
    await waitForLitRender(element);

    expect(document.activeElement!.id).to.be.equal('focus-id');
  });
});
