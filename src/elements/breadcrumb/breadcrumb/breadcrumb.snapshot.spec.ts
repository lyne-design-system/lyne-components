import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import './breadcrumb.js';

describe(`sbb-breadcrumb`, () => {
  it('renders with text', async () => {
    const root = await fixture(html`
      <sbb-breadcrumb href="https://example.com/test" target="_blank" download rel="subsection"
        >Breadcrumb</sbb-breadcrumb
      >
    `);

    expect(root).dom.to.be.equal(`
      <sbb-breadcrumb
        dir="ltr"
        data-action
        data-link
        href="https://example.com/test"
        target="_blank"
        download
        rel="subsection">
        Breadcrumb
      </sbb-breadcrumb>
    `);

    await expect(root).shadowDom.to.equalSnapshot();
  });

  it('renders with icon', async () => {
    const root = await fixture(html`
      <sbb-breadcrumb href="/" icon-name="house-small"></sbb-breadcrumb>
    `);

    expect(root).dom.to.be.equal(`
      <sbb-breadcrumb
        dir="ltr"
        data-action
        data-link
        href="/"
        icon-name="house-small"></sbb-breadcrumb>
    `);

    await expect(root).shadowDom.to.equalSnapshot();
  });

  it('renders with icon and text', async () => {
    const root = await fixture(html`
      <sbb-breadcrumb href="/" icon-name="house-small">Home</sbb-breadcrumb>
    `);

    expect(root).dom.to.be.equal(`
      <sbb-breadcrumb
        dir="ltr"
        data-action
        data-link
        href="/"
        icon-name="house-small">
        Home
      </sbb-breadcrumb>
    `);

    await expect(root).shadowDom.to.equalSnapshot();
  });

  testA11yTreeSnapshot(html`
    <sbb-breadcrumb href="https://example.com/test">Breadcrumb</sbb-breadcrumb>
  `);
});
