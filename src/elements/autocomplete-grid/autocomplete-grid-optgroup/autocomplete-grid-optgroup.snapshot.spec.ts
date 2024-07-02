import { expect } from '@open-wc/testing';
import type { TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';

import { isSafari } from '../../core/dom.js';
import { fixture, testA11yTreeSnapshot } from '../../core/testing/private.js';
import { describeIf } from '../../core/testing.js';

import './autocomplete-grid-optgroup.js';
import '../autocomplete-grid.js';
import '../autocomplete-grid-row.js';
import '../autocomplete-grid-option.js';
import '../autocomplete-grid-cell.js';
import '../autocomplete-grid-button.js';
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

  describeIf(!isSafari, 'Chrome-Firefox', async () => {
    it('DOM', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot(opt);
  });

  describeIf(isSafari, 'Safari', async () => {
    it('DOM', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('Shadow DOM', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot(opt);
  });
});
