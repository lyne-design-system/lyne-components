import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';
import { waitForImageReady } from '../core/testing.js';

import type { SbbLeadContainerElement } from './lead-container.js';

import '../breadcrumb.js';
import '../image.js';
import '../link/block-link/block-link.js';
import '../title.js';
import './lead-container.js';

const imageUrl = import.meta.resolve('./assets/lucerne.png');

describe(`sbb-lead-container`, () => {
  let element: SbbLeadContainerElement;

  beforeEach(async () => {
    element = await fixture(
      html`<sbb-lead-container>
        <sbb-image slot="image" image-src=${imageUrl}></sbb-image>
      </sbb-lead-container>`,
    );
    await waitForImageReady(element.querySelector('sbb-image')!);
  });

  it('DOM', async () => {
    await expect(element).dom.to.be.equalSnapshot({ ignoreAttributes: ['image-src'] });
  });

  it('Shadow DOM', async () => {
    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
