import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('sbb-expansion-panel', () => {
  let element: E2EElement, page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`
      <sbb-expansion-panel>
        <sbb-expansion-panel-header icon-name='dog-medium'>Header</sbb-expansion-panel-header>
        <sbb-expansion-panel-content>Content</sbb-expansion-panel-content>
      </sbb-expansion-panel>
    `);

    element = await page.find('sbb-expansion-panel');
  });

  it('renders', async () => {
    expect(element).toHaveClass('hydrated');
  });

  it('has slotted elements with the correct properties', async () => {
    const header = await page.find('sbb-expansion-panel-header');
    expect(header).toEqualAttribute('id', 'sbb-expansion-panel-header-1');
    expect(header).toEqualAttribute('aria-controls', 'sbb-expansion-panel-content-1');
    const content = await page.find('sbb-expansion-panel-content');
    expect(content).toEqualAttribute('id', 'sbb-expansion-panel-content-1');
    expect(content).toEqualAttribute('data-icon-space', '');
    expect(content).toEqualAttribute('aria-labelledby', `sbb-expansion-panel-header-1`);
  });

  it('has slotted elements with the correct properties when id are set', async () => {
    page = await newE2EPage();
    await page.setContent(`
      <sbb-expansion-panel>
        <sbb-expansion-panel-header id='header'>Header</sbb-expansion-panel-header>
        <sbb-expansion-panel-content id='content'>Content</sbb-expansion-panel-content>
      </sbb-expansion-panel>
    `);

    const header = await page.find('sbb-expansion-panel-header');
    expect(header).toEqualAttribute('aria-controls', 'content');
    const content = await page.find('sbb-expansion-panel-content');
    expect(content).toEqualAttribute('aria-labelledby', `header`);
  });
});