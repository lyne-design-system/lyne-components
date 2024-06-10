import { assert } from '@open-wc/testing';
import { html } from 'lit';

import images from '../core/images.js';
import { fixture } from '../core/testing/private.js';

import { SbbTeaserHeroElement } from './teaser-hero.js';

describe(`sbb-teaser-hero ${fixture.name}`, () => {
  let root: SbbTeaserHeroElement;

  beforeEach(async () => {
    root = await fixture(
      html`<sbb-teaser-hero href="https://www.sbb.ch" image-src="${images[0]}"></sbb-teaser-hero>`,
      { modules: ['./teaser-hero.js'] },
    );
  });

  it('renders', () => {
    assert.instanceOf(root, SbbTeaserHeroElement);
  });
});
