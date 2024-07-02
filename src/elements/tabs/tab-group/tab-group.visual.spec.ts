import { html, nothing } from 'lit';

import {
  describeEach,
  describeViewports,
  visualDiffDefault,
  visualDiffFocus,
} from '../../core/testing/private.js';

import '../tab-group.js';
import '../tab-label.js';
import '../tab.js';
import '../../icon.js';

const cases = {
  size: ['s', 'l', 'xl'],
  numbersAndIcons: [false, true],
};

describe(`sbb-tab-group`, () => {
  describeViewports({ viewports: ['zero', 'medium'] }, () => {
    describeEach(cases, ({ size, numbersAndIcons }) => {
      it(
        visualDiffDefault.name,
        visualDiffDefault.with(async (setup) => {
          await setup.withFixture(html`
            <sbb-tab-group size=${size} initial-selected-index="0">
              <sbb-tab-label
                amount=${numbersAndIcons ? 16 : nothing}
                icon-name=${numbersAndIcons ? 'app-icon-small' : nothing}
              >
                Tab title one
              </sbb-tab-label>
              <sbb-tab>
                <article>
                  Diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean
                  euismod elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl
                  rhoncus mattis rhoncus urna neque viverra justo nec ultrices dui sapien eget mi
                  proin sed libero enim sed faucibus turpis in eu mi bibendum neque egestas congue.
                </article>
              </sbb-tab>

              <sbb-tab-label
                amount=${numbersAndIcons ? 16 : nothing}
                icon-name=${numbersAndIcons ? 'swisspass-small' : nothing}
              >
                Tab title two
              </sbb-tab-label>

              <sbb-tab-label
                disabled
                amount=${numbersAndIcons ? 16 : nothing}
                icon-name=${numbersAndIcons ? 'train-small' : nothing}
              >
                Tab title three
              </sbb-tab-label>
              <sbb-tab-label
                amount=${numbersAndIcons ? 16 : nothing}
                icon-name=${numbersAndIcons ? 'pie-small' : nothing}
              >
                Tab title four
              </sbb-tab-label>
            </sbb-tab-group>
          `);
        }),
      );
    });

    it(
      visualDiffFocus.name,
      visualDiffFocus.with(async (setup) => {
        await setup.withFixture(html`
          <sbb-tab-group initial-selected-index="0">
            <sbb-tab-label amount="16" icon-name="app-icon-small"> Tab title one </sbb-tab-label>
            <sbb-tab>
              <article>
                Diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean
                euismod elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl
                rhoncus mattis rhoncus urna neque viverra justo nec ultrices dui sapien eget mi
                proin sed libero enim sed faucibus turpis in eu mi bibendum neque egestas congue.
              </article>
            </sbb-tab>

            <sbb-tab-label amount="16" icon-name="swisspass-small"> Tab title two </sbb-tab-label>

            <sbb-tab-label disabled amount="16" icon-name="train-small">
              Tab title three
            </sbb-tab-label>
            <sbb-tab-label amount="16" icon-name="pie-small"> Tab title four </sbb-tab-label>
          </sbb-tab-group>
        `);
      }),
    );
  });
});
