import { Component, h, Host } from '@stencil/core';

let nextId = 0;
@Component({
  shadow: true,
  styleUrls: {
    default: 'styles/sbb-form-error.default.scss',
    shared: 'styles/sbb-form-error.shared.scss',
  },
  tag: 'sbb-form-error',
})
export class SbbFormError {
  public render(): JSX.Element {
    return (
      <Host
        ref={(host): void => {
          if (!host.id) {
            host.id = `sbb-form-error-${++nextId}`;
          }
        }}
      >
        <span class="input-label-error__icon">
          <slot name="icon">
            <svg width="24" height="24" viewBox="0,0,24,24" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="m4,12.0002c0-4.47082,3.5301-8,8-8s8,3.52918,8,8c0,4.4699-3.5301,8-8,8-4.46986,0-8-3.5301-8-8zm8-9c-5.0221,0-9,3.97682-9,9,0,5.0221,3.97786,9,9,9,5.0221,0,9-3.9779,9-9,0-5.02318-3.9779-9-9-9zm.98,4.9995v-2h-1v2h1zm0,7.9903h2.0005v1h-5v-1H11.98v-5H10v-1h2.98v6z"
              ></path>
            </svg>
          </slot>
        </span>
        <span class="input-label-error">
          <slot />
        </span>
      </Host>
    );
  }
}
