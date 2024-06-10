/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-popover-trigger renders"] = 
`<span class="sbb-action-base sbb-popover-trigger">
  <slot>
    <sbb-icon
      aria-hidden="true"
      data-namespace="default"
      name="circle-information-small"
      role="img"
    >
    </sbb-icon>
  </slot>
</span>
`;
/* end snapshot sbb-popover-trigger renders */

snapshots["sbb-popover-trigger renders with custom content"] = 
`<span class="sbb-action-base sbb-popover-trigger">
  <slot>
    <sbb-icon
      aria-hidden="true"
      data-namespace="default"
      name="circle-information-small"
      role="img"
    >
    </sbb-icon>
  </slot>
</span>
`;
/* end snapshot sbb-popover-trigger renders with custom content */

snapshots["sbb-popover-trigger A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "button",
      "name": ""
    }
  ]
}
</p>
`;
/* end snapshot sbb-popover-trigger A11y tree Chrome */

snapshots["sbb-popover-trigger A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "button",
      "name": ""
    }
  ]
}
</p>
`;
/* end snapshot sbb-popover-trigger A11y tree Firefox */

