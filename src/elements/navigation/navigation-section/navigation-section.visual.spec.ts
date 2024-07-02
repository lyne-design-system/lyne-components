import { html, nothing, type TemplateResult } from 'lit';

import { describeViewports, visualDiffDefault } from '../../core/testing/private.js';

import './navigation-section.js';
import '../navigation.js';
import '../navigation-marker.js';
import '../navigation-list.js';
import '../navigation-button.js';
import '../navigation-link.js';

describe(`sbb-navigation-section`, () => {
  const navigationActions = (): TemplateResult => html`
    <sbb-navigation-button>Button 1</sbb-navigation-button>
    <sbb-navigation-button class="sbb-active" id="nav-2">Button 2</sbb-navigation-button>
    <sbb-navigation-link href="#"> Link 3 </sbb-navigation-link>
  `;

  const navigationList = (slottedLabel?: boolean): TemplateResult => html`
    <sbb-navigation-list label=${!slottedLabel ? 'Label' : nothing}>
      ${slottedLabel ? html`<span slot="label">Slotted label</span>` : nothing}

      <sbb-navigation-button>Button</sbb-navigation-button>
      <sbb-navigation-button>Button</sbb-navigation-button>
      <sbb-navigation-link href="#">Link</sbb-navigation-link>
    </sbb-navigation-list>
  `;

  describeViewports({ viewportHeight: 600 }, () => {
    it(
      visualDiffDefault.name,
      visualDiffDefault.with(async (setup) => {
        await setup.withFixture(
          html`
            <sbb-navigation>
              <sbb-navigation-marker id="nav-marker">${navigationActions()}</sbb-navigation-marker>

              <sbb-navigation-section trigger="nav-2" title-content="Title two">
                ${navigationList(true)} ${navigationList(true)} ${navigationList()}
                ${navigationList()} ${navigationList()} ${navigationList()}
              </sbb-navigation-section>
            </sbb-navigation>
          `,
          { padding: '0' },
        );
        const navigation = setup.snapshotElement.querySelector('sbb-navigation')!;
        setup.withSnapshotElement(navigation);
        setup.withPostSetupAction(() => navigation.open());
      }),
    );
  });
});
