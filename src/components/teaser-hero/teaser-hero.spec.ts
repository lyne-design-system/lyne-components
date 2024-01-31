import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import sampleImages from '../core/images';
import { testA11yTreeSnapshot } from '../core/testing/a11y-tree-snapshot';

import type { SbbTeaserHeroElement } from './teaser-hero';
import './teaser-hero';
import '../link';
import '../image';

describe('sbb-teaser-hero', () => {
  describe('should render all properties', () => {
    let element: SbbTeaserHeroElement;

    beforeEach(async () => {
      element = await fixture(
        html`<sbb-teaser-hero
          aria-label="label"
          href="https://www.sbb.ch"
          rel="external"
          target="_blank"
          link-content="Find out more"
          image-src="${sampleImages[1]}"
          image-alt="SBB CFF FFS Employee"
          >Break out and explore castles and palaces.</sbb-teaser-hero
        >`,
      );
    });

    it('Dom', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('ShadowDom', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot();
  });

  it('should render without link', async () => {
    const root = await fixture(
      html`<sbb-teaser-hero
        aria-label="label"
        link-content="Find out more"
        image-src="${sampleImages[1]}"
        image-alt="SBB CFF FFS Employee"
        >Break out and explore castles and palaces.</sbb-teaser-hero
      >`,
    );

    expect(root).dom.to.be.equal(
      `
      <sbb-teaser-hero aria-label="label" link-content="Find out more" image-src="${sampleImages[1]}" image-alt="SBB CFF FFS Employee" dir="ltr">
          Break out and explore castles and palaces.
        </sbb-teaser-hero>
      `,
    );
    await expect(root).shadowDom.to.be.equalSnapshot();
  });

  it('should render with slots', async () => {
    const root = await fixture(
      html`<sbb-teaser-hero aria-label="label" href="https://www.sbb.ch"
        >Break out and explore castles and palaces.<span slot="link-content">Find out more</span
        ><sbb-image
          slot="image"
          image-src="${sampleImages[1]}"
          alt="SBB CFF FFS Employee"
        ></sbb-image
      ></sbb-teaser-hero>`,
    );

    expect(root).dom.to.be.equal(
      `
      <sbb-teaser-hero aria-label="label" href="https://www.sbb.ch" role="link" tabindex="0" dir="ltr">
          Break out and explore castles and palaces.
          <span slot="link-content">Find out more</span>
          <sbb-image slot="image" image-src="${sampleImages[1]}" alt="SBB CFF FFS Employee"></sbb-image>
        </sbb-teaser-hero>
      `,
    );
    await expect(root).shadowDom.to.be.equalSnapshot();
  });
});
