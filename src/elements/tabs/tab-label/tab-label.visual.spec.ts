import { html } from 'lit';

import {
  describeEach,
  describeViewports,
  visualDiffDefault,
  visualDiffStandardStates,
} from '../../core/testing/private.js';

import '../tab-group.js';
import '../tab-label.js';
import '../tab.js';

const cases = {
  amount: ['', 16],
  iconName: ['', 'app-icon-small'],
};

describe(`sbb-tab-label`, () => {
  describeViewports({ viewports: ['zero', 'medium'] }, () => {
    for (const state of visualDiffStandardStates) {
      it(
        state.name,
        state.with(async (setup) => {
          await setup.withFixture(html`<sbb-tab-label>Tab title</sbb-tab-label>`);
        }),
      );
    }

    describeEach(cases, ({ amount, iconName }) => {
      it(
        visualDiffDefault.name,
        visualDiffDefault.with(async (setup) => {
          await setup.withFixture(
            html`<sbb-tab-label amount=${amount} icon-name=${iconName}>Tab title</sbb-tab-label>`,
          );
        }),
      );
    });

    it(
      'with ellipsis',
      visualDiffDefault.with(async (setup) => {
        await setup.withFixture(
          html`<sbb-tab-label amount="16" icon-name="app-icon-small">
            A very long label which gets ellipsis when there is no more space to display it
          </sbb-tab-label>`,
        );
      }),
    );

    it(
      'disabled',
      visualDiffDefault.with(async (setup) => {
        await setup.withFixture(
          html` <sbb-tab-label amount="16" icon-name="app-icon-small" disabled
            >Tab title</sbb-tab-label
          >`,
        );
      }),
    );
  });
});
