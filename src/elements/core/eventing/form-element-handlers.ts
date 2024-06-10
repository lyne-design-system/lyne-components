import type { HandlerAspect } from './handler-repository.js';

/**
 * Prevents scrolling from pressing Space
 * @param event The origin event.
 */
export function preventScrollOnSpacebarPress(event: KeyboardEvent): void {
  if (event.key === ' ') {
    event.preventDefault();
  }
}

/**
 * Handler to prevent scrolling on space bar click.
 *
 * @deprecated TODO: remove once radio button became form element
 */
export const formElementHandlerAspect: HandlerAspect = ({ host, signal }) => {
  host.addEventListener('keydown', preventScrollOnSpacebarPress, { signal });
};
