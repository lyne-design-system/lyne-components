import { expect } from '@open-wc/testing';
import type { TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';

import { isSafari } from '../../core/dom/index.js';
import { describeIf } from '../../core/testing/index.js';
import { fixture, testA11yTreeSnapshot } from '../../core/testing/private/index.js';

import './autocomplete-grid-optgroup.js';
import '../autocomplete-grid/index.js';
import '../autocomplete-grid-row/index.js';
import '../autocomplete-grid-option/index.js';
import '../autocomplete-grid-actions/index.js';
import '../autocomplete-grid-button/index.js';
import type { SbbAutocompleteGridOptgroupElement } from './autocomplete-grid-optgroup.js';

describe('sbb-autocomplete-grid-optgroup', () => {
  let root: SbbAutocompleteGridOptgroupElement;
  const opt: TemplateResult = html`
    <sbb-autocomplete-grid-optgroup label="Group">
      <sbb-autocomplete-grid-row>
        <sbb-autocomplete-grid-option value="1">Option 1</sbb-autocomplete-grid-option>
      </sbb-autocomplete-grid-row>
      <sbb-autocomplete-grid-row>
        <sbb-autocomplete-grid-option value="2">Option 2</sbb-autocomplete-grid-option>
      </sbb-autocomplete-grid-row>
    </sbb-autocomplete-grid-optgroup>
  `;
  beforeEach(async () => {
    root = (
      await fixture(html`
        <sbb-autocomplete-grid origin="anchor"> ${opt} </sbb-autocomplete-grid>
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

    testA11yTreeSnapshot(opt);
  });

  describeIf(isSafari(), 'Safari', async () => {
    it('Dom', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('ShadowDom', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot(opt);
  });
});
