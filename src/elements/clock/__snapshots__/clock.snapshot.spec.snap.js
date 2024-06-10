/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-clock renders"] = 
`<div class="sbb-clock">
  <span class="sbb-clock__face">
  </span>
  <span class="sbb-clock__hand-hours">
  </span>
  <span class="sbb-clock__hand-minutes sbb-clock__hand-minutes--no-transition">
  </span>
  <span class="sbb-clock__hand-seconds">
  </span>
</div>
`;
/* end snapshot sbb-clock renders */

snapshots["sbb-clock renders with a fixed time"] = 
`<div class="sbb-clock">
  <span class="sbb-clock__face">
  </span>
  <span class="sbb-clock__hand-hours sbb-clock__hand-hours--initial-hour">
  </span>
  <span
    class="sbb-clock__hand-minutes sbb-clock__hand-minutes--no-transition"
    style="transform: rotateZ(180deg);"
  >
  </span>
  <span class="sbb-clock__hand-seconds sbb-clock__hand-seconds--initial-minute">
  </span>
</div>
`;
/* end snapshot sbb-clock renders with a fixed time */

snapshots["sbb-clock A11y tree Chrome"] = 
`<p>
  {
  "role": "WebArea",
  "name": ""
}
</p>
`;
/* end snapshot sbb-clock A11y tree Chrome */

snapshots["sbb-clock A11y tree Firefox"] = 
`<p>
  {
  "role": "document",
  "name": ""
}
</p>
`;
/* end snapshot sbb-clock A11y tree Firefox */

