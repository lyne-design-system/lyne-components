/**
 * Forwards an event to the host element provided.
 * This way, an event triggered in the ShadowDOM can cross its boundary and can be listened on the host component.
 */
export function forwardEventToHost(event: Event, host: HTMLElement): void {
  const eventConstructor = Object.getPrototypeOf(event).constructor;
  const copiedEvent: Event = new eventConstructor(event.type, event);
  host.dispatchEvent(copiedEvent);
}
