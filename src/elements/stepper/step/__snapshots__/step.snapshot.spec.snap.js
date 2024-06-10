/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-step renders - DOM"] = 
`<sbb-step
  id="sbb-step-0"
  role="tabpanel"
  slot="step"
>
  Step content
</sbb-step>
`;
/* end snapshot sbb-step renders - DOM */

snapshots["sbb-step renders - Shadow DOM"] = 
`<div class="sbb-step--wrapper">
  <div class="sbb-step">
    <slot>
    </slot>
  </div>
</div>
`;
/* end snapshot sbb-step renders - Shadow DOM */

snapshots["sbb-step A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": ""
}
</p>
`;
/* end snapshot sbb-step A11y tree Chrome */

snapshots["sbb-step A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": ""
}
</p>
`;
/* end snapshot sbb-step A11y tree Firefox */

