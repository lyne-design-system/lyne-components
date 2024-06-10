import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbBreadcrumbGroupElement } from './breadcrumb-group.js';

import '../breadcrumb.js';
import './breadcrumb-group.js';

describe(`sbb-breadcrumb-group`, () => {
  let root: SbbBreadcrumbGroupElement;

  beforeEach(async () => {
    root = await fixture(html`
      <sbb-breadcrumb-group>
        <sbb-breadcrumb href="https://example.com" icon-name="pie-small"></sbb-breadcrumb>
        <sbb-breadcrumb href="https://example.com/one">One</sbb-breadcrumb>
        <sbb-breadcrumb href="https://example.com/one">Two</sbb-breadcrumb>
      </sbb-breadcrumb-group>
    `);
  });

  it('renders - DOM', async () => {
    await expect(root).dom.to.be.equalSnapshot();
  });

  it('renders - Shadow DOM', async () => {
    await expect(root).shadowDom.to.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
