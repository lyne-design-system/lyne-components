> Explain the use and the purpose of the component; add minor details if needed and provide a basic example.<br>
> If you reference other components, link their documentation at least once (the path must start from _/docs/..._ ).<br>
> For the examples, use triple backticks with file extension (` ```html <code here>``` `).<br>
> The following list of paragraphs is only suggested; remove, create and adapt as needed.

The `sbb-step` is a component . . .

```html
<sbb-step></sbb-step>
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

| Name    | Attribute | Privacy | Type                          | Default | Description |
| ------- | --------- | ------- | ----------------------------- | ------- | ----------- |
| `label` | -         | public  | `SbbStepLabelElement \| null` | `null`  |             |

## Methods

| Name       | Privacy | Description | Parameters                        | Return    | Inherited From |
| ---------- | ------- | ----------- | --------------------------------- | --------- | -------------- |
| `validate` | public  |             | `eventData: ValidateEventDetails` | `boolean` |                |

## Events

| Name       | Type                | Description                                               | Inherited From |
| ---------- | ------------------- | --------------------------------------------------------- | -------------- |
| `validate` | `CustomEvent<void>` | Emits whenever step switch is triggered. Can be canceled. |                |

## Slots

| Name | Description                                |
| ---- | ------------------------------------------ |
|      | Use the unnamed slot to provide a content. |