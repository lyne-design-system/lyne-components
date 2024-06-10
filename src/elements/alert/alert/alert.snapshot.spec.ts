import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbAlertElement } from './alert.js';

import './alert.js';

describe(`sbb-alert`, () => {
  let element: SbbAlertElement;

  it('should render default properties', async () => {
    element = await fixture(
      html`<sbb-alert title-content="Interruption">Alert content</sbb-alert>`,
    );

    expect(element).dom.to.be.equal(
      `
        <sbb-alert title-content="Interruption" size="m" data-state="opening" animation="open">
           Alert content
        </sbb-alert>
      `,
    );

    await expect(element).shadowDom.to.equalSnapshot();
  });

  it('should render customized properties', async () => {
    element = await fixture(
      html`<sbb-alert
        title-content="Interruption"
        title-level="2"
        size="l"
        icon-name="disruption"
        accessibility-label="label"
        href="https://www.sbb.ch"
        rel="noopener"
        target="_blank"
        link-content="Show much more"
        >Alert content</sbb-alert
      >`,
    );

    expect(element).dom.to.be.equal(
      `
        <sbb-alert
          title-content="Interruption"
          title-level="2"
          size="l"
          icon-name="disruption"
          accessibility-label="label"
          href="https://www.sbb.ch"
          rel="noopener" target="_blank"
          link-content="Show much more"
          animation="open"
          data-state="opening"
        >
           Alert content
        </sbb-alert>
      `,
    );
    await expect(element).shadowDom.to.equalSnapshot();
  });

  testA11yTreeSnapshot(html`
    <sbb-alert
      title-content="Interruption"
      href="https://www.sbb.ch"
      accessibility-label="test-a11y-label"
    >
      Alert content
    </sbb-alert>
  `);
});
