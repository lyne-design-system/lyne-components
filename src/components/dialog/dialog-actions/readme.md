The `sbb-dialog-actions` component extends the [sbb-action-group](/docs/components-sbb-action-group--docs) component. Use it in combination with the [sbb-dialog](/docs/components-sbb-dialog--docs) to display a footer with an action group.

```html
<sbb-dialog>
  <sbb-dialog-action>
    <sbb-block-link sbb-dialog-close>Link</sbb-block-link>
    <sbb-secondary-button sbb-dialog-close> Cancel </sbb-secondary-button>
    <sbb-button sbb-dialog-close> Confirm </sbb-button>
  </sbb-dialog-actions>
</sbb-dialog>
```

It has an implicit slot name: `actions`.

<!-- Auto Generated Below -->

## Properties

| Name             | Attribute         | Privacy | Type                                        | Default        | Description                                                                                                             |
| ---------------- | ----------------- | ------- | ------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `alignGroup`     | `align-group`     | public  | `'start' \| 'center' \| 'stretch' \| 'end'` | `'start'`      | Set the slotted `<sbb-action-group>` children's alignment.                                                              |
| `horizontalFrom` | `horizontal-from` | public  | `SbbHorizontalFrom`                         | `'medium'`     | Overrides the behaviour of `orientation` property.                                                                      |
| `orientation`    | `orientation`     | public  | `SbbOrientation`                            | `'horizontal'` | Indicates the orientation of the components inside the `<sbb-action-group>`.                                            |
| `buttonSize`     | `button-size`     | public  | `SbbButtonSize`                             | `'l'`          | Size of the nested sbb-button instances. This will overwrite the size attribute of nested sbb-button instances.         |
| `linkSize`       | `link-size`       | public  | `SbbLinkSize`                               | `'m'`          | Size of the nested sbb-block-link instances. This will overwrite the size attribute of nested sbb-block-link instances. |

## Slots

| Name | Description                                                                                        |
| ---- | -------------------------------------------------------------------------------------------------- |
|      | Use the unnamed slot to add `sbb-block-link` or `sbb-button` elements to the `sbb-dialog-actions`. |
