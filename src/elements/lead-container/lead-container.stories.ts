import type { Meta, StoryObj } from '@storybook/web-components';
import { html, type TemplateResult } from 'lit';

import '../alert.js';
import '../breadcrumb.js';
import '../image.js';
import '../link/block-link/block-link.js';
import '../title.js';
import './lead-container.js';

import images from '../core/images.js';

import readme from './readme.md?raw';

const DefaultTemplate = (): TemplateResult => html`
  <sbb-lead-container>
    <style>
      p.other-content {
        margin-block-end: 0;
      }
    </style>
    <sbb-image
      slot="image"
      image-src=${images[6]}
      alt="Station of Lucerne from outside"
    ></sbb-image>
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
      <sbb-breadcrumb href="#" id="breadcrumb-1">Level 2</sbb-breadcrumb>
      <sbb-breadcrumb href="#" id="breadcrumb-1">Level 3</sbb-breadcrumb>
      <sbb-breadcrumb href="#" id="breadcrumb-1">Level 4</sbb-breadcrumb>
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
      Lead text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer enim elit,
      ultricies in tincidunt quis, mattis eu quam. Nulla sit amet lorem fermentum, molestie nunc ut,
      hendrerit risus.
    </p>
    <p class="sbb-text-m other-content">
      Other content. Vestibulum rutrum elit et lacus sollicitudin, quis malesuada lorem vehicula.
      Suspendisse at augue quis tellus vulputate tempor. Vivamus urna velit, varius nec est ac,
      mollis efficitur lorem. Quisque non nisl eget massa interdum tempus. Praesent vel feugiat
      metus.
    </p>
  </sbb-lead-container>
`;

export const Default: StoryObj = {
  render: DefaultTemplate,
};

const meta: Meta = {
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
    layout: 'fullscreen',
  },
  title: 'elements/sbb-lead-container',
};

export default meta;
