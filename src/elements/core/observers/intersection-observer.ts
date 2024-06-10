export class NodeIntersectionObserver implements IntersectionObserver {
  public root!: Element | Document | null;
  public rootMargin!: string;
  public thresholds!: number[];

  public disconnect(): void {
    // noop
  }

  public observe(): void {
    // noop
  }

  public takeRecords(): any {
    // noop
  }

  public unobserve(): void {
    // noop
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AgnosticIntersectionObserver =
  typeof IntersectionObserver === 'undefined' ? NodeIntersectionObserver : IntersectionObserver;
