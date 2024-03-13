> Explain the use and the purpose of the component; add minor details if needed and provide a basic example.<br>
> If you reference other components, link their documentation at least once (the path must start from _/docs/..._ ).<br>
> For the examples, use triple backticks with file extension (` ```html <code here>``` `).<br>
> The following list of paragraphs is only suggested; remove, create and adapt as needed.

The `sbb-autocomplete-grid-option` is a component . . .

```html
<sbb-autocomplete-grid-option></sbb-autocomplete-grid-option>
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

| Name       | Attribute   | Privacy | Type                   | Default | Description                                                                                                                      |
| ---------- | ----------- | ------- | ---------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `value`    | `value`     | public  | `string \| undefined`  |         | Value of the option.                                                                                                             |
| `active`   | `active`    | public  | `boolean \| undefined` |         | Whether the option is currently active.                                                                                          |
| `selected` | `selected`  | public  | `boolean`              | `false` | Whether the option is selected.                                                                                                  |
| `disabled` | `disabled`  | public  | `boolean`              | `false` | Whether the component is disabled.                                                                                               |
| `iconName` | `icon-name` | public  | `string \| undefined`  |         | The icon name we want to use, choose from the small icon variants from the ui-icons category from here https://icons.app.sbb.ch. |

## Methods

| Name            | Privacy | Description                                | Parameters      | Return | Inherited From |
| --------------- | ------- | ------------------------------------------ | --------------- | ------ | -------------- |
| `setGroupLabel` | public  | Set the option group label (used for a11y) | `value: string` | `void` |                |

## Events

| Name                                | Type                | Description                                     | Inherited From |
| ----------------------------------- | ------------------- | ----------------------------------------------- | -------------- |
| `autocompleteOptionSelectionChange` | `CustomEvent<void>` | Emits when the option selection status changes. |                |
| `autocompleteOptionSelected`        | `CustomEvent<void>` | Emits when an option was selected by user.      |                |

## CSS Properties

| Name                                  | Default | Description                                                                                                   |
| ------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| `--sbb-option-icon-container-display` | `none`  | Can be used to reserve space even when preserve-icon-space on autocomplete is not set or iconName is not set. |

## Slots

| Name   | Description                                                                       |
| ------ | --------------------------------------------------------------------------------- |
|        | Use the unnamed slot to add content to the option label.                          |
| `icon` | Use this slot to provide an icon. If `icon-name` is set, a sbb-icon will be used. |
