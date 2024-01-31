import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { waitForLitRender } from '../../core/testing';
import { testA11yTreeSnapshot } from '../../core/testing/a11y-tree-snapshot';

import type { SbbBreadcrumbGroupElement } from './breadcrumb-group';
import '../breadcrumb';
import './breadcrumb-group';

describe('sbb-breadcrumb-group', () => {
  let root: SbbBreadcrumbGroupElement;

  beforeEach(async () => {
    root = await fixture(html`
      <sbb-breadcrumb-group>
        <sbb-breadcrumb href="/" icon-name="pie-small"></sbb-breadcrumb>
        <sbb-breadcrumb href="/one">One</sbb-breadcrumb>
        <sbb-breadcrumb href="/one">Two</sbb-breadcrumb>
      </sbb-breadcrumb-group>
    `);
    await waitForLitRender(root);
  });

  it('renders - Dom', async () => {
    await expect(root).dom.to.be.equalSnapshot();
  });

  it('renders - ShadowDom', async () => {
    await expect(root).shadowDom.to.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
