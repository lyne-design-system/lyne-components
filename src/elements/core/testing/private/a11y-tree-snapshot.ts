import { aTimeout, expect, fixture, fixtureCleanup } from '@open-wc/testing';
import { a11ySnapshot } from '@web/test-runner-commands';
import type { TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';

import { isChromium, isFirefox } from '../../dom.js';
import { testIf } from '../mocha-extensions.js';
import { waitForLitRender } from '../wait-for-render.js';

/**
 * Get the a11y tree snapshot and tests its snapshot.
 * Since the snapshot is list of nodes, we have to stringify it
 * and create an html wrapper in order to use the `equalSnapshot` function.
 */
async function a11yTreeEqualSnapshot(): Promise<void> {
  await aTimeout(500);
  const snapshot = await a11ySnapshot({});

  const htmlWrapper = await fixture(html`<p>${JSON.stringify(snapshot, null, 2)}</p>`);
  await expect(htmlWrapper).to.be.equalSnapshot();
  fixtureCleanup();
}

/**
 * The function creates and tests the accessibility tree snapshot on each browser.
 * If a template is passed, it will be instantiated before the snapshot is taken.
 * Note:
 * We skip a11yTreeSnapshots in debug environment because they're not consistent on Puppeteer
 * @param title The title of the section
 * @param template The optional html template
 */
export function testA11yTreeSnapshot(
  template?: TemplateResult,
  title = 'A11y tree',
  exclude: { chrome?: boolean; firefox?: boolean; safari?: boolean } = {},
): void {
  describe(title, () => {
    beforeEach(async () => {
      if (template) {
        await fixture(template);
      }
      await waitForLitRender(document);
    });

    testIf(isChromium && !exclude.chrome, 'Chrome', async () => {
      await a11yTreeEqualSnapshot();
    });

    // TODO: Try if tests on CI are no longer flaky
    // testIf(isSafari && !exclude.safari, 'Safari', async () => {
    //   await a11yTreeEqualSnapshot();
    // });

    testIf(isFirefox && !exclude.firefox, 'Firefox', async () => {
      await a11yTreeEqualSnapshot();
    });
  });
}
