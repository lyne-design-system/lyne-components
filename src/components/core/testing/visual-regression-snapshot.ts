import { fixture } from '@open-wc/testing';
import {
  SbbBreakpointZeroMax,
  SbbBreakpointMicroMax,
  SbbBreakpointSmallMax,
  SbbBreakpointMediumMax,
  SbbBreakpointLargeMax,
  SbbBreakpointWideMax,
  SbbBreakpointUltraMax,
} from '@sbb-esta/lyne-design-tokens';
import { setViewport } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import { html, type TemplateResult } from 'lit';

const viewportSizes = {
  zero: SbbBreakpointZeroMax,
  micro: SbbBreakpointMicroMax,
  small: SbbBreakpointSmallMax,
  medium: SbbBreakpointMediumMax,
  large: SbbBreakpointLargeMax,
  wide: SbbBreakpointWideMax,
  ultra: SbbBreakpointUltraMax,
};

export function testVisualRegressionSnapshot(suite: Record<string, TemplateResult>): void {
  describe('visual regression', () => {
    for (const [viewport, size] of Object.entries(viewportSizes)) {
      describe(viewport, () => {
        before(async () => {
          await setViewport({ width: size, height: 400 });
        });

        for (const [name, template] of Object.entries(suite)) {
          it(name, async function () {
            this.timeout(10000);
            const root = await fixture(html`<div style="padding: 0.5rem;">${template}</div>`);
            await visualDiff(root, `${name}-${viewport}`);
          });
        }
      });
    }
  });
}
