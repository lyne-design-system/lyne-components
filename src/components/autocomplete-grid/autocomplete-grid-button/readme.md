> Explain the use and the purpose of the component; add minor details if needed and provide a basic example.<br>
> If you reference other components, link their documentation at least once (the path must start from _/docs/..._ ).<br>
> For the examples, use triple backticks with file extension (` ```html <code here>``` `).<br>
> The following list of paragraphs is only suggested; remove, create and adapt as needed.

The `sbb-autocomplete-grid-button` is a component . . .

```html
<sbb-autocomplete-grid-button></sbb-autocomplete-grid-button>
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

| Name              | Attribute   | Privacy | Type                                       | Default    | Description                                                                                                                      |
| ----------------- | ----------- | ------- | ------------------------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `optionOnSameRow` | -           | public  | `SbbAutocompleteGridOptionElement \| null` |            | Gets the SbbAutocompleteGridOptionElement on the same row of the button.                                                         |
| `disabled`        | `disabled`  | public  | `boolean`                                  | `false`    | Whether the component is disabled.                                                                                               |
| `negative`        | `negative`  | public  | `boolean`                                  | `false`    | Negative coloring variant flag.                                                                                                  |
| `iconName`        | `icon-name` | public  | `string \| undefined`                      |            | The icon name we want to use, choose from the small icon variants from the ui-icons category from here https://icons.app.sbb.ch. |
| `type`            | `type`      | public  | `SbbButtonType`                            | `'button'` | The type attribute to use for the button.                                                                                        |
| `name`            | `name`      | public  | `string`                                   |            | The name of the button element.                                                                                                  |
| `value`           | `value`     | public  | `string`                                   |            | The value of the button element.                                                                                                 |
| `form`            | `form`      | public  | `string \| undefined`                      |            | The <form> element to associate the button with.                                                                                 |

## Methods

| Name            | Privacy | Description | Parameters             | Return | Inherited From |
| --------------- | ------- | ----------- | ---------------------- | ------ | -------------- |
| `dispatchClick` | public  |             | `event: KeyboardEvent` | `void` |                |

## Slots

| Name   | Description                                  |
| ------ | -------------------------------------------- |
| `icon` | Slot used to display the icon, if one is set |
