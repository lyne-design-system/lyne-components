/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-breadcrumb-group renders - DOM"] = 
`<sbb-breadcrumb-group
  data-loaded=""
  role="navigation"
>
  <sbb-breadcrumb
    data-action=""
    data-link=""
    dir="ltr"
    href="https://example.com"
    icon-name="pie-small"
    slot="li-0"
  >
  </sbb-breadcrumb>
  <sbb-breadcrumb
    data-action=""
    data-link=""
    dir="ltr"
    href="https://example.com/one"
    slot="li-1"
  >
    One
  </sbb-breadcrumb>
  <sbb-breadcrumb
    aria-current="page"
    data-action=""
    data-link=""
    dir="ltr"
    href="https://example.com/one"
    slot="li-2"
  >
    Two
  </sbb-breadcrumb>
</sbb-breadcrumb-group>
`;
/* end snapshot sbb-breadcrumb-group renders - DOM */

snapshots["sbb-breadcrumb-group renders - Shadow DOM"] = 
`<ol class="sbb-breadcrumb-group">
  <li class="sbb-breadcrumb-group__item">
    <slot name="li-0">
    </slot>
    <sbb-icon
      aria-hidden="true"
      class="sbb-breadcrumb-group__divider-icon"
      data-namespace="default"
      name="chevron-small-right-small"
      role="img"
    >
    </sbb-icon>
  </li>
  <li class="sbb-breadcrumb-group__item">
    <slot name="li-1">
    </slot>
    <sbb-icon
      aria-hidden="true"
      class="sbb-breadcrumb-group__divider-icon"
      data-namespace="default"
      name="chevron-small-right-small"
      role="img"
    >
    </sbb-icon>
  </li>
  <li class="sbb-breadcrumb-group__item">
    <slot name="li-2">
    </slot>
  </li>
</ol>
<span hidden="">
  <slot>
  </slot>
</span>
`;
/* end snapshot sbb-breadcrumb-group renders - Shadow DOM */

snapshots["sbb-breadcrumb-group A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": ""
    },
    {
      "role": "link",
      "name": "One"
    },
    {
      "role": "link",
      "name": "Two"
    }
  ]
}
</p>
`;
/* end snapshot sbb-breadcrumb-group A11y tree Chrome */

snapshots["sbb-breadcrumb-group A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "",
      "value": "https://example.com/"
    },
    {
      "role": "link",
      "name": "One",
      "value": "https://example.com/one"
    },
    {
      "role": "link",
      "name": "Two",
      "value": "https://example.com/one"
    }
  ]
}
</p>
`;
/* end snapshot sbb-breadcrumb-group A11y tree Firefox */

