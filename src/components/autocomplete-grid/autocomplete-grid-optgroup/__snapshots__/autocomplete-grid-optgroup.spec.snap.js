/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-autocomplete-grid-optgroup Chrome-Firefox Dom"] = 
`<sbb-autocomplete-grid-optgroup
  aria-disabled="false"
  aria-label="Group"
  label="Group"
  role="group"
>
  <sbb-autocomplete-grid-row
    id="sbb-autocomplete-grid-row-1"
    role="row"
  >
    <sbb-autocomplete-grid-option
      aria-disabled="false"
      aria-selected="false"
      data-slot-names="unnamed"
      id="sbb-autocomplete-grid-item-1x0"
      role="gridcell"
      value="1"
    >
      Option 1
    </sbb-autocomplete-grid-option>
  </sbb-autocomplete-grid-row>
  <sbb-autocomplete-grid-row
    id="sbb-autocomplete-grid-row-2"
    role="row"
  >
    <sbb-autocomplete-grid-option
      aria-disabled="false"
      aria-selected="false"
      data-slot-names="unnamed"
      id="sbb-autocomplete-grid-item-2x0"
      role="gridcell"
      value="2"
    >
      Option 2
    </sbb-autocomplete-grid-option>
  </sbb-autocomplete-grid-row>
</sbb-autocomplete-grid-optgroup>
`;
/* end snapshot sbb-autocomplete-grid-optgroup Chrome-Firefox Dom */

snapshots["sbb-autocomplete-grid-optgroup Chrome-Firefox ShadowDom"] = 
`<div class="sbb-optgroup__divider">
  <sbb-divider
    aria-orientation="horizontal"
    orientation="horizontal"
    role="separator"
  >
  </sbb-divider>
</div>
<div
  aria-hidden="true"
  class="sbb-optgroup__label"
>
  <div class="sbb-optgroup__icon-space">
  </div>
  <span>
    Group
  </span>
</div>
<slot>
</slot>
`;
/* end snapshot sbb-autocomplete-grid-optgroup Chrome-Firefox ShadowDom */

snapshots["sbb-autocomplete-grid-optgroup Chrome-Firefox A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "text",
      "name": "Option 1"
    },
    {
      "role": "text",
      "name": "Option 2"
    }
  ]
}
</p>
`;
/* end snapshot sbb-autocomplete-grid-optgroup Chrome-Firefox A11y tree Chrome */

snapshots["sbb-autocomplete-grid-optgroup Chrome-Firefox A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "text leaf",
      "name": "Option 1"
    },
    {
      "role": "text leaf",
      "name": "Option 2"
    }
  ]
}
</p>
`;
/* end snapshot sbb-autocomplete-grid-optgroup Chrome-Firefox A11y tree Firefox */

snapshots["sbb-autocomplete-grid-optgroup Safari Dom"] = 
`<sbb-autocomplete-grid-optgroup label="Group">
  <sbb-autocomplete-grid-row
    id="sbb-autocomplete-grid-row-1"
    role="row"
  >
    <sbb-autocomplete-grid-option
      aria-disabled="false"
      aria-selected="false"
      data-group-label="Group"
      data-slot-names="unnamed"
      id="sbb-autocomplete-grid-item-1x0"
      role="gridcell"
      value="1"
    >
      Option 1
    </sbb-autocomplete-grid-option>
  </sbb-autocomplete-grid-row>
  <sbb-autocomplete-grid-row
    id="sbb-autocomplete-grid-row-2"
    role="row"
  >
    <sbb-autocomplete-grid-option
      aria-disabled="false"
      aria-selected="false"
      data-group-label="Group"
      data-slot-names="unnamed"
      id="sbb-autocomplete-grid-item-2x0"
      role="gridcell"
      value="2"
    >
      Option 2
    </sbb-autocomplete-grid-option>
  </sbb-autocomplete-grid-row>
</sbb-autocomplete-grid-optgroup>
`;
/* end snapshot sbb-autocomplete-grid-optgroup Safari Dom */

snapshots["sbb-autocomplete-grid-optgroup Safari ShadowDom"] = 
`<div class="sbb-optgroup__divider">
  <sbb-divider
    aria-orientation="horizontal"
    orientation="horizontal"
    role="separator"
  >
  </sbb-divider>
</div>
<div
  aria-hidden="true"
  class="sbb-optgroup__label"
>
  <div class="sbb-optgroup__icon-space">
  </div>
  <span>
    Group
  </span>
</div>
<slot>
</slot>
`;
/* end snapshot sbb-autocomplete-grid-optgroup Safari ShadowDom */

snapshots["sbb-autocomplete-grid-optgroup Safari A11y tree Safari"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "text",
      "name": "Option 1"
    },
    {
      "role": "text",
      "name": "("
    },
    {
      "role": "text",
      "name": "Group"
    },
    {
      "role": "text",
      "name": ")"
    },
    {
      "role": "text",
      "name": "Option 2"
    },
    {
      "role": "text",
      "name": "("
    },
    {
      "role": "text",
      "name": "Group"
    },
    {
      "role": "text",
      "name": ")"
    }
  ]
}
</p>
`;
/* end snapshot sbb-autocomplete-grid-optgroup Safari A11y tree Safari */

