import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { fixture } from '../../core/testing/private';

import type { SbbAutocompleteGridOptionElement } from './autocomplete-grid-option';
import '../autocomplete-grid';
import '../autocomplete-grid-row';
import './autocomplete-grid-option';
import '../autocomplete-grid-actions';
import '../autocomplete-grid-button';

describe('sbb-autocomplete-grid-option', () => {
  let root: SbbAutocompleteGridOptionElement;
  beforeEach(async () => {
    root = (
      await fixture(html`
        <sbb-autocomplete-grid origin="anchor">
          <sbb-autocomplete-grid-row>
            <sbb-autocomplete-grid-option value="1">Option 1</sbb-autocomplete-grid-option>
          </sbb-autocomplete-grid-row>
        </sbb-autocomplete-grid>
        <div id="anchor"></div>
      `)
    ).querySelector('sbb-autocomplete-grid-option')!;
  });

  it('Dom', async () => {
    await expect(root).dom.to.be.equalSnapshot();
  });

  it('ShadowDom', async () => {
    await expect(root).shadowDom.to.be.equalSnapshot();
  });
});
