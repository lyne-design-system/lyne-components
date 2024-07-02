import type { TemplateResult } from 'lit';

import { SbbIconNameMixin } from '../../icon.js';
import { slotState } from '../decorators.js';
import { SbbNegativeMixin } from '../mixins.js';

import { SbbButtonBaseElement } from './button-base-element.js';

@slotState()
export abstract class SbbMiniButtonBaseElement extends SbbNegativeMixin(
  SbbIconNameMixin(SbbButtonBaseElement),
) {
  protected override renderTemplate(): TemplateResult {
    return super.renderIconSlot();
  }
}
