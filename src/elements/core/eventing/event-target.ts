/** Gets the target of an event while accounting for Shadow DOM. */
export function getEventTarget<T extends EventTarget>(event: Event): T | null {
  // If an event is bound outside the Shadow DOM, the `event.target` will
  // point to the shadow root, so we have to use `composedPath` instead.
  return (event.composedPath ? event.composedPath()[0] : event.target) as T | null;
}
