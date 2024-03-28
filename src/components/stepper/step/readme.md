Use the `sbb-step` with the `sbb-stepper` to display a step content.

```html
<sbb-step>Step content</sbb-step>
```

## Slots

It has an implicit slot name: `step`.

## Events

Whenever a step switch is triggered, a `validate` event is emitted and can be canceled to prevent the step change.

## Accessibility

The aria attribute `aria-labelledby` is set automatically.

<!-- Auto Generated Below -->

## Properties

| Name    | Attribute | Privacy | Type                          | Default | Description            |
| ------- | --------- | ------- | ----------------------------- | ------- | ---------------------- |
| `label` | -         | public  | `SbbStepLabelElement \| null` | `null`  | The label of the step. |

## Methods

| Name       | Privacy | Description | Parameters                               | Return    | Inherited From |
| ---------- | ------- | ----------- | ---------------------------------------- | --------- | -------------- |
| `validate` | public  |             | `eventData: SbbStepValidateEventDetails` | `boolean` |                |

## Events

| Name       | Type                                       | Description                                               | Inherited From |
| ---------- | ------------------------------------------ | --------------------------------------------------------- | -------------- |
| `validate` | `CustomEvent<SbbStepValidateEventDetails>` | Emits whenever step switch is triggered. Can be canceled. |                |

## Slots

| Name | Description                                |
| ---- | ------------------------------------------ |
|      | Use the unnamed slot to provide a content. |
