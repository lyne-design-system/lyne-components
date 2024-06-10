The `sbb-teaser-paid` is a component with a background image and a chip with a text.

```html
<sbb-teaser-paid>
  <sbb-chip slot="chip">Label</sbb-chip>
  <sbb-image slot="image" image-src="https://path-to-source" alt="SBB CFF FFS Employee"></sbb-image>
</sbb-teaser-paid>
```

## Slots

The `sbb-teaser-paid` component has two slots: the `image` slot, used to slot an `sbb-image` and the `chip` slot, used to slot an `sbb-chip`.

<!-- Auto Generated Below -->

## Properties

| Name                 | Attribute             | Privacy | Type                                    | Default | Description                                                       |
| -------------------- | --------------------- | ------- | --------------------------------------- | ------- | ----------------------------------------------------------------- |
| `accessibilityLabel` | `accessibility-label` | public  | `string \| undefined`                   |         | This will be forwarded as aria-label to the inner anchor element. |
| `download`           | `download`            | public  | `boolean \| undefined`                  |         | Whether the browser will show the download dialog on click.       |
| `href`               | `href`                | public  | `string \| undefined`                   |         | The href value you want to link to.                               |
| `rel`                | `rel`                 | public  | `string \| undefined`                   |         | The relationship of the linked URL as space-separated link types. |
| `target`             | `target`              | public  | `LinkTargetType \| string \| undefined` |         | Where to display the linked URL.                                  |

## Slots

| Name    | Description                                    |
| ------- | ---------------------------------------------- |
| `chip`  | Link content of the panel                      |
| `image` | The background image that can be a `sbb-image` |
