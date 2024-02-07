> Explain the use and the purpose of the component; add minor details if needed and provide a basic example.<br>
> If you reference other components, link their documentation at least once (the path must start from _/docs/..._ ).<br>
> For the examples, use triple backticks with file extension (` ```html <code here>``` `).<br>
> The following list of paragraphs is only suggested; remove, create and adapt as needed.

The `sbb-dialog-actions` is a component . . .

```html
<sbb-dialog-actions></sbb-dialog-actions>
```

## Slots

> Describe slot naming and usage and provide an example of slotted content.

## States

> Describe the component states (`disabled`, `readonly`, etc.) and provide examples.

## Style

> Describe the properties which change the component visualization (`size`, `negative`, etc.) and provide examples.

## Interactions

> Describe how it's possible to interact with the component (open and close a `sbb-dialog`, dismiss a `sbb-alert`, etc.) and provide examples.

## Events

> Describe events triggered by the component and possibly how to get information from the payload.

## Keyboard interaction

> If the component has logic for keyboard navigation (as the `sbb-calendar` or the `sbb-select`) describe it.

| Keyboard       | Action        |
| -------------- | ------------- |
| <kbd>Key</kbd> | What it does. |

## Accessibility

> Describe how accessibility is implemented and if there are issues or suggested best-practice for the consumers.

<!-- Auto Generated Below -->

## Properties

| Name             | Attribute         | Privacy | Type                                        | Default        | Description                                                                                                     |
| ---------------- | ----------------- | ------- | ------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------- |
| `alignGroup`     | `align-group`     | public  | `'start' \| 'center' \| 'stretch' \| 'end'` | `'start'`      | Set the slotted `<sbb-action-group>` children's alignment.                                                      |
| `horizontalFrom` | `horizontal-from` | public  | `SbbHorizontalFrom`                         | `'medium'`     | Overrides the behaviour of `orientation` property.                                                              |
| `orientation`    | `orientation`     | public  | `SbbOrientation`                            | `'horizontal'` | Indicates the orientation of the components inside the `<sbb-action-group>`.                                    |
| `buttonSize`     | `button-size`     | public  | `SbbButtonSize`                             | `'l'`          | Size of the nested sbb-button instances. This will overwrite the size attribute of nested sbb-button instances. |
| `linkSize`       | `link-size`       | public  | `SbbLinkSize`                               | `'m'`          | Size of the nested sbb-link instances. This will overwrite the size attribute of nested sbb-link instances.     |
