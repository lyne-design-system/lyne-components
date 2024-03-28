/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-step renders"] = 
`<div class="sbb-step--wrapper">
  <div class="sbb-step">
    <slot>
    </slot>
  </div>
</div>
`;
/* end snapshot sbb-step renders collapsed */

snapshots["sbb-step A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "text",
      "name": "Label"
    }
  ]
}
</p>
`;
/* end snapshot sbb-step A11y tree Chrome */

snapshots["sbb-step A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "text leaf",
      "name": "Label"
    }
  ]
}
</p>
`;
/* end snapshot sbb-step A11y tree Firefox */

snapshots["sbb-step A11y tree Safari"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "text",
      "name": "Label"
    }
  ]
}
</p>
`;
/* end snapshot sbb-step A11y tree Safari */

