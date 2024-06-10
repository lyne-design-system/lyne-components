/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-link-static renders - DOM"] = 
`<sbb-link-static
  data-action=""
  data-sbb-link=""
  data-slot-names="unnamed"
  dir="ltr"
  size="m"
>
  Travelcards & tickets.
</sbb-link-static>
`;
/* end snapshot sbb-link-static renders - DOM */

snapshots["sbb-link-static renders - Shadow DOM"] = 
`<span class="sbb-action-base sbb-link-static">
  <slot>
  </slot>
</span>
`;
/* end snapshot sbb-link-static renders - Shadow DOM */

snapshots["sbb-link-static A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "text",
      "name": "Travelcards & tickets."
    }
  ]
}
</p>
`;
/* end snapshot sbb-link-static A11y tree Chrome */

snapshots["sbb-link-static A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "text leaf",
      "name": "Travelcards & tickets. "
    }
  ]
}
</p>
`;
/* end snapshot sbb-link-static A11y tree Firefox */

