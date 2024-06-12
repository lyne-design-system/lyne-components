import { html } from 'lit/static-html.js';

import sampleImages from '../core/images.js';
import { describeViewports, visualDiffDefault } from '../core/testing/private.js';
import { waitForImageReady } from '../core/testing.js';

import './image.js';

const imageUrl = import.meta.resolve('../core/testing/assets/lucerne.png');

const aspectRatios = [
  'free',
  '1-1',
  '1-2',
  '2-1',
  '2-3',
  '3-2',
  '3-4',
  '4-3',
  '4-5',
  '5-4',
  '9-16',
  '16-9',
];

describe(`sbb-image`, () => {
  describeViewports({ viewports: ['zero', 'medium'] }, () => {
    for (const aspectRatio of aspectRatios) {
      it(
        `aspect-ratio=${aspectRatio}`,
        visualDiffDefault.with(async (setup) => {
          await setup.withFixture(
            html`<sbb-image image-src=${imageUrl} aspect-ratio=${aspectRatio}></sbb-image>`,
          );

          await waitForImageReady(setup.snapshotElement.querySelector('sbb-image')!);
        }),
      );
    }

    for (const borderRadius of ['none', 'round']) {
      it(
        `border-radius=${borderRadius}`,
        visualDiffDefault.with(async (setup) => {
          await setup.withFixture(
            html`<sbb-image
              image-src=${imageUrl}
              border-radius=${borderRadius}
              aspect-ratio="1-1"
            ></sbb-image>`,
          );

          await waitForImageReady(setup.snapshotElement.querySelector('sbb-image')!);
        }),
      );
    }

    it(
      'with caption',
      visualDiffDefault.with(async (setup) => {
        await setup.withFixture(
          html`<sbb-image
            image-src=${imageUrl}
            alt="Station of Lucerne from outside"
            caption=${`A long text which takes several lines and contains a link <a href="https://www.sbb.ch/abos-billette/abonnemente/gleis-7-freie-fahrt-ab-19-uhr.html#jahrg_nger_halbtax">Gleis 7</a>. After the link there is more text.`}
          ></sbb-image>`,
        );

        await waitForImageReady(setup.snapshotElement.querySelector('sbb-image')!);
      }),
    );

    it(
      'transparent image from img cdn',
      visualDiffDefault.with(async (setup) => {
        await setup.withFixture(html`<sbb-image image-src=${sampleImages[9]}></sbb-image>`);

        await waitForImageReady(setup.snapshotElement.querySelector('sbb-image')!);
      }),
    );
  });
});