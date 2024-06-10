/** Waits for the event to finish bubbling and returns whether it has been prevented. */
export async function isEventPrevented(event: Event): Promise<boolean> {
  // The event is finished after a macro task, for which we use setTimeout.
  await new Promise((r) => setTimeout(r));
  return event.defaultPrevented;
}
