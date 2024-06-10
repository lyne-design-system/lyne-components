import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';

import './title.js';

describe(`sbb-title`, () => {
  it('renders', async () => {
    const root = await fixture(
      html`<sbb-title level="1" visual-level="2">Sample Title Text</sbb-title>`,
    );

    expect(root).dom.to.be.equal(`
      <sbb-title level="1" visual-level="2" aria-level="1" role="heading">
        Sample Title Text
      </sbb-title>
    `);
    expect(root).shadowDom.to.be.equal(`
      <h1 class="sbb-title" role="presentation"><slot></slot></h1>
    `);
  });

  testA11yTreeSnapshot(html`<sbb-title level="1" visual-level="2">Sample Title Text</sbb-title>`);
});
