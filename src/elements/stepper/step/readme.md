Use the `sbb-step` with the `sbb-stepper` to display a step content.

```html
<sbb-step>Step content</sbb-step>
```

## Slots

It has an implicit slot named `step`.

## Events

Whenever a step switch is triggered, a `validate` event is emitted and can be canceled to prevent the step change.

## Accessibility

Whenever textual content is provided, please also set the attribute `tabindex=‘0’` on the text tag, so that it can be reached and announced by screen-readers. Also remember to use the classes `.sbb-focus-outline` and `.sbb-focus-outline-dark` to correctly style the outline.

```html
<sbb-step>
    <p tabindex="0" class="sbb-focus-outline">Step content</p>
    <sbb-button>Button<sbb-button>
</sbb-step>
```

The aria attribute `aria-labelledby` is set automatically.

<!-- Auto Generated Below -->

## Properties

| Name    | Attribute | Privacy | Type                          | Default | Description            |
| ------- | --------- | ------- | ----------------------------- | ------- | ---------------------- |
| `label` | -         | public  | `SbbStepLabelElement \| null` | `null`  | The label of the step. |

## Events

| Name       | Type                                       | Description                                               | Inherited From |
| ---------- | ------------------------------------------ | --------------------------------------------------------- | -------------- |
| `validate` | `CustomEvent<SbbStepValidateEventDetails>` | Emits whenever step switch is triggered. Can be canceled. |                |

## Slots

| Name | Description                              |
| ---- | ---------------------------------------- |
|      | Use the unnamed slot to provide content. |
