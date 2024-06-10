import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../core/testing/private.js';
import { waitForLitRender } from '../core/testing.js';

import type { SbbDividerElement } from './divider.js';

import './divider.js';

describe(`sbb-divider`, () => {
  it('should render with default values', async () => {
    const element: SbbDividerElement = await fixture(html`<sbb-divider></sbb-divider>`);
    expect(element).dom.to.be.equal(
      `<sbb-divider orientation='horizontal' aria-orientation='horizontal' role='separator'></sbb-divider>`,
    );
    expect(element).shadowDom.to.be.equal(`<div class='sbb-divider'></div>`);
  });

  it('should render with orientation horizontal', async () => {
    const element: SbbDividerElement = await fixture(
      html`<sbb-divider orientation="horizontal"></sbb-divider>`,
    );
    expect(element).dom.to.be.equal(
      `<sbb-divider orientation='horizontal' aria-orientation='horizontal' role='separator'></sbb-divider>`,
    );
    expect(element).shadowDom.to.be.equal(`<div class='sbb-divider'></div>`);
  });

  it('should render with orientation vertical', async () => {
    const element: SbbDividerElement = await fixture(
      html`<sbb-divider orientation="vertical"></sbb-divider>`,
    );
    expect(element).dom.to.be.equal(
      `<sbb-divider orientation='vertical' aria-orientation='vertical' role='separator'></sbb-divider>`,
    );
    expect(element).shadowDom.to.be.equal(`<div class='sbb-divider'></div>`);
  });

  it('should react to change of orientation', async () => {
    const element: SbbDividerElement = await fixture(html`<sbb-divider></sbb-divider>`);

    element.orientation = 'vertical';
    await waitForLitRender(element);
    expect(element).to.have.attribute('aria-orientation', 'vertical');
  });

  testA11yTreeSnapshot(html`<sbb-divider></sbb-divider>`);
});
