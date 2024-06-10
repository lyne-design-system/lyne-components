/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-card-badge renders - DOM"] = 
`<sbb-card-badge
  color="charcoal"
  dir="ltr"
  role="text"
  slot="badge"
>
  Black Friday Special
</sbb-card-badge>
`;
/* end snapshot sbb-card-badge renders - DOM */

snapshots["sbb-card-badge renders - Shadow DOM"] = 
`<span class="sbb-card-badge-wrapper">
  <span class="sbb-card-badge">
    <span
      aria-hidden="true"
      class="sbb-card-badge-background"
    >
    </span>
    <span class="sbb-card-badge-content">
      <slot>
      </slot>
    </span>
  </span>
</span>
`;
/* end snapshot sbb-card-badge renders - Shadow DOM */

snapshots["sbb-card-badge A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "text",
      "name": "Black Friday Special"
    }
  ]
}
</p>
`;
/* end snapshot sbb-card-badge A11y tree Chrome */

snapshots["sbb-card-badge A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "text leaf",
      "name": "Black Friday Special"
    }
  ]
}
</p>
`;
/* end snapshot sbb-card-badge A11y tree Firefox */

