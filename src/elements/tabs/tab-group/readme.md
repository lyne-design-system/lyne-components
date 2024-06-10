The `sbb-tab-group` is a component used to organize and gather tabs that the user can navigate through;
use it when you want to provide navigation within blocks of content, instead of showing everything in one place
or requiring the user to navigate between several different views.

Each tab has a related content, distinct from other tabs' content;
tab panels can present different sections of content and include text, images, forms, other tab groups, etc.

```html
<sbb-tab-group>
  <sbb-tab-title>I am the first</sbb-tab-title>
  <div>Tab content 1</div>

  <sbb-tab-title>I am the second</sbb-tab-title>
  <section>Tab content 2</section>

  <sbb-tab-title>I am the third</sbb-tab-title>
  <article>Tab content 3</article>
</sbb-tab-group>
```

In order to display a tab label within the tab bar, provide a `sbb-tab-title` right before its related tab content;
please refer to the [sbb-tab-title](/docs/elements-sbb-tab-sbb-tab-title--docs) documentation for more details.

**Note:** the content element should be wrapped in a `div`, a `section` or an `article` and placed right after its relative `sbb-tab-title`.
Tab groups can also be nested, which means that a tab's content block can be represented by another `sbb-tab-group`,
as shown in the "Nested Tab Groups" example.

## States

A tab can be selected, unselected, or in `disabled` state; disable a tab to mark it as unavailable.
Disabled tabs cannot be focused and may be invisible to assistive technologies such as screen readers.

It's possible to set the first selected tab using the `initialSelectedIndex` property.

```html
<sbb-tab-group initial-selected-index="1"> ... </sbb-tab-group>
```

<!-- Auto Generated Below -->

## Properties

| Name                   | Attribute                | Privacy | Type                              | Default | Description                                                                                                                        |
| ---------------------- | ------------------------ | ------- | --------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `initialSelectedIndex` | `initial-selected-index` | public  | `number`                          | `0`     | Sets the initial tab. If it matches a disabled tab or exceeds the length of the tab group, the first enabled tab will be selected. |
| `size`                 | `size`                   | public  | `InterfaceSbbTabGroupTab['size']` | `'l'`   | Size variant, either s, l or xl.                                                                                                   |

## Methods

| Name          | Privacy | Description               | Parameters         | Return | Inherited From |
| ------------- | ------- | ------------------------- | ------------------ | ------ | -------------- |
| `activateTab` | public  | Activates a tab by index. | `tabIndex: number` | `void` |                |
| `disableTab`  | public  | Disables a tab by index.  | `tabIndex: number` | `void` |                |
| `enableTab`   | public  | Enables a tab by index.   | `tabIndex: number` | `void` |                |

## Events

| Name        | Type                | Description                           | Inherited From |
| ----------- | ------------------- | ------------------------------------- | -------------- |
| `didChange` | `CustomEvent<void>` | Emits an event on selected tab change |                |

## Slots

| Name      | Description                                                                                                                                                                                                                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|           | Use the unnamed slot to add html-content to the `sbb-tab-group`. Wrap the content in a `div`, a `section`, an `article` or provide a nested `sbb-tab-group`: This is correct: `<div>Some text <p>Some other text</p></div>` This is not correct: `<span>Some text</span><p>Some other text</p>` |
| `tab-bar` | When you provide the `sbb-tab-title` tag through the unnamed slot, it will be automatically moved to this slot. You do not need to use it directly.                                                                                                                                             |
