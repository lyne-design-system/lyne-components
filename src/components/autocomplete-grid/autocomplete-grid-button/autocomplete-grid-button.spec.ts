import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { waitForLitRender } from '../../core/testing';
import { fixture, testA11yTreeSnapshot } from '../../core/testing/private';

import type { SbbAutocompleteGridButtonElement } from './autocomplete-grid-button';
import '../autocomplete-grid';
import '../autocomplete-grid-row';
import '../autocomplete-grid-actions';
import './autocomplete-grid-button';

describe('sbb-autocomplete-grid-button', () => {
  describe('renders', () => {
    let root: SbbAutocompleteGridButtonElement;
    beforeEach(async () => {
      root = (
        await fixture(html`
          <sbb-autocomplete-grid origin="anchor">
            <sbb-autocomplete-grid-row>
              <sbb-autocomplete-grid-actions>
                <sbb-autocomplete-grid-button icon-name="pie-small"></sbb-autocomplete-grid-button>
              </sbb-autocomplete-grid-actions>
            </sbb-autocomplete-grid-row>
          </sbb-autocomplete-grid>
          <div id="anchor"></div>
        `)
      ).querySelector('sbb-autocomplete-grid-button')!;
      await waitForLitRender(root);
    });

    it('Dom', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('ShadowDom', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders disabled', () => {
    let root: SbbAutocompleteGridButtonElement;
    beforeEach(async () => {
      root = (
        await fixture(html`
          <sbb-autocomplete-grid origin="anchor">
            <sbb-autocomplete-grid-row>
              <sbb-autocomplete-grid-actions>
                <sbb-autocomplete-grid-button
                  disabled
                  icon-name="pie-small"
                ></sbb-autocomplete-grid-button>
              </sbb-autocomplete-grid-actions>
            </sbb-autocomplete-grid-row>
          </sbb-autocomplete-grid>
          <div id="anchor"></div>
        `)
      ).querySelector('sbb-autocomplete-grid-button')!;
      await waitForLitRender(root);
    });

    it('Dom', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('ShadowDom', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });
  });

  describe('renders negative without icon', () => {
    let root: SbbAutocompleteGridButtonElement;
    beforeEach(async () => {
      root = (
        await fixture(html`
          <sbb-form-field negative>
            <input />
            <sbb-autocomplete-grid>
              <sbb-autocomplete-grid-row>
                <sbb-autocomplete-grid-actions>
                  <sbb-autocomplete-grid-button></sbb-autocomplete-grid-button>
                </sbb-autocomplete-grid-actions>
              </sbb-autocomplete-grid-row>
            </sbb-autocomplete-grid>
          </sbb-form-field>
        `)
      ).querySelector('sbb-autocomplete-grid-button')!;
      await waitForLitRender(root);
    });

    it('Dom', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('ShadowDom', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });
  });

  testA11yTreeSnapshot(
    html`<sbb-autocomplete-grid-button icon-name="pie-small"></sbb-autocomplete-grid-button>`,
  );
});
