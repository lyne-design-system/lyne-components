/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-expansion-panel-content renders"] = 
`<div class="sbb-expansion-panel-content">
  <slot>
  </slot>
</div>
`;
/* end snapshot sbb-expansion-panel-content renders */

snapshots["sbb-expansion-panel-content A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "text",
      "name": "Content"
    }
  ]
}
</p>
`;
/* end snapshot sbb-expansion-panel-content A11y tree Chrome */

snapshots["sbb-expansion-panel-content A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "text leaf",
      "name": "Content"
    }
  ]
}
</p>
`;
/* end snapshot sbb-expansion-panel-content A11y tree Firefox */

