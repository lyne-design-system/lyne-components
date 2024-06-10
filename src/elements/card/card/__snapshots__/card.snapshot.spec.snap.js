/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-card should render with sbb-card-badge - DOM"] = 
`<sbb-card
  color="white"
  data-has-card-badge=""
  size="xl"
>
  <h2>
    Title
  </h2>
  Content text
  <sbb-card-badge
    color="charcoal"
    dir="ltr"
    role="text"
    slot="badge"
  >
    <span>
      %
    </span>
    <span>
      from CHF
    </span>
    <span>
      19.99
    </span>
  </sbb-card-badge>
</sbb-card>
`;
/* end snapshot sbb-card should render with sbb-card-badge - DOM */

snapshots["sbb-card should render with sbb-card-badge - Shadow DOM"] = 
`<span class="sbb-card">
  <slot name="action">
  </slot>
  <span class="sbb-card__wrapper">
    <slot>
    </slot>
  </span>
  <span class="sbb-card__badge-wrapper">
    <slot name="badge">
    </slot>
  </span>
</span>
`;
/* end snapshot sbb-card should render with sbb-card-badge - Shadow DOM */

snapshots["sbb-card A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "heading",
      "name": "Title",
      "level": 2
    },
    {
      "role": "text",
      "name": "Content text"
    },
    {
      "role": "text",
      "name": "%"
    },
    {
      "role": "text",
      "name": "from CHF"
    },
    {
      "role": "text",
      "name": "19.99"
    }
  ]
}
</p>
`;
/* end snapshot sbb-card A11y tree Chrome */

snapshots["sbb-card A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "heading",
      "name": "Title",
      "level": 2
    },
    {
      "role": "text leaf",
      "name": "Content text "
    },
    {
      "role": "text leaf",
      "name": "%"
    },
    {
      "role": "text leaf",
      "name": "from CHF"
    },
    {
      "role": "text leaf",
      "name": "19.99"
    }
  ]
}
</p>
`;
/* end snapshot sbb-card A11y tree Firefox */

