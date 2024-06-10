export class NodeMutationObserver implements MutationObserver {
  public disconnect(): void {
    // Noop
  }

  public observe(_target: Node, _options?: MutationObserverInit): void {
    // Noop
  }

  public takeRecords(): MutationRecord[] {
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AgnosticMutationObserver: typeof MutationObserver =
  typeof MutationObserver === 'undefined' ? NodeMutationObserver : MutationObserver;
