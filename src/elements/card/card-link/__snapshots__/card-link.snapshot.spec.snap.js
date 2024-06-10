/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-card-button renders DOM"] = 
`<sbb-card
  color="white"
  data-action-role="link"
  data-has-action=""
  size="m"
>
  <sbb-card-link
    data-action=""
    data-link=""
    dir="ltr"
    href="https://github.com/sbb-design-systems/lyne-components"
    slot="action"
    target="_blank"
  >
    Follow me
  </sbb-card-link>
  Content text
</sbb-card>
`;
/* end snapshot sbb-card-button renders DOM */

snapshots["sbb-card-button renders Shadow DOM"] = 
`<span class="sbb-card">
  <slot name="action">
  </slot>
  <span class="sbb-card__wrapper">
    <slot>
    </slot>
  </span>
  <span class="sbb-card__badge-wrapper">
    <slot name="badge">
    </slot>
  </span>
</span>
`;
/* end snapshot sbb-card-button renders Shadow DOM */

snapshots["sbb-card-button renders A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "Follow me . Link target opens in a new window."
    },
    {
      "role": "text",
      "name": "Content text"
    }
  ]
}
</p>
`;
/* end snapshot sbb-card-button renders A11y tree Chrome */

snapshots["sbb-card-button renders A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "link",
      "name": "Follow me . Link target opens in a new window.",
      "value": "https://github.com/sbb-design-systems/lyne-components"
    },
    {
      "role": "text leaf",
      "name": "Content text "
    }
  ]
}
</p>
`;
/* end snapshot sbb-card-button renders A11y tree Firefox */

