import type { TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';

import {
  describeViewports,
  loadAssetAsBase64,
  visualDiffDefault,
} from '../core/testing/private.js';
import { waitForImageReady } from '../core/testing.js';

import '../alert.js';
import '../breadcrumb.js';
import '../image.js';
import '../link/block-link/block-link.js';
import '../title.js';
import './lead-container.js';

const leadImageUrl = import.meta.resolve('./assets/lucerne.png');
const leadImageBase64 = await loadAssetAsBase64(leadImageUrl);

describe(`sbb-lead-container`, () => {
  const wrapperStyles = { backgroundColor: `var(--sbb-color-milk)`, padding: '0' };

  const leadContainerTemplate = (image: TemplateResult): TemplateResult => html`
    <sbb-lead-container>
      <style>
        p.other-content {
          margin-block-end: 0;
        }
      </style>
      ${image}
      <sbb-alert-group class="sbb-lead-container-spacing">
        <sbb-alert
          title-content="Interruption between Genève and Lausanne"
          href="https://www.sbb.ch"
          size="m"
        >
          The rail traffic between Allaman and Morges is interrupted. All trains are cancelled.
        </sbb-alert>
      </sbb-alert-group>
      <sbb-breadcrumb-group class="sbb-lead-container-spacing">
        <sbb-breadcrumb href="#" icon-name="house-small" id="breadcrumb-0"></sbb-breadcrumb>
        <sbb-breadcrumb href="#" id="breadcrumb-1">Level 1</sbb-breadcrumb>
      </sbb-breadcrumb-group>
      <sbb-block-link
        icon-placement="start"
        icon-name="chevron-small-left-small"
        size="xs"
        href="https://www.sbb.ch"
        class="sbb-lead-container-spacing"
      >
        Link
      </sbb-block-link>
      <sbb-title class="sbb-lead-container-spacing">Title</sbb-title>
      <p class="sbb-text-xl sbb-lead-container-lead-text">
        Lead text. Lorem ipsum dolor sit amet, adipiscing elit. Integer enim elit, ultricies in
        tincidunt quis, mattis eu quam. Nulla sit amet lorem fermentum, molestie nunc ut, hendrerit
        risus.
      </p>
      <p class="sbb-text-m other-content">
        Other content. Vestibulum rutrum elit et lacus sollicitudin, quis malesuada lorem vehicula.
        Suspendisse at augue quis tellus vulputate tempor. Vivamus urna velit, varius nec est ac,
        mollis efficitur lorem. Quisque non nisl eget massa interdum tempus. Praesent vel feugiat
        metus.
      </p>
    </sbb-lead-container>
  `;

  describeViewports(() => {
    it(
      'with sbb-image',
      visualDiffDefault.with(async (setup) => {
        await setup.withFixture(
          leadContainerTemplate(
            html`<sbb-image
              slot="image"
              image-src=${leadImageUrl}
              alt="Station of Lucerne from outside"
            ></sbb-image>`,
          ),
          wrapperStyles,
        );

        await waitForImageReady(setup.snapshotElement.querySelector('sbb-image')!);
      }),
    );

    it(
      'with img tag',
      visualDiffDefault.with(async (setup) => {
        await setup.withFixture(
          leadContainerTemplate(
            html`<img slot="image" src=${leadImageBase64} alt="Station of Lucerne from outside" />`,
          ),
          wrapperStyles,
        );

        await waitForImageReady(setup.snapshotElement.querySelector('img')!);
      }),
    );
  });
});
