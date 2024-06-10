import { html } from 'lit';

import {
  describeEach,
  describeViewports,
  visualDiffStandardStates,
  visualRegressionFixture,
  visualDiffDefault,
  visualDiffHover,
} from '../../core/testing/private.js';

import './button.js';

describe(`sbb-button`, () => {
  let root: HTMLElement;

  const cases = {
    disabled: [false, true],
    negative: [false, true],
    state: [
      { icon: undefined, text: 'Button' },
      { icon: 'arrow-right-small', text: 'Button' },
      { icon: 'arrow-right-small', text: '' },
    ],
  };

  // 'l' as default is covered by other cases.
  const sizeCases = { size: ['s', 'm'], icon: [undefined, 'arrow-right-small'] };

  describeViewports({ viewports: ['zero', 'medium'] }, () => {
    describeEach(cases, ({ disabled, negative, state }) => {
      beforeEach(async function () {
        root = await visualRegressionFixture(
          html`
            <sbb-button ?disabled=${disabled} ?negative=${negative} .iconName=${state.icon}>
              ${state.text}
            </sbb-button>
          `,
          {
            backgroundColor: negative ? '#484040' : undefined,
            focusOutlineDark: negative,
          },
        );
      });

      for (const state of visualDiffStandardStates) {
        it(
          state.name,
          state.with((setup) => {
            setup.withSnapshotElement(root);
          }),
        );
      }
    });

    describeEach(sizeCases, ({ size, icon }) => {
      it(
        visualDiffDefault.name,
        visualDiffDefault.with(async (setup) => {
          await setup.withFixture(
            html`<sbb-button size=${size as 's' | 'm'} .iconName=${icon}>Button</sbb-button>`,
          );
        }),
      );
    });

    it(
      'with ellipsis',
      visualDiffDefault.with(async (setup) => {
        await setup.withFixture(html`
          <sbb-button style="width: 200px;" icon-name="arrow-right-small">
            Button with long text
          </sbb-button>
        `);
      }),
    );

    it(
      'wide width',
      visualDiffDefault.with(async (setup) => {
        await setup.withFixture(html`
          <sbb-button style="max-width: 100%; width: 600px;" icon-name="arrow-right-small">
            Wide Button
          </sbb-button>
        `);
      }),
    );

    describe('slotted icon', () => {
      beforeEach(async function () {
        root = await visualRegressionFixture(html`
          <sbb-button>
            Button
            <sbb-icon slot="icon" name="chevron-small-right-small"></sbb-icon>
          </sbb-button>
        `);
      });

      it(
        visualDiffDefault.name,
        visualDiffDefault.with((setup) => {
          setup.withSnapshotElement(root);
        }),
      );

      it(
        visualDiffHover.name,
        visualDiffHover.with((setup) => {
          setup.withSnapshotElement(root);
        }),
      );
    });

    it(
      'with hidden slot',
      visualDiffDefault.with(async (setup) => {
        await setup.withFixture(html`
          <sbb-button>
            Button
            <sbb-icon
              slot="icon"
              name="chevron-small-right-small"
              style="display: none;"
            ></sbb-icon>
          </sbb-button>
        `);
      }),
    );
  });
});
