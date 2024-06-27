## Badge

The badge can be applied to an existing component / element.
Therefore, it can't be an own component and is provided as attribute.

### API

| CSS attribute name   | Type                        | Description                                                                  |
| -------------------- | --------------------------- | ---------------------------------------------------------------------------- |
| `sbb-badge`          | `string`                    | Content displayed in badge.                                                  |
| `sbb-badge-position` | `before \| middle \| after` | Positioning of the badge relative to the element where the badge is applied. |

Moreover, we provide the SASS mixin `badge` which contains the badge styling for general usage.

### Usage

```html
<sbb-icon icon-name="controls-small" sbb-badge="2" sbb-badge-position="after"></sbb-icon>
```
