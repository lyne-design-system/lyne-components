import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import type { SbbCheckboxGroupElement } from './checkbox-group.js';

import './checkbox-group.js';
import '../checkbox.js';

describe(`sbb-checkbox-group`, () => {
  let element: SbbCheckboxGroupElement;

  beforeEach(async () => {
    element = await fixture(html`
      <sbb-checkbox-group>
        <sbb-checkbox value="checkbox-1">Label 1</sbb-checkbox>
        <sbb-checkbox value="checkbox-2">Label 2</sbb-checkbox>
        <sbb-checkbox value="checkbox-3">Label 3</sbb-checkbox>
      </sbb-checkbox-group>
    `);
  });

  it('renders - DOM', async () => {
    await expect(element).dom.to.be.equalSnapshot();
  });

  it('renders - Shadow DOM', async () => {
    await expect(element).shadowDom.to.be.equalSnapshot();
  });

  testA11yTreeSnapshot();
});
