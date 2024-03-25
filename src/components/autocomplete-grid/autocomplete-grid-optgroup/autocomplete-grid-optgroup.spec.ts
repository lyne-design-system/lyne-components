import { expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { isSafari } from '../../core/dom';
import { describeIf } from '../../core/testing';
import { fixture } from '../../core/testing/private';

import './autocomplete-grid-optgroup';
import '../autocomplete-grid';
import '../autocomplete-grid-row';
import '../autocomplete-grid-option';
import '../autocomplete-grid-actions';
import '../autocomplete-grid-button';
import type { SbbAutocompleteGridOptgroupElement } from './autocomplete-grid-optgroup';

describe('sbb-autocomplete-grid-optgroup', () => {
  let root: SbbAutocompleteGridOptgroupElement;
  beforeEach(async () => {
    root = (
      await fixture(html`
        <sbb-autocomplete-grid origin="anchor">
          <sbb-autocomplete-grid-optgroup>
            <sbb-autocomplete-grid-row>
              <sbb-autocomplete-grid-option value="1">Option 1</sbb-autocomplete-grid-option>
            </sbb-autocomplete-grid-row>
            <sbb-autocomplete-grid-row>
              <sbb-autocomplete-grid-option value="2">Option 2</sbb-autocomplete-grid-option>
            </sbb-autocomplete-grid-row>
          </sbb-autocomplete-grid-optgroup>
        </sbb-autocomplete-grid>
        <div id="anchor"></div>
      `)
    ).querySelector('sbb-autocomplete-grid-optgroup')!;
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
