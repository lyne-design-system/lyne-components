import { html } from 'lit';

import {
  describeViewports,
  visualDiffDefault,
  visualDiffFocus,
  visualDiffHover,
} from '../../core/testing/private.js';

import './navigation-link.js';

describe(`sbb-navigation-link`, () => {
  const sizeCases = ['s', 'm', 'l'];

  describeViewports({ viewports: ['zero', 'medium'] }, () => {
    for (const state of [visualDiffDefault, visualDiffHover, visualDiffFocus]) {
      it(
        state.name,
        state.with(async (setup) => {
          await setup.withFixture(
            html` <sbb-navigation-link href="#">Label</sbb-navigation-link> `,
            { backgroundColor: 'var(--sbb-color-midnight)', focusOutlineDark: true },
          );
        }),
      );
    }

    for (const size of sizeCases) {
      it(
        `size=${size}`,
        visualDiffDefault.with(async (setup) => {
          await setup.withFixture(
            html` <sbb-navigation-link href="#" size=${size}>Label</sbb-navigation-link> `,
            { backgroundColor: 'var(--sbb-color-midnight)', focusOutlineDark: true },
          );
        }),
      );
    }
  });
});
