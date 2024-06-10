/**
 * Can be used in tests where scroll events are not triggered by default.
 * @param options ScrollToOptions
 */
export function mockScrollTo(options: ScrollToOptions): void {
  window.scrollTo(options);

  // We need to manually dispatching the scroll as the scrollTo
  // does not fire a scroll event in test env.
  document.dispatchEvent(new Event('scroll'));
}
