import { html, type TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

import type { VisualDiffSetupBuilder } from '../core/testing/private.js';
import { describeViewports, visualDiffDefault } from '../core/testing/private.js';

import './overlay.js';
import type { SbbOverlayElement } from './overlay.js';

describe(`sbb-overlay`, () => {
  const defaultArgs = {
    expanded: false,
    backButton: false,
    negative: false,
    numberOfBlocks: 1,
  };

  const template = ({
    expanded,
    backButton,
    negative,
    numberOfBlocks,
  }: typeof defaultArgs): TemplateResult => html`
    <sbb-overlay ?negative=${negative} ?expanded=${expanded} ?back-button=${backButton}>
      ${repeat(
        new Array(numberOfBlocks),
        () => html`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum. <br />
        `,
      )}
    </sbb-overlay>
  `;

  const openOverlay = (setup: VisualDiffSetupBuilder): void => {
    const overlay: SbbOverlayElement = setup.snapshotElement.querySelector('sbb-overlay')!;
    setup.withSnapshotElement(overlay);
    setup.withPostSetupAction(() => overlay.open());
  };

  describeViewports({ viewportHeight: 600 }, () => {
    for (const negative of [false, true]) {
      it(
        `negative=${negative}`,
        visualDiffDefault.with(async (setup) => {
          await setup.withFixture(template({ ...defaultArgs, negative }));
          openOverlay(setup);
        }),
      );

      it(
        `negative=${negative} backButton`,
        visualDiffDefault.with(async (setup) => {
          await setup.withFixture(template({ ...defaultArgs, negative, backButton: true }));
          openOverlay(setup);
        }),
      );

      it(
        `negative=${negative} expanded`,
        visualDiffDefault.with(async (setup) => {
          await setup.withFixture(template({ ...defaultArgs, negative, expanded: true }));
          openOverlay(setup);
        }),
      );

      it(
        `negative=${negative} long content`,
        visualDiffDefault.with(async (setup) => {
          await setup.withFixture(template({ ...defaultArgs, negative, numberOfBlocks: 7 }));
          openOverlay(setup);
        }),
      );
    }
  });
});
