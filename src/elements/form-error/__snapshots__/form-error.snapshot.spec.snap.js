/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-form-error renders DOM"] = 
`<sbb-form-error id="sbb-form-error-0">
  Required
</sbb-form-error>
`;
/* end snapshot sbb-form-error renders DOM */

snapshots["sbb-form-error renders Shadow DOM"] = 
`<span class="form-error__icon">
  <slot name="icon">
  </slot>
</span>
<span class="form-error-content">
  <slot>
  </slot>
</span>
`;
/* end snapshot sbb-form-error renders Shadow DOM */

snapshots["sbb-form-error renders A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "text",
      "name": "Required"
    }
  ]
}
</p>
`;
/* end snapshot sbb-form-error renders A11y tree Chrome */

snapshots["sbb-form-error renders A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "text leaf",
      "name": "Required"
    }
  ]
}
</p>
`;
/* end snapshot sbb-form-error renders A11y tree Firefox */

