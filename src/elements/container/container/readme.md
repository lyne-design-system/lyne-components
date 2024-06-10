The `sbb-container` is a component that displays its content with the default page spacing. It also supports the slotting of a `sbb-sticky-bar`.

```html
<sbb-container>
  <!-- Any other kind of content. -->
  ...

  <!-- Sticky bar should go last. -->
  <sbb-sticky-bar> ... </sbb-sticky-bar>
</sbb-container>
```

## Slots

The `sbb-container` content is provided via an unnamed slot.

## Style

By default `sbb-container` uses the `page spacing` defined in the [layout documentation](/docs/styles-layout--docs). Optionally the user can use the `expanded` property (default: `false`) to switch to the `page spacing expanded` layout.
Spacing options are applied to all of the container's content, including the `sbb-sticky-bar`.
The component has also four color variants that can be set using the `color` property (default: `white`).

```html
<sbb-container expanded variant="milk"> ... </sbb-container>
```

<!-- Auto Generated Below -->

## Properties

| Name                 | Attribute             | Privacy | Type                                 | Default   | Description                                                                     |
| -------------------- | --------------------- | ------- | ------------------------------------ | --------- | ------------------------------------------------------------------------------- |
| `backgroundExpanded` | `background-expanded` | public  | `boolean`                            | `false`   | Whether the background color is shown on full container width on large screens. |
| `color`              | `color`               | public  | `'transparent' \| 'white' \| 'milk'` | `'white'` | Color of the container, like transparent, white etc.                            |
| `expanded`           | `expanded`            | public  | `boolean`                            | `false`   | Whether the container is expanded.                                              |

## Slots

| Name         | Description                                            |
| ------------ | ------------------------------------------------------ |
|              | Use the unnamed slot to add anything to the container. |
| `sticky-bar` | The slot used by the sbb-sticky-bar component.         |
