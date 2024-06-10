/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-journey-summary renders"] = 
`<div class="sbb-journey-summary">
  <div>
    <div class="sbb-journey-summary__via-block">
      <span class="sbb-journey-summary__via-text">
        Via
      </span>
      <ul
        class="sbb-journey-summary__vias"
        role="presentation"
      >
        <li class="sbb-journey-summary__via">
          via
        </li>
      </ul>
    </div>
    <div class="sbb-journey-summary__date">
      <time datetime="29 8">
        Mo. 29.08.2022
      </time>
      ,
      <time>
        <sbb-screen-reader-only>
          Travel time 1 Hour
        </sbb-screen-reader-only>
        <span aria-hidden="true">
          1 h
        </span>
      </time>
    </div>
    <sbb-pearl-chain-time>
    </sbb-pearl-chain-time>
  </div>
</div>
`;
/* end snapshot sbb-journey-summary renders */

snapshots["sbb-journey-summary renders without vias"] = 
`<div class="sbb-journey-summary">
  <div>
    <div class="sbb-journey-summary__date">
      <time datetime="29 8">
        Mo. 29.08.2022
      </time>
      ,
      <time>
        <sbb-screen-reader-only>
          Travel time 1 Hour 40 Minutes
        </sbb-screen-reader-only>
        <span aria-hidden="true">
          1 h 40 min
        </span>
      </time>
    </div>
    <sbb-pearl-chain-time>
    </sbb-pearl-chain-time>
  </div>
</div>
`;
/* end snapshot sbb-journey-summary renders without vias */

snapshots["sbb-journey-summary renders with second journey"] = 
`<div class="sbb-journey-summary">
  <div>
    <div class="sbb-journey-summary__date">
      <time datetime="29 8">
        Mo. 29.08.2022
      </time>
      ,
      <time>
        <sbb-screen-reader-only>
          Travel time 1 Hour 40 Minutes
        </sbb-screen-reader-only>
        <span aria-hidden="true">
          1 h 40 min
        </span>
      </time>
    </div>
    <sbb-pearl-chain-time>
    </sbb-pearl-chain-time>
  </div>
  <div>
    <sbb-divider
      aria-orientation="horizontal"
      class="sbb-journey-summary__divider"
      orientation="horizontal"
      role="separator"
    >
    </sbb-divider>
    <div>
      <div class="sbb-journey-summary__via-block">
        <span class="sbb-journey-summary__via-text">
          Via
        </span>
        <ul
          class="sbb-journey-summary__vias"
          role="presentation"
        >
          <li class="sbb-journey-summary__via">
            via
          </li>
        </ul>
      </div>
      <div class="sbb-journey-summary__date">
        <time datetime="29 8">
          Mo. 29.08.2022
        </time>
        ,
        <time>
          <sbb-screen-reader-only>
            Travel time 1 Hour
          </sbb-screen-reader-only>
          <span aria-hidden="true">
            1 h
          </span>
        </time>
      </div>
      <sbb-pearl-chain-time>
      </sbb-pearl-chain-time>
    </div>
  </div>
</div>
`;
/* end snapshot sbb-journey-summary renders with second journey */

