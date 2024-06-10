import type { LitElement } from 'lit';

const localNameCache = new Map<unknown, string>();

/**
 * In SSR the local/tag name is not available on the class instance, but it is available
 * in the shim customElements registry.
 *
 * https://github.com/lit/lit/blob/main/packages/labs/ssr-dom-shim/src.ts (See CustomElementRegistryShim)
 *
 * Can be removed once https://github.com/lit/lit/pull/4553 is merged/released.
 */
export function getLocalName(element: LitElement): string {
  if (localNameCache.has(element.constructor)) {
    return localNameCache.get(element.constructor)!;
  }

  const definitions = // eslint-disable-next-line @typescript-eslint/naming-convention
    (customElements as unknown as { __definitions: Map<string, { ctor: unknown }> }).__definitions;
  for (const [key, value] of definitions) {
    if (value.ctor === element.constructor) {
      localNameCache.set(element.constructor, key);
      return key;
    }
  }
  throw new Error(`Given element ${element.constructor.name} has not been registered yet.`);
}
