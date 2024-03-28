The `sbb-stepper` is a component that visually guides a user through a sequential, multi-step process. It breaks down complex forms, flows, or other linear interactions into smaller, easier-to-follow steps. The current step is highlighted, and a progress bar connects the steps to visually represent progress.

Use it with [sbb-step-label](/docs/components-sbb-stepper-sbb-step-label--docs) and [sbb-step](/docs/components-sbb-stepper-sbb-step--docs).

```html
<sbb-stepper aria-label="Purpose of this flow">
  <sbb-step-label>Step label 1</sbb-step-label>
  <sbb-step>Step content 1</sbb-step>

  <sbb-step-label>Step label 2</sbb-step-label>
  <sbb-step>Step content 2</sbb-step>
</sbb-stepper>
```

## Interactions

There are two attributes to support navigation between different steps that can be used on elements inside an `sbb-step` to select the next or the previous step when clicked: `sbb-stepper-next` and `sbb-stepper-previous`.

### Linear stepper

The `linear` property can be set to create a linear stepper that requires the user to complete previous steps before proceeding to following steps.

```html
<sbb-stepper aria-label="Purpose of this flow" linear>
  <sbb-step-label>Step label 1</sbb-step-label>
  <sbb-step>Step content 1</sbb-step>

  <sbb-step-label>Step label 2</sbb-step-label>
  <sbb-step>Step content 2</sbb-step>

  <sbb-step-label>Step label 3</sbb-step-label>
  <sbb-step>Step content 3</sbb-step>
</sbb-stepper>
```

## Forms

There are two possible approaches. One is using a single form for the stepper, and the other is using a different form for each step.

### Single form

```html
<form>
  <sbb-stepper aria-label="Purpose of this flow">
    <sbb-step-label>Step label 1</sbb-step-label>
    <sbb-step>Step content 1: <sbb-form-field>...</sbb-form-field></sbb-step>

    <sbb-step-label>Step label 2</sbb-step-label>
    <sbb-step>Step content 2: <sbb-form-field>...</sbb-form-field></sbb-step>
  </sbb-stepper>
</form>
```

### Multiple forms

```html
<sbb-stepper aria-label="Purpose of this flow">
  <sbb-step-label>Step label 1</sbb-step-label>
  <sbb-step>
    <form>
      <sbb-form-field>...</sbb-form-field>
    </form>
  </sbb-step>

  <sbb-step-label>Step label 2</sbb-step-label>
  <sbb-step>
    <form>
      <sbb-form-field>...</sbb-form-field>
    </form>
  </sbb-step>
</sbb-stepper>
```

Calling the `reset()` method on the `sbb-stepper`, will reset the wrapping form or every form of each step and select the first step.

## Events

See the `validate` event of the [sbb-step](/docs/components-sbb-stepper-sbb-step--docs).

## Accessibility

Use an `aria-label` attribute to describe the purpose of the stepper. The `sbb-stepper` also sets other attributes on the steps and the step labels like `aria-setsize`, `aria-posinset`, `aria-controls`, `aria-labelledby`.

<!-- Auto Generated Below -->

## Properties

| Name             | Attribute         | Privacy | Type                             | Default        | Description                                                                       |
| ---------------- | ----------------- | ------- | -------------------------------- | -------------- | --------------------------------------------------------------------------------- |
| `linear`         | `linear`          | public  | `boolean`                        | `false`        | If set to true, only the current and previous labels can be clicked and selected. |
| `horizontalFrom` | `horizontal-from` | public  | `SbbHorizontalFrom \| undefined` |                | Overrides the behaviour of `orientation` property.                                |
| `orientation`    | `orientation`     | public  | `SbbOrientation`                 | `'horizontal'` | Steps orientation, either horizontal or vertical.                                 |
| `selected`       | -                 | public  | `SbbStepElement \| undefined`    |                | The currently selected step.                                                      |
| `selectedIndex`  | -                 | public  | `number \| undefined`            |                | The currently selected step index.                                                |
| `steps`          | -                 | public  | `SbbStepElement[]`               |                | The steps of the stepper.                                                         |

## Methods

| Name       | Privacy | Description                                                                        | Parameters | Return | Inherited From |
| ---------- | ------- | ---------------------------------------------------------------------------------- | ---------- | ------ | -------------- |
| `next`     | public  | Selects the next step.                                                             |            | `void` |                |
| `previous` | public  | Selects the previous step.                                                         |            | `void` |                |
| `reset`    | public  | Resets the form in which the stepper is nested or every form of each step, if any. |            | `void` |                |

## Slots

| Name         | Description                                   |
| ------------ | --------------------------------------------- |
| `step-label` | Use this slot to provide an `sbb-step-label`. |
| `step`       | Use this slot to provide an `sbb-step`.       |
