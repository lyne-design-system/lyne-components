/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["sbb-image should render DOM"] = 
`<sbb-image
  aspect-ratio="16-9"
  border-radius="default"
  data-loaded=""
>
</sbb-image>
`;
/* end snapshot sbb-image should render DOM */

snapshots["sbb-image should render Shadow DOM"] = 
`<figure class="sbb-image__figure">
  <div class="sbb-image__wrapper">
    <img
      alt=""
      class="sbb-image__blurred"
      decoding="auto"
      height="562"
      loading="eager"
      width="1000"
    >
    <picture>
      <source
        media="(min-width: 64rem)"
        sizes="1200px"
      >
      <source
        media="(min-width: 37.5rem)"
        sizes="976px"
      >
      <source
        media="(max-width: 37.4375rem)"
        sizes="320px"
      >
      <img
        alt=""
        class="sbb-image__img"
        decoding="auto"
        height="562"
        loading="eager"
        width="1000"
      >
    </picture>
  </div>
</figure>
`;
/* end snapshot sbb-image should render Shadow DOM */

