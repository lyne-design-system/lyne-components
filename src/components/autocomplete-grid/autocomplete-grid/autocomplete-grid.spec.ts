import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { isSafari } from '../../core/dom';
import { describeIf } from '../../core/testing';

import type { SbbAutocompleteGridElement } from './autocomplete-grid';
import './autocomplete-grid';
import '../autocomplete-grid-row';
import '../autocomplete-grid-option';
import '../autocomplete-grid-actions';
import '../autocomplete-grid-button';

describe('sbb-autocomplete-grid', () => {
  let root: SbbAutocompleteGridElement;

  beforeEach(async () => {
    root = await fixture(html`
      <sbb-autocomplete-grid>
        <sbb-autocomplete-grid-row>
          <sbb-autocomplete-grid-option>Option 1</sbb-autocomplete-grid-option>
          <sbb-autocomplete-grid-actions>
            <sbb-autocomplete-grid-button icon-name="dog-small"></sbb-autocomplete-grid-button>
          </sbb-autocomplete-grid-actions>
        </sbb-autocomplete-grid-row>
        <sbb-autocomplete-grid-row>
          <sbb-autocomplete-grid-option>Option 2</sbb-autocomplete-grid-option>
          <sbb-autocomplete-grid-actions>
            <sbb-autocomplete-grid-button icon-name="dog-small"></sbb-autocomplete-grid-button>
          </sbb-autocomplete-grid-actions>
        </sbb-autocomplete-grid-row>
      </sbb-autocomplete-grid>
    `);
  });

  describeIf(!isSafari(), 'Chrome-Firefox', async () => {
    it('Dom', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('ShadowDom', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });
  });

  describeIf(isSafari(), 'Safari', async () => {
    it('Dom', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('ShadowDom', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });
  });
});
