import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';

import './form-field.js';
import '../../form-error.js';
import type { SbbFormFieldElement } from './form-field.js';

describe(`sbb-form-field`, () => {
  describe('renders input', () => {
    let element: SbbFormFieldElement;

    beforeEach(async () => {
      element = await fixture(
        html` <sbb-form-field>
          <label>Fill input</label>
          <input placeholder="This is an input" />
        </sbb-form-field>`,
      );
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders disabled input', () => {
    let element: SbbFormFieldElement;

    beforeEach(async () => {
      element = await fixture(html`
        <sbb-form-field>
          <label>Fill input</label>
          <input class="input" disabled placeholder="This is an input" />
        </sbb-form-field>
      `);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders readonly input with error', () => {
    let element: SbbFormFieldElement;

    beforeEach(async () => {
      element = await fixture(html`
        <sbb-form-field>
          <label>Fill input</label>
          <input class="input" readonly placeholder="This is an input" />
          <sbb-form-error id="error"> You can't change this value. </sbb-form-error>
        </sbb-form-field>
      `);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('should render select without label', () => {
    let element: SbbFormFieldElement;
    beforeEach(async () => {
      element = await fixture(html`
        <sbb-form-field>
          <select>
            <option>Value 1</option>
            <option>Value 2</option>
            <option>Value 3</option>
          </select>
        </sbb-form-field>
      `);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders select with optional flag and borderless', () => {
    let element: SbbFormFieldElement;

    beforeEach(async () => {
      element = await fixture(html`
        <sbb-form-field optional borderless>
          <label>Select option:</label>
          <select>
            <option>Value 1</option>
            <option>Value 2</option>
            <option>Value 3</option>
          </select>
        </sbb-form-field>
      `);
    });

    it('DOM', async () => {
      await expect(element).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(element).shadowDom.to.be.equalSnapshot();
    });
  });

  testA11yTreeSnapshot(html`
    <sbb-form-field>
      <label slot="label">Fill input</label>
      <input class="input" placeholder="This is an input" />
    </sbb-form-field>
  `);
});
