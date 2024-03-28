/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-autocomplete-grid-option default Dom"] = 
`<sbb-autocomplete-grid-option
  aria-disabled="false"
  aria-selected="false"
  data-slot-names="unnamed"
  id="sbb-autocomplete-grid-item-1x0"
  role="gridcell"
  value="1"
>
  Option 1
</sbb-autocomplete-grid-option>
`;
/* end snapshot sbb-autocomplete-grid-option default Dom */

snapshots["sbb-autocomplete-grid-option default ShadowDom"] = 
`<div class="sbb-option__container">
  <div class="sbb-option">
    <span class="sbb-option__icon">
      <slot name="icon">
      </slot>
    </span>
    <span class="sbb-option__label">
      <slot>
      </slot>
      Option 1
    </span>
  </div>
</div>
`;
/* end snapshot sbb-autocomplete-grid-option default ShadowDom */

snapshots["sbb-autocomplete-grid-option default A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "text",
      "name": "Option 1"
    }
  ]
}
</p>
`;
/* end snapshot sbb-autocomplete-grid-option default A11y tree Chrome */

snapshots["sbb-autocomplete-grid-option default A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "text leaf",
      "name": "Option 1"
    }
  ]
}
</p>
`;
/* end snapshot sbb-autocomplete-grid-option default A11y tree Firefox */

