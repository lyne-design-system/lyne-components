import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import { waitForLitRender } from '../../core/testing';
import { testA11yTreeSnapshot } from '../../core/testing/a11y-tree-snapshot';

import type { SbbDialogElement } from './dialog';
import './dialog';
import '../dialog-title';
import '../dialog-content';

describe('sbb-dialog', () => {
  describe('renders an open dialog', async () => {
    let root: SbbDialogElement;
    beforeEach(async () => {
      root = await fixture(
        html` <sbb-dialog disable-animation>
          <sbb-dialog-title>Title</sbb-dialog-title>
          <sbb-dialog-content>Content</sbb-dialog-content>
        </sbb-dialog>`,
      );
      root.open();
      await waitForLitRender(root);
    });
    it('Dom', async () => {
      await expect(root).dom.to.be.equalSnapshot();
    });
    it('ShadowDom', async () => {
      await expect(root).shadowDom.to.be.equalSnapshot();
    });
    testA11yTreeSnapshot();
  });
});
