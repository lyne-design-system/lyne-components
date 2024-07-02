import { html, nothing, type TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

import { describeEach, describeViewports, visualDiffDefault } from '../core/testing/private.js';

import '../link/link.js';
import './notification.js';

describe(`sbb-notification`, () => {
  const defaultArgs = {
    type: 'info',
    size: 'm',
    readonly: false,
    title: true,
    slotted: false,
  };

  const notificationTemplate = ({
    type,
    size,
    readonly,
    title,
    slotted,
  }: typeof defaultArgs): TemplateResult => html`
    <sbb-notification
      title-content=${title && !slotted ? 'Title' : nothing}
      size=${size}
      ?readonly=${readonly}
      type=${type}
      style="--sbb-notification-margin: 0 0 var(--sbb-spacing-fixed-4x) 0;"
    >
      ${title && slotted ? html`<span slot="title">Slotted title</span>` : nothing} The quick brown
      fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.&nbsp;
      <sbb-link href="/">Link one</sbb-link>
      <sbb-link href="/">Link two</sbb-link>
      <sbb-link href="/">Link three</sbb-link>
    </sbb-notification>
    <p style="margin: 0;">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. <sbb-link href="/"> Link </sbb-link>
    </p>
  `;

  const states = {
    readonly: [false, true],
    slottedTitle: [false, true],
  };

  const types = ['info', 'success', 'warn', 'error'];
  const visualStates = {
    state: [...types.map((type) => ({ type, multiple: false })), { multiple: true, type: 'all' }],
    size: ['s', 'm'],
  };

  describeViewports({ viewports: ['zero', 'small'] }, () => {
    describeEach(states, ({ readonly, slottedTitle }) => {
      it(
        visualDiffDefault.name,
        visualDiffDefault.with(async (setup) => {
          const args = { ...defaultArgs, readonly, title: slottedTitle, slotted: slottedTitle };
          await setup.withFixture(html`${notificationTemplate(args)}`);
        }),
      );
    });

    describeEach(visualStates, ({ state, size }) => {
      it(
        visualDiffDefault.name,
        visualDiffDefault.with(async (setup) => {
          await setup.withFixture(html`
            ${repeat(
              state.multiple ? types : [state.type],
              (type: string) => html`${notificationTemplate({ ...defaultArgs, type, size })}`,
            )}
          `);
        }),
      );
    });
  });
});
