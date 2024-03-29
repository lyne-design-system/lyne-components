/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-radio-button-group renders - Dom"] = 
`<sbb-radio-button-group
  orientation="horizontal"
  role="radiogroup"
>
</sbb-radio-button-group>
`;
/* end snapshot sbb-radio-button-group renders - Dom */

snapshots["sbb-radio-button-group renders - ShadowDom"] = 
`<div class="sbb-radio-group">
  <slot>
  </slot>
</div>
<div class="sbb-radio-group__error">
  <slot name="error">
  </slot>
</div>
`;
/* end snapshot sbb-radio-button-group renders - ShadowDom */

snapshots["sbb-radio-button-group A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": ""
}
</p>
`;
/* end snapshot sbb-radio-button-group A11y tree Chrome */

snapshots["sbb-radio-button-group A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": ""
}
</p>
`;
/* end snapshot sbb-radio-button-group A11y tree Firefox */

