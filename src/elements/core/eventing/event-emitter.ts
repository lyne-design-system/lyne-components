const defaultOptions: EventInit = {
  bubbles: true,
  cancelable: true,
  composed: true,
} as const;

/**
 * Creates an event emitter, that can dispatch CustomEvent instances for the given
 * element with the specified event name.
 * Event options default to bubbles, cancelable and composed set to true.
 */
export class EventEmitter<T = any> {
  public constructor(
    private _element: HTMLElement,
    private _eventName: string,
    private _options: {
      bubbles?: boolean;
      cancelable?: boolean;
      composed?: boolean;
    } = defaultOptions,
  ) {}

  /**
   * Dispatches an event.
   * @param detail The detail to dispatch with the event.
   * @returns true when the event was successfully emitted or false,
   *  if preventDefault() was called. Always returns true in SSR.
   */
  public emit(detail?: T): boolean {
    return (
      this._element.dispatchEvent?.(
        new CustomEvent(this._eventName, { ...this._options, detail }),
      ) ?? true
    );
  }
}
