import { expect } from '@open-wc/testing';
import type { TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';

import { isSafari } from '../../core/dom';
import { describeIf } from '../../core/testing';
import { fixture, testA11yTreeSnapshot } from '../../core/testing/private';

import type { SbbAutocompleteGridElement } from './autocomplete-grid';
import './autocomplete-grid';
import '../autocomplete-grid-row';
import '../autocomplete-grid-option';
import '../autocomplete-grid-actions';
import '../autocomplete-grid-button';

describe('sbb-autocomplete-grid', () => {
  let root: SbbAutocompleteGridElement;
  const grid: TemplateResult = html`
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
  `;

  beforeEach(async () => {
    root = await fixture(grid);
  });

  describeIf(!isSafari(), 'Chrome-Firefox', async () => {
    it('Dom', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('ShadowDom', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot(grid);
  });

  describeIf(isSafari(), 'Safari', async () => {
    it('Dom', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });

    it('ShadowDom', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });

    testA11yTreeSnapshot(grid);
  });
});
