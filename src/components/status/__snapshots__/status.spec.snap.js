/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-status renders"] = 
`<div class="sbb-status">
  <sbb-icon
    aria-hidden="true"
    class="sbb-status__icon"
    data-namespace="default"
    name="circle-information-small"
    role="img"
  >
  </sbb-icon>
  <span class="sbb-status__content">
    <slot>
    </slot>
  </span>
</div>
`;
/* end snapshot sbb-status renders */

snapshots["sbb-status renders with the status title"] = 
`<div class="sbb-status">
  <sbb-icon
    aria-hidden="true"
    class="sbb-status__icon"
    data-namespace="default"
    name="circle-information-small"
    role="img"
  >
  </sbb-icon>
  <span class="sbb-status__content">
    <sbb-title
      aria-level="3"
      class="sbb-status__title"
      level="3"
      role="heading"
      visual-level="5"
    >
      <slot name="title">
        Title
      </slot>
    </sbb-title>
    <slot>
    </slot>
  </span>
</div>
`;
/* end snapshot sbb-status renders with the status title */

