import type { ReactiveController, ReactiveControllerHost } from 'lit';

export class SbbConnectedAbortController implements ReactiveController {
  private _abortController?: AbortController = new AbortController();

  public get signal(): AbortSignal | undefined {
    return this._abortController?.signal;
  }

  public constructor(private _host: ReactiveControllerHost) {
    this._host.addController(this);
  }

  public hostConnected(): void {
    if (!this._abortController) {
      this._abortController = new AbortController();
    }
  }

  public hostDisconnected(): void {
    this._abortController?.abort();
    this._abortController = undefined;
  }
}
