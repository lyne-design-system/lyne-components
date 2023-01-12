import { SbbToggleCheck } from './sbb-toggle-check';
import { newSpecPage } from '@stencil/core/testing';

describe('sbb-toggle-check', () => {
  it('renders sbb-toggle-check', async () => {
    const { root } = await newSpecPage({
      components: [SbbToggleCheck],
      html: '<sbb-toggle-check></sbb-toggle-check>',
    });

    expect(root).toEqualHtml(`
        <sbb-toggle-check label-position="after">
          <mock:shadow-root>
            <input type="checkbox" id="sbb-toggle-check-input"/>
            <label class="sbb-toggle-check" htmlfor="sbb-toggle-check-input">
              <span class="sbb-toggle-check__container">
                <span class="sbb-toggle-check__label" hidden="">
                  <slot></slot>
                </span>
                <span class="sbb-toggle-check__slider">
                  <span class="sbb-toggle-check__circle">
                    <span class="sbb-toggle-check__icon">
                      <slot name="icon">
                        <sbb-icon name="tick-small"></sbb-icon>
                      </slot>
                    </span>
                  </span>
                </span>
              </span>
            </label>
          </mock:shadow-root>
        </sbb-toggle-check>
      `);
  });

  describe('label position', () => {
    it('renders label before toggle', async () => {
      const { root } = await newSpecPage({
        components: [SbbToggleCheck],
        html: `
          <sbb-toggle-check label-position="before">Check it</sbb-toggle-check>
        `,
      });

      expect(root).toEqualHtml(`
        <sbb-toggle-check label-position="before">
          <mock:shadow-root>
            <input type="checkbox" id="sbb-toggle-check-input"/>
            <label class="sbb-toggle-check" htmlfor="sbb-toggle-check-input">
              <span class="sbb-toggle-check__container">
                <span class="sbb-toggle-check__label">
                  <slot></slot>
                </span>
                <span class="sbb-toggle-check__slider">
                <span class="sbb-toggle-check__circle">
                  <span class="sbb-toggle-check__icon">
                    <slot name="icon">
                      <sbb-icon name="tick-small"></sbb-icon>
                    </slot>
                  </span>
                </span>
              </span>
            </label>
          </mock:shadow-root>
          Check it
        </sbb-toggle-check>
      `);
    });
  });

  describe('states', () => {
    describe('checked state', () => {
      it('renders toggle in checked state', async () => {
        const { root } = await newSpecPage({
          components: [SbbToggleCheck],
          html: '<sbb-toggle-check checked></sbb-toggle-check>',
        });

        expect(root).toEqualHtml(`
          <sbb-toggle-check checked label-position="after">
            <mock:shadow-root>
              <input checked="" type="checkbox" id="sbb-toggle-check-input"/>
              <label class="sbb-toggle-check" htmlfor="sbb-toggle-check-input">
                <span class="sbb-toggle-check__container">
                  <span class="sbb-toggle-check__label" hidden="">
                    <slot></slot>
                  </span>
                  <span class="sbb-toggle-check__slider">
                    <span class="sbb-toggle-check__circle">
                      <span class="sbb-toggle-check__icon">
                        <slot name="icon">
                          <sbb-icon name="tick-small"></sbb-icon>
                        </slot>
                      </span>
                    </span>
                  </span>
                </span>
              </label>
            </mock:shadow-root>
          </sbb-toggle-check>
        `);
      });
    });

    describe('disabled state', () => {
      it('renders toggle in disabled state', async () => {
        const { root } = await newSpecPage({
          components: [SbbToggleCheck],
          html: '<sbb-toggle-check disabled></sbb-toggle-check>',
        });

        expect(root).toEqualHtml(`
          <sbb-toggle-check disabled label-position="after">
            <mock:shadow-root>
              <input disabled="" aria-disabled="" type="checkbox" id="sbb-toggle-check-input">
              <label class="sbb-toggle-check" htmlfor="sbb-toggle-check-input">
                <span class="sbb-toggle-check__container">
                  <span class="sbb-toggle-check__label" hidden="">
                    <slot></slot>
                  </span>
                  <span class="sbb-toggle-check__slider">
                    <span class="sbb-toggle-check__circle">
                      <span class="sbb-toggle-check__icon">
                        <slot name="icon">
                          <sbb-icon name="tick-small"></sbb-icon>
                        </slot>
                      </span>
                    </span>
                  </span>
                </span>
              </label>
            </mock:shadow-root>
          </sbb-toggle-check>
        `);
      });
    });

    describe('disabled and checked state', () => {
      it('renders toggle in disabled and checked state', async () => {
        const { root } = await newSpecPage({
          components: [SbbToggleCheck],
          html: '<sbb-toggle-check checked disabled></sbb-toggle-check>',
        });

        expect(root).toEqualHtml(`
          <sbb-toggle-check checked disabled label-position="after">
            <mock:shadow-root>
              <input checked="" type="checkbox" disabled aria-disabled="" id="sbb-toggle-check-input"/>
              <label class="sbb-toggle-check" htmlfor="sbb-toggle-check-input">
                <span class="sbb-toggle-check__container">
                  <span class="sbb-toggle-check__label" hidden="">
                    <slot></slot>
                  </span>
                  <span class="sbb-toggle-check__slider">
                    <span class="sbb-toggle-check__circle">
                      <span class="sbb-toggle-check__icon">
                        <slot name="icon">
                          <sbb-icon name="tick-small"></sbb-icon>
                        </slot>
                      </span>
                    </span>
                  </span>
                </span>
              </label>
            </mock:shadow-root>
          </sbb-toggle-check>
        `);
      });
    });
  });
});
