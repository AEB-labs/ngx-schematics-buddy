import { SchematicContext, UpdateRecorder } from '@angular-devkit/schematics';
import { Element } from '@angular-eslint/bundled-angular-compiler';
import { AbstractTemplateAction } from '../abstract-template-action';
import { addAttribute } from '../helper-functions/add-attribute';
import {
  hasAttribute,
  TemplateActionCondition,
} from '../template-action-condition';

/**
 * Add an attribute to all elements that fulfill the provided conditions.
 *
 * Square brackets must be included if necessary.
 * If "value" is undefined, the attribute will be added without a value.
 *
 * If the attribute (or a variant with/without square brackets) already exists, does nothing
 */
export class AddAttributeAction extends AbstractTemplateAction {
  constructor(
    readonly params: {
      attribute: string;
      value: string | undefined;
      conditions: ReadonlyArray<TemplateActionCondition>;
    }
  ) {
    super(params.conditions);
  }

  protected migrateElement(
    recorder: UpdateRecorder,
    ctx: SchematicContext,
    element: Element,
    parents: Map<Element, Element>,
    fileContent: string
  ): void {
    if (hasAttribute(this.params.attribute)(element, parents)) {
      // already exists, don't add a second one
      return;
    }

    addAttribute({
      recorder,
      element,
      attributeName: this.params.attribute,
      value: this.params.value,
      fileContent,
    });
  }
}
