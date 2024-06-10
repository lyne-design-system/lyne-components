/**
 * @deprecated
 * TODO: remove once radio button became form element
 */
export interface HandlerAspectParams {
  host: HTMLElement;
  signal: AbortSignal;
}

/**
 * @deprecated
 * TODO: remove once radio button became form element
 */
export interface HandlerAspect {
  (params: HandlerAspectParams): void;
}

/**
 * @deprecated
 * TODO: remove once radio button became form element
 */
export class HandlerRepository {
  private _aspects: HandlerAspect[];
  private _controller?: AbortController;

  public constructor(
    private readonly _host: HTMLElement,
    ...aspects: HandlerAspect[]
  ) {
    this._aspects = aspects;
  }

  public connect(): void {
    this._controller?.abort();
    this._controller = new AbortController();
    const params: HandlerAspectParams = { host: this._host, signal: this._controller.signal };
    for (const aspect of this._aspects) {
      aspect(params);
    }
  }

  public disconnect(): void {
    this._controller?.abort();
  }
}
