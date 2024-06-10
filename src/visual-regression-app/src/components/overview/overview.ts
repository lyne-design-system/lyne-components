import { LitElement, html, type TemplateResult, type CSSResultGroup, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';

import { screenshots } from '../../screenshots.js';

import style from './overview.scss?lit&inline';

import '@sbb-esta/lyne-elements/accordion.js';
import '@sbb-esta/lyne-elements/button/secondary-button-link.js';
import '@sbb-esta/lyne-elements/card.js';
import '@sbb-esta/lyne-elements/container.js';
import '@sbb-esta/lyne-elements/expansion-panel.js';
import '@sbb-esta/lyne-elements/link-list.js';
import '@sbb-esta/lyne-elements/link/block-link.js';
import '@sbb-esta/lyne-elements/title.js';

/**
 * Overview over all tests
 */
@customElement('app-overview')
export class Overview extends LitElement {
  public static override styles: CSSResultGroup = style;

  public override render(): TemplateResult {
    return html`
      <sbb-container expanded>
        <sbb-title level="3">
          Lyne visual regression comparison${screenshots.baselineOnly ? ' baseline' : nothing}
        </sbb-title>
        <div class="app-overview">
          <sbb-card color="milk">
            ${screenshots.stats}
            <sbb-secondary-button-link
              href="/compare/${screenshots.flatTestCases[0]?.path}"
              size="s"
            >
              ${!screenshots.baselineOnly ? `Start comparing` : `Check baselines`}
            </sbb-secondary-button-link>
          </sbb-card>
          <sbb-accordion>
            ${screenshots.components.map(
              (screenshotComponent) => html`
                <sbb-expansion-panel ?expanded=${screenshots!.components.length === 1}>
                  <sbb-expansion-panel-header>
                    ${screenshotComponent.name} (${screenshotComponent.stats})
                  </sbb-expansion-panel-header>
                  <sbb-expansion-panel-content>
                    <sbb-link-list>
                      ${screenshotComponent.testCases.map(
                        (entry) =>
                          html`<sbb-block-link href="/compare/${entry.path}">
                            ${entry.name}
                          </sbb-block-link>`,
                      )}
                    </sbb-link-list>
                  </sbb-expansion-panel-content>
                </sbb-expansion-panel>
              `,
            )}
          </sbb-accordion>
        </div>
      </sbb-container>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'app-overview': Overview;
  }
}
