/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-breadcrumb renders with text"] = 
`<a
  class="sbb-action-base sbb-breadcrumb"
  download=""
  href="https://example.com/test"
  rel="subsection"
  target="_blank"
>
  <slot name="icon">
  </slot>
  <span class="sbb-breadcrumb__label">
    <slot>
    </slot>
  </span>
  <sbb-screen-reader-only>
    . Link target opens in a new window.
  </sbb-screen-reader-only>
</a>
`;
/* end snapshot sbb-breadcrumb renders with text */

snapshots["sbb-breadcrumb renders with icon"] = 
`<a
  class="sbb-action-base sbb-breadcrumb"
  href="/"
>
  <slot name="icon">
    <sbb-icon
      aria-hidden="true"
      class="sbb-breadcrumb__icon"
      data-namespace="default"
      name="house-small"
      role="img"
    >
    </sbb-icon>
  </slot>
  <span
    class="sbb-breadcrumb__label"
    hidden=""
  >
    <slot>
    </slot>
  </span>
</a>
`;
/* end snapshot sbb-breadcrumb renders with icon */

snapshots["sbb-breadcrumb renders with icon and text"] = 
`<a
  class="sbb-action-base sbb-breadcrumb"
  href="/"
>
  <slot name="icon">
    <sbb-icon
      aria-hidden="true"
      class="sbb-breadcrumb__icon"
      data-namespace="default"
      name="house-small"
      role="img"
    >
    </sbb-icon>
  </slot>
  <span class="sbb-breadcrumb__label">
    <slot>
    </slot>
  </span>
</a>
`;
/* end snapshot sbb-breadcrumb renders with icon and text */

snapshots["sbb-breadcrumb A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "Breadcrumb"
    }
  ]
}
</p>
`;
/* end snapshot sbb-breadcrumb A11y tree Chrome */

snapshots["sbb-breadcrumb A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "Breadcrumb",
      "value": "https://example.com/test"
    }
  ]
}
</p>
`;
/* end snapshot sbb-breadcrumb A11y tree Firefox */

