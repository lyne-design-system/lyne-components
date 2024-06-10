/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-block-link renders - DOM"] = 
`<sbb-block-link
  accessibility-label="Travelcards &amp; tickets"
  data-action=""
  data-link=""
  data-sbb-link=""
  data-slot-names="unnamed"
  dir="ltr"
  download=""
  href="https://github.com/sbb-design-systems/lyne-components"
  icon-placement="start"
  size="m"
>
  Travelcards & tickets.
</sbb-block-link>
`;
/* end snapshot sbb-block-link renders - DOM */

snapshots["sbb-block-link renders - Shadow DOM"] = 
`<a
  aria-label="Travelcards &amp; tickets"
  class="sbb-action-base sbb-block-link"
  download=""
  href="https://github.com/sbb-design-systems/lyne-components"
>
  <span class="sbb-link__icon">
    <slot name="icon">
    </slot>
  </span>
  <slot>
  </slot>
</a>
`;
/* end snapshot sbb-block-link renders - Shadow DOM */

snapshots["sbb-block-link A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "Travelcards & tickets"
    }
  ]
}
</p>
`;
/* end snapshot sbb-block-link A11y tree Chrome */

snapshots["sbb-block-link A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "Travelcards & tickets",
      "value": "https://github.com/sbb-design-systems/lyne-components"
    }
  ]
}
</p>
`;
/* end snapshot sbb-block-link A11y tree Firefox */

