> Explain the use and the purpose of the component; add minor details if needed and provide a basic example.<br>
> If you reference other components, link their documentation at least once (the path must start from _/docs/..._ ).<br>
> For the examples, use triple backticks with file extension (` ```html <code here>``` `).<br>
> The following list of paragraphs is only suggested; remove, create and adapt as needed.

The `sbb-dialog-title` is a component . . .

```html
<sbb-dialog-title></sbb-dialog-title>
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

| Name                      | Attribute                   | Privacy | Type                         | Default | Description                                                                                                                                                                                    |
| ------------------------- | --------------------------- | ------- | ---------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `visualLevel`             | `visual-level`              | public  | `TitleLevel \| undefined`    | `'3'`   | Visual level for the title. Optional, if not set, the value of level will be used.                                                                                                             |
| `titleBackButton`         | `title-back-button`         | public  | `boolean`                    | `false` | Whether a back button is displayed next to the title.                                                                                                                                          |
| `accessibilityCloseLabel` | `accessibility-close-label` | public  | `\| string     \| undefined` |         | This will be forwarded as aria-label to the close button element.                                                                                                                              |
| `accessibilityBackLabel`  | `accessibility-back-label`  | public  | `\| string     \| undefined` |         | This will be forwarded as aria-label to the back button element.                                                                                                                               |
| `hideOnScroll`            | `hide-on-scroll`            | public  | `false \| Breakpoint`        | `false` | Whether to hide the title up to a certain breakpoint.                                                                                                                                          |
| `level`                   | `level`                     | public  | `TitleLevel \| undefined`    | `'1'`   | Title level                                                                                                                                                                                    |
| `visuallyHidden`          | `visually-hidden`           | public  | `boolean \| undefined`       |         | Sometimes we need a title in the markup to present a proper hierarchy to the screen readers while we do not want to let that title appear visually. In this case we set visuallyHidden to true |
| `negative`                | `negative`                  | public  | `boolean \| undefined`       | `false` | Choose negative variant                                                                                                                                                                        |

## Events

| Name                | Type                | Description                                | Inherited From |
| ------------------- | ------------------- | ------------------------------------------ | -------------- |
| `requestBackAction` | `CustomEvent<void>` | Emits whenever the back button is clicked. |                |
