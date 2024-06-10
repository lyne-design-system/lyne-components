export class NodeResizeObserver implements ResizeObserver {
  public disconnect(): any {
    // noop
  }

  public observe(): any {
    // noop
  }

  public unobserve(): any {
    // noop
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AgnosticResizeObserver =
  typeof ResizeObserver === 'undefined' ? NodeResizeObserver : ResizeObserver;
