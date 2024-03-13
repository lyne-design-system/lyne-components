/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-autocomplete-grid Dom"] = 
`<sbb-autocomplete-grid
  data-state="closed"
  dir="ltr"
  id="sbb-autocomplete-grid-1"
  role="grid"
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
    >
      Option 1
    </sbb-autocomplete-grid-option>
    <sbb-autocomplete-grid-actions
      id="sbb-autocomplete-grid-item-1x1"
      role="gridcell"
    >
      <sbb-autocomplete-grid-button
        aria-disabled="false"
        data-action=""
        data-button=""
        dir="ltr"
        icon-name="dog-small"
        id="sbb-autocomplete-grid-item-1x1x0"
        role="button"
      >
      </sbb-autocomplete-grid-button>
    </sbb-autocomplete-grid-actions>
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
    >
      Option 2
    </sbb-autocomplete-grid-option>
    <sbb-autocomplete-grid-actions
      id="sbb-autocomplete-grid-item-2x1"
      role="gridcell"
    >
      <sbb-autocomplete-grid-button
        aria-disabled="false"
        data-action=""
        data-button=""
        dir="ltr"
        icon-name="dog-small"
        id="sbb-autocomplete-grid-item-2x1x0"
        role="button"
      >
      </sbb-autocomplete-grid-button>
    </sbb-autocomplete-grid-actions>
  </sbb-autocomplete-grid-row>
</sbb-autocomplete-grid>
`;
/* end snapshot sbb-autocomplete-grid Dom */

snapshots["sbb-autocomplete-grid ShadowDom"] = 
`<div class="sbb-autocomplete__gap-fix">
</div>
<div class="sbb-autocomplete__container">
  <div class="sbb-autocomplete__gap-fix">
    <div class="sbb-gap-fix-wrapper">
      <div
        class="sbb-gap-fix-corner"
        id="left"
      >
      </div>
    </div>
    <div class="sbb-gap-fix-wrapper">
      <div
        class="sbb-gap-fix-corner"
        id="right"
      >
      </div>
    </div>
  </div>
  <div class="sbb-autocomplete__panel">
    <div class="sbb-autocomplete__wrapper">
      <div class="sbb-autocomplete__options">
        <slot>
        </slot>
      </div>
    </div>
  </div>
</div>
`;
/* end snapshot sbb-autocomplete-grid ShadowDom */

