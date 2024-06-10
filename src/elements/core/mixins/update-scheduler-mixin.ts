import type { LitElement } from 'lit';

import type { AbstractConstructor } from './constructor.js';

// Define the interface for the mixin
export declare class SbbUpdateSchedulerMixinType {
  protected startUpdate(): void;
  protected completeUpdate(): void;
}

/**
 * This mixin allows scheduling manual updates, which affect updateComplete.
 * @param base The class to extend.
 * @returns A class extended with the slot child observer functionality.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const SbbUpdateSchedulerMixin = <T extends AbstractConstructor<LitElement>>(
  base: T,
): AbstractConstructor<SbbUpdateSchedulerMixinType> & T => {
  abstract class SbbUpdateSchedulerElement
    extends base
    implements Partial<SbbUpdateSchedulerMixinType>
  {
    private _updatePromise = Promise.resolve();
    private _updateResolve = (): void => {};

    protected startUpdate(): void {
      this._updatePromise = new Promise<void>((r) => (this._updateResolve = r));
    }

    protected completeUpdate(): void {
      this._updateResolve();
    }

    protected override async getUpdateComplete(): Promise<boolean> {
      const result = await super.getUpdateComplete();
      await this._updatePromise;
      return result;
    }
  }
  return SbbUpdateSchedulerElement as unknown as AbstractConstructor<SbbUpdateSchedulerMixinType> &
    T;
};
