import { getSvgContent } from '../../icon.js';
import { sbbInputModalityDetector } from '../a11y.js';
import type { SbbIconConfig } from '../config.js';
import { mergeConfig } from '../config.js';

import { isHydratedSsr, isVisualRegressionRun } from './private.js';

if (isVisualRegressionRun) {
  const preloadedIcons = [
    'add-stop',
    'alternative',
    'app-icon-medium',
    'app-icon-small',
    'arrow-long-right-small',
    'arrow-right-small',
    'arrows-circle-small',
    'arrows-right-left-small',
    'backpack-medium',
    'battery-level-empty-small',
    'battery-level-high-small',
    'bicycle-medium',
    'calendar-small',
    'cancellation',
    'chevron-small-down-medium',
    'chevron-small-down-small',
    'chevron-small-left-small',
    'chevron-small-right-small',
    'chevron-small-up-small',
    'circle-cross-small',
    'circle-information-large',
    'circle-information-medium',
    'circle-information-small',
    'circle-minus-small',
    'circle-plus-medium',
    'circle-plus-small',
    'circle-tick-small',
    'clock-small',
    'coins-small',
    'construction',
    'container-small',
    'context-menu-small',
    'cross-small',
    'delay',
    'diamond-small',
    'disruption',
    'dog-medium',
    'dog-small',
    'exclamation-point-small',
    'exit-small',
    'eye-small',
    'face-smiling-small',
    'folder-open-medium',
    'folder-open-small',
    'globe-small',
    'hamburger-menu-small',
    'heart-medium',
    'house-small',
    'info',
    'link-small',
    'location-pin-map-small',
    'magnifying-glass-small',
    'minus-small',
    'missed-connection',
    'pen-medium',
    'pen-small',
    'pie-medium',
    'pie-small',
    'platform-change',
    'plus-medium',
    'plus-small',
    'qrcode-small',
    'replacementbus',
    'reroute',
    'sa-abteilkinderwagen',
    'sa-b',
    'sa-bz',
    'sa-ci',
    'sa-fz',
    'sa-nf',
    'sa-r',
    'sa-rr',
    'sa-rs',
    'sa-wr',
    'shopping-cart-small',
    'swisspass-medium',
    'swisspass-small',
    'tick-small',
    'ticket-route-medium',
    'tickets-class-small',
    'train-medium',
    'train-small',
    'trash-small',
    'travel-backpack-medium',
    'user-small',
    'utilization-high',
    'utilization-low',
    'utilization-medium',
    'utilization-none',
    'walk-fast-small',
    'walk-slow-small',
    'walk-small',
  ];
  await Promise.all(preloadedIcons.map((icon) => getSvgContent('default', icon, true)));

  mergeConfig({
    icon: {
      interceptor({ namespace, name }) {
        throw new Error(`Icon ${namespace}:${name} must be preloaded in test-setup.ts!`);
      },
    },
  });
} else {
  // Setup mock configuration for icons
  const testNamespaces = ['default', 'picto'];
  const icon: SbbIconConfig = {
    interceptor: ({ namespace, name, request }) => {
      if (testNamespaces.includes(namespace)) {
        const dimension = name.endsWith('-large') ? 48 : name.endsWith('-medium') ? 36 : 24;
        return Promise.resolve(
          `<svg-fake
    data-name="${name}"
    height="${dimension}"
    style="width:${dimension}px;height:${dimension}px"
    width="${dimension}"
  >
  </svg-fake>`,
        );
      }
      return request();
    },
  };

  mergeConfig({ icon });
}

if (isHydratedSsr) {
  await import('@lit-labs/ssr-client/lit-element-hydrate-support.js');
}

function globalTestingSetup(): void {
  beforeEach(() => {
    sbbInputModalityDetector.reset();
  });

  afterEach(async () => {
    const fixtures = await import('@lit-labs/testing/fixtures.js');
    fixtures.cleanupFixtures();
  });
}

if (document.readyState === 'loading') {
  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', globalTestingSetup);
} else {
  setTimeout(globalTestingSetup);
}
