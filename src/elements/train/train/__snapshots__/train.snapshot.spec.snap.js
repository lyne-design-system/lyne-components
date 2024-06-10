/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-train renders DOM"] = 
`<sbb-train
  direction="left"
  direction-label="Driving direction"
  station="Bern"
>
</sbb-train>
`;
/* end snapshot sbb-train renders DOM */

snapshots["sbb-train renders Shadow DOM"] = 
`<div class="sbb-train">
  <h6 class="sbb-train__direction-label-sr">
    Train, Driving direction Bern.
  </h6>
  <span hidden="">
    <slot>
    </slot>
  </span>
  <div
    aria-hidden="true"
    class="sbb-train__direction"
  >
    <div class="sbb-train__direction-heading">
      <span class="sbb-train__direction-label">
        Driving direction
      </span>
      <span class="sbb-train__direction-station">
        Bern
      </span>
    </div>
    <div class="sbb-train__direction-indicator">
      <div class="sbb-train__sticky-wrapper">
        <sbb-icon
          aria-hidden="true"
          class="sbb-train__direction-arrow"
          data-namespace="default"
          name="chevron-small-left-small"
          role="img"
        >
        </sbb-icon>
      </div>
    </div>
  </div>
</div>
`;
/* end snapshot sbb-train renders Shadow DOM */

