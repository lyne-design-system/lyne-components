/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-map-container renders the container with button"] = 
`<div class="sbb-map-container">
  <div class="sbb-map-container__sidebar">
    <span>
    </span>
    <slot>
    </slot>
    <sbb-tertiary-button
      class="sbb-map-container__sidebar-button"
      data-action=""
      data-button=""
      data-sbb-button=""
      data-slot-names="unnamed"
      dir="ltr"
      icon-name="location-pin-map-small"
      inert=""
      role="button"
      size="l"
      tabindex="0"
      type="button"
    >
      Show map
    </sbb-tertiary-button>
  </div>
  <div class="sbb-map-container__map">
    <slot name="map">
    </slot>
  </div>
</div>
`;
/* end snapshot sbb-map-container renders the container with button */

snapshots["sbb-map-container renders the container without button"] = 
`<div class="sbb-map-container">
  <div class="sbb-map-container__sidebar">
    <slot>
    </slot>
  </div>
  <div class="sbb-map-container__map">
    <slot name="map">
    </slot>
  </div>
</div>
`;
/* end snapshot sbb-map-container renders the container without button */

snapshots["sbb-map-container A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": ""
}
</p>
`;
/* end snapshot sbb-map-container A11y tree Chrome */

snapshots["sbb-map-container A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": ""
}
</p>
`;
/* end snapshot sbb-map-container A11y tree Firefox */

