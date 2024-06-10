import type { SbbIconConfig } from '../core/config.js';
import { readConfig } from '../core/config.js';

import { validateContent } from './icon-validate.js';

const iconCdn = 'https://icons.app.sbb.ch/';

const iconNamespaces = new Map<string, string>()
  .set('default', `${iconCdn}icons/`)
  .set('picto', `${iconCdn}picto/`);
const requests = new Map<string, Promise<any>>();

/** Fetches icon svg content from providers and asserts only one request per icon is made. */
export const getSvgContent = (
  namespace: string,
  name: string,
  sanitize: boolean,
): Promise<string> => {
  const config: SbbIconConfig = readConfig().icon ?? {};

  const resolvedNamespace = config.namespaces?.get(namespace) ?? iconNamespaces.get(namespace);
  if (resolvedNamespace === undefined) {
    throw Error(
      `Unable to find the namespace "${namespace}". Please register your custom namespace.`,
    );
  }
  const url = `${resolvedNamespace}${name}.svg`;

  // Check if we already have a request for this url
  let req = requests.get(url);

  if (!req) {
    if (typeof fetch !== 'undefined' && typeof document !== 'undefined') {
      const interceptor = config.interceptor ?? ((i) => i.request());

      req = interceptor({
        namespace,
        name,
        url,
        request: () =>
          fetch(url)
            .then((rsp) => {
              if (rsp.ok) {
                return rsp.text().then((svgContent) => {
                  if (svgContent) {
                    svgContent = validateContent(svgContent, sanitize);
                  }
                  return svgContent;
                });
              }
              throw new Error('Failed to load icon ' + namespace + ':' + name);
            })
            .catch((error) => {
              throw Error(error);
            }),
      });
      // Cache for the same requests
      requests.set(url, req);
    } else {
      // Resolve promise for ssr scenarios
      return Promise.resolve('');
    }
  }

  return req;
};
