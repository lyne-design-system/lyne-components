import { Router } from '@lit-labs/router';
import { html, LitElement, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@sbb-esta/lyne-elements/core/styles/standard-theme.scss';

/**
 * Main app containing the router outlet.
 */
@customElement('app-main')
export class Main extends LitElement {
  private _router = new Router(this, [
    {
      path: '/',
      render: () => html`<app-overview></app-overview>`,
      enter: async () => {
        await import('./components/overview/overview.js');
        return true;
      },
    },
    {
      path: '/compare/:component/:testcase',
      render: ({ component, testcase }) =>
        html`<app-test-case
          .params=${{ componentName: component, testCaseName: testcase }}
        ></app-test-case>`,
      enter: async () => {
        await import('./components/test-case/test-case.js');
        return true;
      },
    },
  ]);

  public override render(): TemplateResult {
    return html`${this._router.outlet()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'app-main': Main;
  }
}
