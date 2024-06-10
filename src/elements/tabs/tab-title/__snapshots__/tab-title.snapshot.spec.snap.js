/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-tab-title renders"] = 
`<div class="sbb-tab-title__wrapper">
  <h1 class="sbb-tab-title">
    <span class="sbb-tab-title__icon">
      <slot name="icon">
      </slot>
    </span>
    <span class="sbb-tab-title__text">
      <slot>
      </slot>
    </span>
    <span class="sbb-tab-title__amount">
      <slot name="amount">
      </slot>
    </span>
  </h1>
</div>
`;
/* end snapshot sbb-tab-title renders */

snapshots["sbb-tab-title renders correctly an H2 heading tag"] = 
`<div class="sbb-tab-title__wrapper">
  <h2 class="sbb-tab-title">
    <span class="sbb-tab-title__icon">
      <slot name="icon">
        <sbb-icon
          aria-hidden="true"
          data-namespace="default"
          name="pie-small"
          role="img"
        >
        </sbb-icon>
      </slot>
    </span>
    <span class="sbb-tab-title__text">
      <slot>
      </slot>
    </span>
    <span class="sbb-tab-title__amount">
      <slot name="amount">
      </slot>
    </span>
  </h2>
</div>
`;
/* end snapshot sbb-tab-title renders correctly an H2 heading tag */

snapshots["sbb-tab-title renders an H1 heading tag if the provided level is greater than 6"] = 
`<div class="sbb-tab-title__wrapper">
  <h1 class="sbb-tab-title">
    <span class="sbb-tab-title__icon">
      <slot name="icon">
      </slot>
    </span>
    <span class="sbb-tab-title__text">
      <slot>
      </slot>
    </span>
    <span class="sbb-tab-title__amount">
      <slot name="amount">
        78
      </slot>
    </span>
  </h1>
</div>
`;
/* end snapshot sbb-tab-title renders an H1 heading tag if the provided level is greater than 6 */

snapshots["sbb-tab-title A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "heading",
      "name": "Tab title",
      "level": 1
    }
  ]
}
</p>
`;
/* end snapshot sbb-tab-title A11y tree Chrome */

snapshots["sbb-tab-title A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "heading",
      "name": "Tab title",
      "level": 1
    }
  ]
}
</p>
`;
/* end snapshot sbb-tab-title A11y tree Firefox */

