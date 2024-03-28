import type { LitElement } from 'lit';

import type { Constructor } from '../constructor';

// Define the interface for the mixin
export declare class UpdateSchedulerMixinType {
  protected startUpdate(): void;
  protected completeUpdate(): void;
}

/**
 * This mixin allows scheduling manual updates, which affect updateComplete.
 * @param base The class to extend.
 * @returns A class extended with the slot child observer functionality.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const UpdateSchedulerMixin = <T extends Constructor<LitElement>>(
  base: T,
): Constructor<UpdateSchedulerMixinType> & T => {
  class UpdateSchedulerElement extends base implements Partial<UpdateSchedulerMixinType> {
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
  return UpdateSchedulerElement as unknown as Constructor<UpdateSchedulerMixinType> & T;
};
