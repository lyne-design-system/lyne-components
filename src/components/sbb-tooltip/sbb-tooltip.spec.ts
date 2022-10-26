import { SbbTooltip } from './sbb-tooltip';
import { newSpecPage } from '@stencil/core/testing';

describe('sbb-tooltip', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SbbTooltip],
      html: '<sbb-tooltip />',
    });

    expect(root).toEqualHtml(`
        <sbb-tooltip>
          <mock:shadow-root>
          <dialog class="sbb-tooltip sbb-tooltip--below">
            <div class="sbb-tooltip__content">
              <span>
                <slot>
                  No content
                </slot>
              </span>
              <span class="sbb-tooltip__dismiss">
                <sbb-button accessibility-label="Close" iconname="cross-small" size="m" type="button" variant="secondary"></sbb-button>
              </span>
            </div>
          </dialog>
          </mock:shadow-root>
        </sbb-tooltip>
      `);
  });
});
