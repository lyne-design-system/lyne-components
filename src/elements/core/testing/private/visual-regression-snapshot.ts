import { aTimeout } from '@open-wc/testing';
import { resetMouse, sendKeys, sendMouse, setViewport } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import type { TemplateResult } from 'lit';

import { visualRegressionFixture } from './fixture.js';
import { tabKey } from './keys.js';

export function imageName(test: Mocha.Runnable): string {
  return test!.fullTitle().replaceAll(', ', '-').replaceAll(' ', '_').replaceAll('.', '_');
}

export class VisualDiffSetupBuilder {
  private _snapshotElement?: HTMLElement;
  private _stateElement?: HTMLElement;
  private _postSetupAction?: () => void | Promise<void>;

  /** Returns the snapshot element. Usually the wrapper div around the sbb element. */
  public get snapshotElement(): HTMLElement {
    return (
      this._snapshotElement ??
      (document.getElementById('visual-regression-fixture-wrapper') as HTMLElement)
    );
  }

  /**
   * Returns the state element. This is usually the sbb element that should receive
   * focus, hover or active state.
   */
  public get stateElement(): HTMLElement {
    return (
      this._stateElement ??
      (this.snapshotElement.localName.startsWith('sbb-')
        ? this.snapshotElement
        : Array.from(this.snapshotElement.querySelectorAll('*')).find((e): e is HTMLElement =>
            e.localName.startsWith('sbb-'),
          )) ??
      this.snapshotElement
    );
  }

  /** Returns the center of the state element. */
  public get stateElementCenter(): [number, number] {
    const position = this.stateElement.getBoundingClientRect();
    return [
      Math.round(position.x + window.scrollX + position.width / 2),
      Math.round(position.y + window.scrollY + position.height / 2),
    ];
  }

  /**
   * Action executed after the fixture and the setViewPort
   */
  public get postSetupAction(): () => void | Promise<void> {
    return this._postSetupAction ? this._postSetupAction : () => {};
  }

  public withSnapshotElement(element: HTMLElement): this {
    this._snapshotElement = element;
    return this;
  }

  public withStateElement(element: HTMLElement): this {
    this._stateElement = element;
    return this;
  }

  public async withFixture(
    template: TemplateResult,
    wrapperStyles?: Parameters<typeof visualRegressionFixture>[1],
  ): Promise<this> {
    this._snapshotElement = await visualRegressionFixture(template, wrapperStyles);
    return this;
  }

  public withPostSetupAction(action: () => void | Promise<void>): this {
    this._postSetupAction = action;
    return this;
  }
}

const runSetupWithViewport = async (
  setup: (setup: VisualDiffSetupBuilder) => void | Promise<void>,
  viewport: { width: number; height: number } | undefined,
): Promise<VisualDiffSetupBuilder> => {
  const builder = new VisualDiffSetupBuilder();
  await setup(builder);
  if (viewport) {
    await setViewport(viewport);
  }
  await builder.postSetupAction();

  return builder;
};

export interface VisualDiffState {
  name: string;
  with: (setup: (setup: VisualDiffSetupBuilder) => void | Promise<void>) => Mocha.Func;
}

export const visualDiffDefault: VisualDiffState = {
  name: 'default',
  with(setup: (setup: VisualDiffSetupBuilder) => void | Promise<void>): Mocha.Func {
    return async function (this: Mocha.Context) {
      const builder = await runSetupWithViewport(setup, this.test?.ctx?.['requestViewport']);
      await visualDiff(builder.snapshotElement, imageName(this.test!));
    };
  },
};

export const visualDiffFocus: VisualDiffState = {
  name: 'focus',
  with(setup: (setup: VisualDiffSetupBuilder) => void | Promise<void>): Mocha.Func {
    return async function (this: Mocha.Context) {
      const builder = await runSetupWithViewport(setup, this.test?.ctx?.['requestViewport']);
      builder.snapshotElement.focus();
      await sendKeys({ press: tabKey });
      await visualDiff(builder.snapshotElement, imageName(this.test!));
    };
  },
};

export const visualDiffHover: VisualDiffState = {
  name: 'hover',
  with(setup: (setup: VisualDiffSetupBuilder) => void | Promise<void>): Mocha.Func {
    return async function (this: Mocha.Context) {
      const builder = await runSetupWithViewport(setup, this.test?.ctx?.['requestViewport']);
      try {
        await sendMouse({ type: 'move', position: builder.stateElementCenter });
        await aTimeout(5);
        await visualDiff(builder.snapshotElement, imageName(this.test!));
      } finally {
        await resetMouse();
      }
    };
  },
};

export const visualDiffActive: VisualDiffState = {
  name: 'active',
  with(setup: (setup: VisualDiffSetupBuilder) => void | Promise<void>): Mocha.Func {
    return async function (this: Mocha.Context) {
      const builder = await runSetupWithViewport(setup, this.test?.ctx?.['requestViewport']);
      try {
        await sendMouse({ type: 'move', position: builder.stateElementCenter });
        await sendMouse({ type: 'down' });
        await aTimeout(5);
        await visualDiff(builder.snapshotElement, imageName(this.test!));
      } finally {
        await resetMouse();
      }
    };
  },
};

export const visualDiffStandardStates = [
  visualDiffDefault,
  visualDiffFocus,
  visualDiffHover,
  visualDiffActive,
] as const;
